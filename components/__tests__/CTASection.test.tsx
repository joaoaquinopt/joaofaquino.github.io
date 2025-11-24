import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import CTASection from "../CTASection";

vi.mock("../Reveal", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("CTASection", () => {
  it("highlights the social call to action", () => {
    render(<CTASection />);

    expect(
      screen.getByRole("heading", { name: /Segue a Jornada/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Acompanha cada passo rumo à maratona de 2026")
    ).toBeInTheDocument();
  });

  it("links out to Instagram and Strava profiles", () => {
    render(<CTASection />);

    expect(screen.getByRole("link", { name: /@joaofaquino/i })).toHaveAttribute(
      "href",
      "https://instagram.com/joaofaquino"
    );
    expect(screen.getByRole("link", { name: /strava/i })).toHaveAttribute(
      "href",
      "https://www.strava.com/athletes/joaoaquino"
    );
  });
});