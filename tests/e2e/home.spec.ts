import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("shows hero narrative and loads Garmin stats", async ({ page }) => {
    const dataRequest = page.waitForResponse("**/data/garmin_summary.json");
    await page.goto("/");
    await dataRequest;

    await expect(page.getByText("Road to Marathon 2026")).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: /Um pai, um ex-fumador, a caminho da primeira maratona em 2026/i,
      })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Ver jornada/i })
    ).toBeVisible();

    await expect(page.getByText(/Média por treino/i)).toBeVisible();
    await expect(page.getByText(/Última corrida/i)).toBeVisible();
  });

  test("navigates to the progress dashboard from the header", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Progresso/i }).click();

    await expect(page).toHaveURL(/\/progress$/);
    await expect(
      page.getByRole("heading", { name: /Dashboard de Progresso/i })
    ).toBeVisible();
  });
});
