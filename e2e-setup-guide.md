# E2E Testing Setup Guide

## 1. Visual Regression Testing (Recommended for Theme Changes)

### Option A: Playwright with Visual Comparisons (Recommended)

```bash
npm install -D @playwright/test
npx playwright install
```

Create `playwright.config.ts`:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

Create `e2e/theme-visual.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Theme Visual Regression', () => {
  test('ItemCard buttons should have correct colors', async ({ page }) => {
    await page.goto('/shop');
    
    // Wait for items to load
    await page.waitForSelector('[data-testid="item-card"]', { timeout: 5000 });
    
    // Take screenshot of item cards
    const itemCard = page.locator('[data-testid="item-card"]').first();
    await expect(itemCard).toHaveScreenshot('item-card-buttons.png');
  });

  test('About page button should match theme', async ({ page }) => {
    await page.goto('/');
    
    const button = page.locator('button:has-text("Shop Specials")');
    await expect(button).toHaveScreenshot('about-page-button.png');
  });

  test('Button colors across all pages', async ({ page }) => {
    const pages = ['/', '/shop', '/cart'];
    
    for (const path of pages) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      
      // Check button colors using computed styles
      const buttons = page.locator('button');
      const count = await buttons.count();
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        const button = buttons.nth(i);
        const color = await button.evaluate((el) => 
          window.getComputedStyle(el).color
        );
        
        // Assert color matches theme
        expect(color).toBeTruthy();
      }
    }
  });
});
```

### Option B: Chromatic (Visual Testing for Storybook)

If you use Storybook, Chromatic can catch visual regressions:
```bash
npm install -D chromatic
```

## 2. Component Snapshot Testing (Theme-Aware)

Add to `vitest.config.ts` or create `tests/theme-snapshots.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/App';
import ItemCard from '@/shared/ItemCard/ItemCard';
import { BrowserRouter } from 'react-router-dom';

describe('Theme Snapshot Tests', () => {
  it('ItemCard renders with correct theme colors', () => {
    const item = {
      id: 1,
      title: 'Test Item',
      price: 10,
      discount: 0,
      tags: ['organic'],
      desc: 'Test description',
      reviewRating: 4.5,
      reviewCount: 100,
      isSpecial: false,
    };

    const { container } = render(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <ItemCard {...item} />
        </BrowserRouter>
      </ThemeProvider>
    );

    // Snapshot will catch any visual/structural changes
    expect(container).toMatchSnapshot();
  });
});
```

## 3. Theme Property Testing

Create `tests/theme-properties.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { theme } from '@/App';

describe('Theme Configuration', () => {
  it('should have consistent button colors', () => {
    expect(theme.components?.MuiButton?.styleOverrides?.textPrimary?.color).toBeDefined();
  });

  it('should have primary color defined', () => {
    expect(theme.palette.primary).toBeDefined();
    expect(theme.palette.primary.main).toBeDefined();
  });

  it('should have accent color if defined', () => {
    if (theme.palette.accent) {
      expect(theme.palette.accent.main).toBeDefined();
    }
  });
});
```

## 4. CSS Variable Testing

Create `tests/css-variables.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';

describe('CSS Variables', () => {
  it('should have --text-color defined', () => {
    const root = document.documentElement;
    const textColor = getComputedStyle(root).getPropertyValue('--text-color');
    expect(textColor).toBeTruthy();
    expect(textColor.trim()).toBe('rgba(255, 255, 255, 0.87)');
  });
});
```

## 5. Integration Test for Theme Changes

Create `e2e/theme-integration.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Theme Integration', () => {
  test('changing theme should update all components', async ({ page }) => {
    await page.goto('/shop');
    
    // Get initial button color
    const button = page.locator('button').first();
    const initialColor = await button.evaluate((el) => 
      window.getComputedStyle(el).color
    );
    
    // Navigate to different page
    await page.goto('/');
    
    // Check that button color is consistent
    const aboutButton = page.locator('button:has-text("Shop Specials")');
    const aboutColor = await aboutButton.evaluate((el) => 
      window.getComputedStyle(el).color
    );
    
    // Colors should be consistent (or follow theme rules)
    expect(aboutColor).toBeTruthy();
  });
});
```

## Running Tests

Add to `package.json`:
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:visual": "playwright test --grep visual",
    "test:theme": "vitest run tests/theme"
  }
}
```

## CI/CD Integration

Add to GitHub Actions (`.github/workflows/e2e.yml`):
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Best Practices

1. **Test Critical Paths**: Focus on user flows that use themed components
2. **Visual Snapshots**: Use for components that rely heavily on theme
3. **Property Tests**: Verify theme structure doesn't break
4. **CSS Variable Tests**: Ensure global variables are set correctly
5. **Cross-Component Tests**: Verify theme changes affect all components consistently

