import { test, expect } from "@playwright/test";

test.describe("Pagination", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for countries to load
    await page.waitForSelector("h2", { timeout: 10000 });
  });

  test("navigates between pages", async ({ page }) => {
    await page.getByRole("button", { name: /Next/i }).click();
    await expect(page).toHaveURL(/page=2/);

    await page.getByRole("button", { name: /Previous/i }).click();
    await expect(page).toHaveURL(/page=1/);
  });

  test("changes items per page", async ({ page }) => {
    await page.locator("select").filter({ hasText: "20" }).selectOption("50");

    await expect(page).toHaveURL(/perPage=50/);
  });
});
