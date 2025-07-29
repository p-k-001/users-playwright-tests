import { test, expect } from "@playwright/test";

test('homepage has title "test API"', async ({ page }) => {
  await page.goto("https://users.projects.icanbreakit.eu");
  await expect(page).toHaveTitle("test API");
});
