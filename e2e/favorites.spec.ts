import { test, expect } from "@playwright/test";

test.describe("Favorites", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    // Wait for countries to load
    await page.waitForSelector("h2", { timeout: 10000 });
  });

  test("adds country to favorites and updates count", async ({ page }) => {
    await expect(page.getByText(/Favorites \(0\)/i)).toBeVisible();

    // Click the heart button on the Afghanistan card (first country alphabetically)
    const afghanistanCard = page.locator("a", {
      has: page.getByRole("heading", { name: "Afghanistan" }),
    });
    await afghanistanCard.locator("button").click();

    await expect(page.getByText(/Favorites \(1\)/i)).toBeVisible();
  });

  test("persists favorites across page reloads", async ({ page }) => {
    const afghanistanCard = page.locator("a", {
      has: page.getByRole("heading", { name: "Afghanistan" }),
    });
    await afghanistanCard.locator("button").click();

    await page.reload();
    await page.waitForSelector("h2", { timeout: 10000 });

    await expect(page.getByText(/Favorites \(1\)/i)).toBeVisible();
  });

  test("navigates to favorites page", async ({ page }) => {
    const afghanistanCard = page.locator("a", {
      has: page.getByRole("heading", { name: "Afghanistan" }),
    });
    await afghanistanCard.locator("button").click();

    await page.getByRole("link", { name: /Favorites/i }).click();

    await expect(page).toHaveURL("/favorites");
    await page.waitForSelector("h2", { timeout: 10000 });
    await expect(
      page.getByRole("heading", { name: "Afghanistan" }),
    ).toBeVisible();
  });
});
