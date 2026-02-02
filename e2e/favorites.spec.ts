import { test, expect } from "@playwright/test";

test("favorites page shows empty state and populates with favorites", async ({
  page,
}) => {
  // 1. Go directly to favorites page with no favorites
  await page.goto("/favorites");
  await expect(page.getByText(/No favorites yet/i)).toBeVisible();
  await expect(page.getByText(/clicking the heart icon/i)).toBeVisible();

  // 2. Click the link to go explore
  await page.getByRole("link", { name: /Browse Countries/i }).click();
  await expect(page).toHaveURL("/");

  // 3. Add a country to favorites
  const countryCard = page.locator("a").filter({
    has: page.getByRole("heading", { name: "Afghanistan" }),
  });
  await countryCard.locator("button").click();
  await expect(page.getByText(/Favorites \(1\)/i)).toBeVisible();

  // 4. Navigate to favorites page
  await page.getByRole("link", { name: /Favorites/i }).click();
  await expect(page).toHaveURL("/favorites");

  // 5. Verify favorite is displayed
  await expect(
    page.getByRole("heading", { name: "Afghanistan" }),
  ).toBeVisible();
  await expect(page.getByText(/No favorites yet/i)).not.toBeVisible();
});
