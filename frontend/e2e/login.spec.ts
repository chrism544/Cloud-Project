import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByText('Portal Access')).toBeVisible();
    await expect(page.getByPlaceholder(/email or username/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /log in/i })).toBeVisible();
  });

  test('should show portal selector', async ({ page }) => {
    await page.goto('/login');

    const select = page.locator('select');
    await expect(select).toBeVisible();
  });

  test('should allow typing credentials', async ({ page }) => {
    await page.goto('/login');

    const emailInput = page.getByPlaceholder(/email or username/i);
    const passwordInput = page.getByPlaceholder(/password/i);

    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');

    await expect(emailInput).toHaveValue('test@example.com');
    await expect(passwordInput).toHaveValue('password123');
  });

  test('should have remember me checkbox', async ({ page }) => {
    await page.goto('/login');

    const checkbox = page.getByRole('checkbox');
    await expect(checkbox).toBeVisible();

    await checkbox.click();
    await expect(checkbox).toBeChecked();
  });

  test('should have forgot password link', async ({ page }) => {
    await page.goto('/login');

    const forgotLink = page.getByText('Forgot password?');
    await expect(forgotLink).toBeVisible();
    await expect(forgotLink).toHaveAttribute('href', '#');
  });
});

test.describe('Dashboard Navigation', () => {
  test.skip('should navigate to dashboard after login', async ({ page }) => {
    // This test would require a working backend
    // Skipping for now as it needs actual authentication
    await page.goto('/login');

    await page.getByPlaceholder(/email or username/i).fill('admin@example.com');
    await page.getByPlaceholder(/password/i).fill('admin123');
    await page.getByRole('button', { name: /log in/i }).click();

    // Would redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });
});
