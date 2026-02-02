import { test, expect } from "@playwright/test";

test("pagination and URL persistence", async ({ page }) => {
  // 1. Load app
  await page.goto("/");

  // 2. Navigate to page 2
  await page.getByRole("button", { name: /Next/i }).click();
  await expect(page).toHaveURL(/page=2/);

  // 3. Change items per page
  await page.locator("select").filter({ hasText: "20" }).selectOption("50");
  await expect(page).toHaveURL(/perPage=50/);
  // Should reset to page 1 when changing perPage
  await expect(page).toHaveURL(/page=1/);

  // 4. Apply a filter and verify URL contains all params
  await page.locator("#filter-continent").selectOption("Europe");
  await expect(page).toHaveURL(/continent=Europe/);

  // 5. Reload and verify state persists
  await page.reload();
  await expect(page.locator("#filter-continent")).toHaveValue("Europe");
});
