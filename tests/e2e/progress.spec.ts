import { test, expect } from "@playwright/test";

test.describe("Progress Dashboard", () => {
  test("renders metrics and switches chart mode", async ({ page }) => {
    const dataRequest = page.waitForResponse("**/data/garmin_summary.json");
    await page.goto("/progress");
    await dataRequest;

    await expect(
      page.getByRole("heading", { name: /Dashboard de Progresso/i })
    ).toBeVisible();

    const loading = page.getByText("Carregando dashboard...");
    await expect(loading).not.toBeVisible();

    await expect(page.getByText(/Total de Corridas/i)).toBeVisible();
    await expect(page.getByText(/Distância Total/i)).toBeVisible();

    const chartHeading = page.getByRole("heading", {
      name: /Distância por Treino/i,
    });
    await expect(chartHeading).toBeVisible();

    await page.getByRole("button", { name: "Mês" }).click();
    await expect(
      page.getByRole("heading", { name: /Distância por Mês/i })
    ).toBeVisible();
  });
});
