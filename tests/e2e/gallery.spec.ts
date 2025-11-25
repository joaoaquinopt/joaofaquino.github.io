import { test, expect } from "@playwright/test";

test.describe("Gallery Page", () => {
  test("filters by event and opens the modal", async ({ page }) => {
    const dataRequest = page.waitForResponse("**/data/gallery_index.json");
    await page.goto("/gallery");
    await dataRequest;

    await expect(page.getByRole("heading", { name: /Galeria/i })).toBeVisible();

    const photoCards = page.getByTestId("photo-card");
    await expect(photoCards.first()).toBeVisible();

    const initialCount = await photoCards.count();
    expect(initialCount).toBeGreaterThan(27);

    const meiaButton = page.locator('[data-event-id="meia2025"]');
    await expect(meiaButton).toBeVisible();
    await meiaButton.click();
    await expect(photoCards).toHaveCount(27);

    await photoCards.first().click();

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await expect(modal.getByRole("button", { name: /Fechar/i })).toBeVisible();

    await modal.getByRole("button", { name: /Fechar/i }).click();
    await expect(modal).not.toBeVisible();
  });
});
