import { test, expect } from '@playwright/test';

test.describe('Entra Admin Center E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Entra admin
    await page.goto('http://localhost:3002/entra-admin');
  });

  test('displays dashboard with stats cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('Total Users')).toBeVisible();
    await expect(page.getByText('Total Groups')).toBeVisible();
    await expect(page.getByText('Total Devices')).toBeVisible();
  });

  test('navigation sidebar is visible', async ({ page }) => {
    await expect(page.getByText('Entra Admin')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Users' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Groups' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Devices' })).toBeVisible();
  });

  test('can navigate to Users page', async ({ page }) => {
    await page.getByRole('link', { name: 'Users' }).click();
    await expect(page).toHaveURL(/\/entra-admin\/users/);
    await expect(page.getByRole('heading', { name: /users/i })).toBeVisible();
  });

  test('can open create user modal', async ({ page }) => {
    await page.getByRole('link', { name: 'Users' }).click();
    await page.getByRole('button', { name: /new user/i }).click();
    await expect(page.getByText('Create New User')).toBeVisible();
  });

  test('can fill and submit create user form', async ({ page }) => {
    await page.getByRole('link', { name: 'Users' }).click();
    await page.getByRole('button', { name: /new user/i }).click();

    // Fill form
    await page.getByLabel(/display name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/department/i).fill('Engineering');
    await page.getByLabel(/job title/i).fill('Software Engineer');

    // Submit
    await page.getByRole('button', { name: /^create$/i }).click();

    // Verify success notification
    await expect(page.getByText(/user created successfully/i)).toBeVisible();
  });

  test('can navigate to Groups page', async ({ page }) => {
    await page.getByRole('link', { name: 'Groups' }).click();
    await expect(page).toHaveURL(/\/entra-admin\/groups/);
    await expect(page.getByRole('heading', { name: /^groups$/i })).toBeVisible();
  });

  test('can open create group modal', async ({ page }) => {
    await page.getByRole('link', { name: 'Groups' }).click();
    await page.getByRole('button', { name: /new group/i }).click();
    await expect(page.getByText('Create New Group')).toBeVisible();
  });

  test('can navigate to Devices page', async ({ page }) => {
    await page.getByRole('link', { name: 'Devices' }).click();
    await expect(page).toHaveURL(/\/entra-admin\/devices/);
    await expect(page.getByRole('heading', { name: /devices/i })).toBeVisible();
  });

  test('can open register device modal', async ({ page }) => {
    await page.getByRole('link', { name: 'Devices' }).click();
    await page.getByRole('button', { name: /register device/i }).click();
    await expect(page.getByText('Register New Device')).toBeVisible();
  });

  test('search functionality works', async ({ page }) => {
    await page.getByRole('link', { name: 'Users' }).click();

    const searchInput = page.getByPlaceholder(/search users/i);
    await searchInput.fill('john');
    await expect(searchInput).toHaveValue('john');
  });

  test('can close modals with cancel button', async ({ page }) => {
    await page.getByRole('link', { name: 'Users' }).click();
    await page.getByRole('button', { name: /new user/i }).click();

    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: /cancel/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
