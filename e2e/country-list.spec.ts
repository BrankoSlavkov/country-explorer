import { test, expect } from "@playwright/test";

test.describe("Country List", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for countries to load
    await page.waitForSelector("h2", { timeout: 10000 });
  });

  test("displays countries in a grid", async ({ page }) => {
    // First page shows countries starting with A (sorted alphabetically)
    await expect(
      page.getByRole("heading", { name: "Afghanistan" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Albania" })).toBeVisible();
  });

  test("shows country details on hover", async ({ page }) => {
    const countryCard = page.locator("a", {
      has: page.getByRole("heading", { name: "Afghanistan" }),
    });
    await countryCard.hover();

    await expect(page.getByText(/Capital:/i)).toBeVisible();
  });

  test("navigates to country detail page on click", async ({ page }) => {
    await page
      .locator("a", { has: page.getByRole("heading", { name: "Albania" }) })
      .click();

    await expect(page).toHaveURL(/\/Albania/);
    await expect(
      page.getByRole("heading", { name: /Albania/i, level: 1 }),
    ).toBeVisible();
  });
});
