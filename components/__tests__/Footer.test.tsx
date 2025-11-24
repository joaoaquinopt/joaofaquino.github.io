import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Footer from "../Footer";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: React.ComponentPropsWithoutRef<"a">) => (
    <a {...props}>{children}</a>
  ),
}));

describe("Footer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-11-24T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows copyright and privacy link", () => {
    render(<Footer />);

    const copyright = screen.getByText(
      /João Aquino — Road to Marathon 2026/i
    );
    expect(copyright).toHaveTextContent("© 2025");
    expect(screen.getByRole("link", { name: /Política de Privacidade/i })).toHaveAttribute(
      "href",
      "/privacy"
    );
  });

  it("exposes social and contact links", () => {
    render(<Footer />);

    const [instagramLink] = screen.getAllByLabelText("Instagram");
    expect(instagramLink).toHaveAttribute(
      "href",
      "https://instagram.com/joaofaquino"
    );
    const [githubLink] = screen.getAllByLabelText("GitHub");
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/joaoaquinopt"
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute("href", "mailto:joaofaquino@gmail.com");
  });
});