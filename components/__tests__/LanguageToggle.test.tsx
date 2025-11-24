import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import LanguageToggle from "../LanguageToggle";
import { TranslationProvider } from "../TranslationProvider";

describe("LanguageToggle", () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  const renderToggle = () =>
    render(
      <TranslationProvider>
        <LanguageToggle />
      </TranslationProvider>
    );

  it("shows Portuguese by default and toggles to English", async () => {
    renderToggle();

    const button = screen.getByRole("button", { name: /toggle language/i });
    expect(button).toHaveTextContent("🇵🇹 PT");

    await userEvent.click(button);

    expect(button).toHaveTextContent("🇬🇧 EN");
    expect(globalThis.localStorage.getItem("language")).toBe("en");

    await userEvent.click(button);

    expect(button).toHaveTextContent("🇵🇹 PT");
    expect(globalThis.localStorage.getItem("language")).toBe("pt");
  });

  it("honors a persisted language preference", () => {
    globalThis.localStorage.setItem("language", "en");

    renderToggle();

    expect(
      screen.getByRole("button", { name: /toggle language/i })
    ).toHaveTextContent("🇬🇧 EN");
  });
});