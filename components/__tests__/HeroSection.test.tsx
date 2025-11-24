import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import HeroSection from "../HeroSection";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: React.ComponentPropsWithoutRef<"a">) => (
    <a {...props}>{children}</a>
  ),
}));

describe("HeroSection", () => {
  it("displays the main narrative and CTAs", () => {
    render(<HeroSection />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /um pai, um ex-fumador/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Estou a documentar a jornada real/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Próxima grande meta/i)).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /ver jornada/i })).toHaveAttribute(
      "href",
      "#journey"
    );
    expect(
      screen.getByRole("link", { name: /ver últimas corridas/i })
    ).toHaveAttribute("href", "#runs");
  });
});