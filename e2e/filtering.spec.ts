import { test, expect } from "@playwright/test";

test.describe("Filtering and Sorting", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for countries to load
    await page.waitForSelector("h2", { timeout: 10000 });
  });

  test("filters countries by search term", async ({ page }) => {
    await page.getByPlaceholder(/Type to search/i).fill("Germany");

    // Wait for debounce and filtering
    await page.waitForTimeout(400);

    await expect(page.getByRole("heading", { name: "Germany" })).toBeVisible();
  });

  test("filters countries by continent", async ({ page }) => {
    await page.locator("#filter-continent").selectOption("Africa");

    // Wait for list to update
    await page.waitForTimeout(300);

    // Algeria is the first African country alphabetically
    await expect(page.getByRole("heading", { name: "Algeria" })).toBeVisible();
  });

  test("sorts countries", async ({ page }) => {
    await page.locator("#sort-by").selectOption("name-desc");

    await expect(page).toHaveURL(/sortBy=name-desc/);
  });

  test("persists filters in URL", async ({ page }) => {
    await page.getByPlaceholder(/Type to search/i).fill("test");

    await page.waitForTimeout(400);
    await expect(page).toHaveURL(/search=test/);

    await page.reload();
    await expect(page.getByPlaceholder(/Type to search/i)).toHaveValue("test");
  });
});
