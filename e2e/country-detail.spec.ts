import { test, expect } from "@playwright/test";

test.describe("Country Detail Page", () => {
  test("displays country information", async ({ page }) => {
    await page.goto("/Germany");

    await expect(page.getByRole("heading", { name: /Germany/i })).toBeVisible();
    await expect(page.getByText(/Berlin/i)).toBeVisible();
  });

  test("shows border countries", async ({ page }) => {
    await page.goto("/Germany");

    await expect(page.getByText(/Border Countries/i)).toBeVisible();
  });

  test("navigates to border country", async ({ page }) => {
    await page.goto("/Germany");

    await page.locator("a").filter({ hasText: "France" }).click();

    await expect(page).toHaveURL(/\/France/);
    await expect(page.getByRole("heading", { name: /France/i })).toBeVisible();
  });

  test("navigates back to country list", async ({ page }) => {
    await page.goto("/Germany");

    await page.getByText(/Back to Countries/i).click();

    await expect(page).toHaveURL("/");
  });
});
