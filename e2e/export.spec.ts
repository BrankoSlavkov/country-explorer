import { test, expect } from "@playwright/test";

test("export country data as CSV", async ({ page }) => {
  // 1. Navigate to a country detail page
  await page.goto("/Australia");
  await expect(
    page.getByRole("heading", { name: /Australia/i, level: 1 }),
  ).toBeVisible();

  // 2. Click export button and verify download starts
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Export country data/i }).click();
  const download = await downloadPromise;

  // 3. Verify filename
  expect(download.suggestedFilename()).toBe("australia-details.csv");
});
