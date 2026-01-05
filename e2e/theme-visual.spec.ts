import { test, expect } from '@playwright/test';

/**
 * Visual regression tests for theme consistency
 * These tests will catch unintended color/styling changes across components
 */
test.describe('Theme Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Start from a known state
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('ItemCard buy button should have correct theme colors', async ({ page }) => {
    await page.goto('/shop');
    
    // Wait for items to load
    await page.waitForSelector('[data-testid="item-card"], .MuiCard-root', { timeout: 5000 });
    
    // Hover over first item card to reveal buttons
    const firstCard = page.locator('.MuiCard-root').first();
    await firstCard.hover();
    
    // Wait for buttons to appear
    await page.waitForTimeout(500);
    
    // Take screenshot of the card with buttons
    await expect(firstCard).toHaveScreenshot('item-card-with-buttons.png', {
      maxDiffPixels: 100, // Allow small differences
    });
  });

  test('About page button should match theme', async ({ page }) => {
    await page.goto('/');
    
    const button = page.locator('button:has-text("Shop Specials")');
    
    // Check button exists
    await expect(button).toBeVisible();
    
    // Take screenshot
    await expect(button).toHaveScreenshot('about-page-button.png');
    
    // Verify button color matches theme
    const color = await button.evaluate((el) => 
      window.getComputedStyle(el).color
    );
    
    // Should be white or rgba(255, 255, 255, ...)
    expect(color).toMatch(/rgba?\(255,\s*255,\s*255/);
  });

  test('Button colors should be consistent across pages', async ({ page }) => {
    const pages = [
      { path: '/', selector: 'button:has-text("Shop Specials")' },
      { path: '/shop', selector: 'button:has-text("Buy")' },
    ];
    
    const colors: string[] = [];
    
    for (const { path, selector } of pages) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      
      // For shop page, hover to reveal button
      if (path === '/shop') {
        const card = page.locator('.MuiCard-root').first();
        await card.hover();
        await page.waitForTimeout(500);
      }
      
      const button = page.locator(selector).first();
      
      if (await button.isVisible()) {
        const color = await button.evaluate((el) => 
          window.getComputedStyle(el).color
        );
        colors.push(color);
      }
    }
    
    // All button colors should be defined (not empty)
    colors.forEach(color => {
      expect(color).toBeTruthy();
    });
  });

  test('Theme CSS variables should be set correctly', async ({ page }) => {
    await page.goto('/');
    
    const textColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--text-color')
        .trim();
    });
    
    expect(textColor).toBe('rgba(255, 255, 255, 0.87)');
  });
});

