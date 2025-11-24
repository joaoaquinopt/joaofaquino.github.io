import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import JourneySection from "../JourneySection";

vi.mock("../Reveal", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("JourneySection", () => {
  it("describes the journey intro", () => {
    render(<JourneySection />);

    expect(
      screen.getByText(/Sou João Aquino, QA Engineer/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Cada quilómetro é um voto de confiança/i)
    ).toBeInTheDocument();
  });

  it("lists highlights and timeline milestones", () => {
    render(<JourneySection />);

    [
      "Nova energia",
      "Disciplina imperfeita",
      "Meta 2026",
      "Transformação real",
    ].forEach((title) => {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    });

    [
      "Primeiro passo",
      "Rotina em construção",
      "Treinos estruturados",
      "Partilha pública",
    ].forEach((milestone) => {
      expect(screen.getByText(milestone)).toBeInTheDocument();
    });

    expect(
      screen.getByText(/Nem sempre perfeito, mas sempre em frente/i)
    ).toBeInTheDocument();
  });
});