import { test, expect } from "@playwright/test";

test("complete user journey: browse, filter, favorite, compare, and explore details", async ({
  page,
}) => {
  // 1. Load the app and verify countries are displayed
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Country Explorer" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Afghanistan" }),
  ).toBeVisible();

  // 2. Search for a country
  await page.getByPlaceholder(/Type to search/i).fill("Germany");
  await page.waitForTimeout(500);
  await expect(page.getByRole("heading", { name: "Germany" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Afghanistan" }),
  ).not.toBeVisible();

  // 3. Clear search and filter by continent
  await page.getByPlaceholder(/Type to search/i).clear();
  await page.waitForTimeout(500);
  await page.locator("#filter-continent").selectOption("Europe");
  await expect(page.getByRole("heading", { name: "Germany" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Albania" })).toBeVisible();

  // 4. Add Germany to favorites
  const germanyCard = page.locator("a").filter({
    has: page.getByRole("heading", { name: "Germany" }),
  });
  await germanyCard.locator("button").click();
  await expect(page.getByText(/Favorites \(1\)/i)).toBeVisible();

  // 5. Reset filters and verify favorite is prioritized
  await page.locator("#filter-continent").selectOption("");
  await page.waitForTimeout(300);
  // Germany should be first because it's favorited
  const firstCountryCard = page.locator("h2").first();
  await expect(firstCountryCard).toHaveText("Germany");

  // 6. Navigate to Germany's detail page
  await germanyCard.click();
  await expect(page).toHaveURL(/\/Germany/);
  await expect(
    page.getByRole("heading", { name: /Germany/i, level: 1 }),
  ).toBeVisible();
  await expect(page.getByText(/Berlin/i)).toBeVisible();
  await expect(page.getByText("Population", { exact: true })).toBeVisible();

  // 7. Navigate to a border country (France)
  await page.locator("a").filter({ hasText: "France" }).click();
  await expect(page).toHaveURL(/\/France/);
  await expect(
    page.getByRole("heading", { name: /France/i, level: 1 }),
  ).toBeVisible();

  // 8. Go back to home
  await page.getByText(/Back to Countries/i).click();
  await expect(page).toHaveURL("/");

  // 9. Enter compare mode and select countries
  await page.getByRole("button", { name: /Compare Mode/i }).click();
  await expect(
    page.getByRole("button", { name: /Exit Compare Mode/i }),
  ).toBeVisible();

  // Select first two countries (Germany should still be first as favorite)
  await page.getByRole("heading", { name: "Germany" }).click();
  await page.getByRole("heading", { name: "Afghanistan" }).click();
  await expect(
    page.getByRole("button", { name: /Compare Selected \(2\)/i }),
  ).toBeVisible();

  // 10. Open comparison modal
  await page.getByRole("button", { name: /Compare Selected/i }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText(/Population Comparison/i)).toBeVisible();
  await expect(page.getByText(/Area Comparison/i)).toBeVisible();

  // 11. Close modal and exit compare mode
  await page
    .locator(".fixed.inset-0.bg-black\\/80")
    .click({ position: { x: 10, y: 10 } });
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: /Exit Compare Mode/i }).click();
  await expect(
    page.getByRole("button", { name: /Compare Mode/i }),
  ).toBeVisible();

  // 12. Navigate to favorites page
  await page.getByRole("link", { name: /Favorites/i }).click();
  await expect(page).toHaveURL("/favorites");
  await expect(page.getByRole("heading", { name: "Germany" })).toBeVisible();

  // 13. Remove from favorites
  const favoriteCard = page.locator("a").filter({
    has: page.getByRole("heading", { name: "Germany" }),
  });
  await favoriteCard.locator("button").click();
  await expect(page.getByText(/No favorites yet/i)).toBeVisible();

  // 14. Go back home and verify favorites count is 0
  await page.goto("/");
  await expect(page.getByText(/Favorites \(0\)/i)).toBeVisible();
});
