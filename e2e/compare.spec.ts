import { test, expect } from "@playwright/test";

test.describe("Compare Countries", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for countries to load
    await page.waitForSelector("h2", { timeout: 10000 });
  });

  test("enters and exits compare mode", async ({ page }) => {
    await page.getByRole("button", { name: /Compare Mode/i }).click();

    await expect(
      page.getByRole("button", { name: /Exit Compare Mode/i }),
    ).toBeVisible();

    await page.getByRole("button", { name: /Exit Compare Mode/i }).click();

    await expect(
      page.getByRole("button", { name: /Compare Mode/i }),
    ).toBeVisible();
  });

  test("selects countries and opens comparison modal", async ({ page }) => {
    await page.getByRole("button", { name: /Compare Mode/i }).click();

    // In compare mode, clicking cards selects them (use countries from first page)
    await page.getByRole("heading", { name: "Afghanistan" }).click();
    await page.getByRole("heading", { name: "Albania" }).click();

    // Compare Selected button should appear
    await expect(
      page.getByRole("button", { name: /Compare Selected \(2\)/i }),
    ).toBeVisible();

    // Open comparison modal
    await page.getByRole("button", { name: /Compare Selected/i }).click();

    // Modal should be visible
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});
