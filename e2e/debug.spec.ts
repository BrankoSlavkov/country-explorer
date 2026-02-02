import { test, expect } from "@playwright/test";

test("debug page content", async ({ page }) => {
  await page.goto("/");

  // Wait a bit for content to potentially load
  await page.waitForTimeout(5000);

  // Take a screenshot
  await page.screenshot({ path: "debug-screenshot.png", fullPage: true });

  // Log the page content
  const content = await page.content();
  console.log("Page HTML length:", content.length);
  console.log("Contains 'Germany':", content.includes("Germany"));
  console.log("Contains 'Loading':", content.includes("Loading"));
  console.log(
    "Contains 'Country Explorer':",
    content.includes("Country Explorer"),
  );

  // Check what h2 elements exist
  const h2Count = await page.locator("h2").count();
  console.log("h2 elements count:", h2Count);

  if (h2Count > 0) {
    const h2Texts = await page.locator("h2").allTextContents();
    console.log("h2 texts:", h2Texts.slice(0, 5));
  }
});
