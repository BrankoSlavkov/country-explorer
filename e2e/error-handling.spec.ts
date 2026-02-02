import { test, expect } from "@playwright/test";

test("shows error state for non-existent country", async ({ page }) => {
  // 1. Navigate to a country that doesn't exist
  await page.goto("/ThisCountryDoesNotExist");

  // 2. Verify error state is shown
  await expect(page.getByText(/Country Not Found/i)).toBeVisible();
  await expect(page.getByText(/couldn't find/i)).toBeVisible();

  // 3. Click back to countries link
  await page.getByRole("link", { name: /Back to Countries/i }).click();
  await expect(page).toHaveURL("/");
});
