import { test, expect } from "@playwright/test";

test.describe("Equipment Page", () => {
  test("shows under construction messaging", async ({ page }) => {
    await page.goto("/equipment");

    await expect(
      page.getByRole("heading", { name: /Equipamentos/i })
    ).toBeVisible();
    await expect(page.getByText(/Em construção/i)).toBeVisible();
    await expect(
      page.getByText(/Enquanto isso, podes acompanhar os treinos/i)
    ).toBeVisible();
  });
});
