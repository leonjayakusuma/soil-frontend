import { describe, it, expect } from 'vitest';
import { theme } from '@/App';

/**
 * Tests to ensure theme configuration doesn't break
 * These catch unintended changes to theme structure
 */
describe('Theme Configuration', () => {
  it('should have primary color defined', () => {
    expect(theme.palette.primary).toBeDefined();
    expect(theme.palette.primary.main).toBeDefined();
  });

  it('should have secondary color defined', () => {
    expect(theme.palette.secondary).toBeDefined();
    expect(theme.palette.secondary.main).toBeDefined();
  });

  it('should have button style overrides configured', () => {
    expect(theme.components?.MuiButton).toBeDefined();
    expect(theme.components?.MuiButton?.styleOverrides).toBeDefined();
  });

  it('should have textPrimary button style for buy buttons', () => {
    const textPrimaryStyle = theme.components?.MuiButton?.styleOverrides?.textPrimary;
    expect(textPrimaryStyle).toBeDefined();
    
    // Verify it has color property
    if (textPrimaryStyle && typeof textPrimaryStyle === 'object' && 'color' in textPrimaryStyle) {
      expect(textPrimaryStyle.color).toBeDefined();
    }
  });

  it('should have consistent typography font family', () => {
    expect(theme.typography.fontFamily).toBe('Poppins, sans-serif');
  });

  it('should have border radius configured', () => {
    expect(theme.shape.borderRadius).toBe(10);
  });
});

