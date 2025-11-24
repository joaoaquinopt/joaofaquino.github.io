import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TranslationProvider, useTranslation } from "../TranslationProvider";

function TranslationTestHarness() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <div>
      <span data-testid="current-language">{language}</span>
      <p data-testid="nav-label">{t("nav.journey")}</p>
      <button type="button" onClick={() => setLanguage("en")}>
        Switch to EN
      </button>
    </div>
  );
}

describe("TranslationProvider", () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  it("returns Portuguese strings by default and allows switching language", async () => {
    render(
      <TranslationProvider>
        <TranslationTestHarness />
      </TranslationProvider>
    );

    expect(screen.getByTestId("current-language")).toHaveTextContent("pt");
    expect(screen.getByTestId("nav-label")).toHaveTextContent("Jornada");

    await userEvent.click(screen.getByRole("button", { name: /switch to en/i }));

    expect(screen.getByTestId("current-language")).toHaveTextContent("en");
    expect(screen.getByTestId("nav-label")).toHaveTextContent("Journey");

    expect(globalThis.localStorage.getItem("language")).toBe("en");
  });

  it("reads the persisted language from localStorage", () => {
    globalThis.localStorage.setItem("language", "en");

    render(
      <TranslationProvider>
        <TranslationTestHarness />
      </TranslationProvider>
    );

    expect(screen.getByTestId("current-language")).toHaveTextContent("en");
    expect(screen.getByTestId("nav-label")).toHaveTextContent("Journey");
  });

  it("falls back to the key when translation is missing", () => {
    function MissingKeyHarness() {
      const { t } = useTranslation();
      return <p>{t("unknown.key")}</p>;
    }

    render(
      <TranslationProvider>
        <MissingKeyHarness />
      </TranslationProvider>
    );

    expect(screen.getByText("unknown.key")).toBeInTheDocument();
  });
});
