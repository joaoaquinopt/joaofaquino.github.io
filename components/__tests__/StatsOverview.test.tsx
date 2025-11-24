import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import StatsOverview from "../StatsOverview";

vi.mock("../Reveal", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("StatsOverview", () => {
  it("renders totals and weekly progress in Portuguese", () => {
    render(
      <StatsOverview
        stats={{
          total_runs: 42,
          total_distance: 150.456,
          avg_pace: "5:10",
          total_time: "10:30",
          avg_distance: 7.5,
        }}
        thisWeek={{ runs: 3, distance: 20 }}
      />
    );

    expect(screen.getByText("Distância total")).toBeInTheDocument();
    expect(screen.getByText("150.5")).toBeInTheDocument();
    expect(screen.getByText(/treinos completos registados/i)).toBeInTheDocument();
    expect(screen.getByText(/Faltam 5.0 km/)).toBeInTheDocument();
    expect(screen.getByText("10h 30m")).toBeInTheDocument();
    expect(screen.getByText("5:10")).toBeInTheDocument();
  });

  it("indicates when the weekly goal has been achieved", () => {
    render(
      <StatsOverview
        stats={{
          total_runs: 10,
          total_distance: 80,
          avg_pace: "4:45",
          total_time: 7200,
          avg_distance: 8,
        }}
        thisWeek={{ runs: 5, distance: 30 }}
      />
    );

    expect(screen.getByText("Meta semanal alcançada")).toBeInTheDocument();
    expect(screen.getByText("5 corridas")).toBeInTheDocument();
  });

  it("returns null when stats are missing", () => {
    const { container } = render(<StatsOverview stats={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it("handles singular wording and missing average distance", () => {
    render(
      <StatsOverview
        stats={{
          total_runs: 1,
          total_distance: 10,
          avg_pace: "5:30",
          total_time: "1:15",
        }}
        thisWeek={{ runs: 1, distance: 10 }}
      />
    );

    expect(screen.getByText(/1 treino registado/i)).toBeInTheDocument();
    expect(screen.getByText(/Média por treino: - km/)).toBeInTheDocument();
  });
});
