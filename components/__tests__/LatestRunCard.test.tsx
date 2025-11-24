import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import LatestRunCard from "../LatestRunCard";

vi.mock("../Reveal", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("LatestRunCard", () => {
  it("renders a placeholder while data loads", () => {
    render(<LatestRunCard />);

    expect(screen.getByText("A carregar dados...")).toBeInTheDocument();
  });

  it("displays core and optional metrics when data is provided", () => {
    render(
      <LatestRunCard
        data={{
          title: "Corrida matinal",
          date: "13/11/2025",
          distance: 10.5,
          time: "00:52:30",
          pace: "05:00",
          avg_hr: 145,
          calories: 450,
        }}
      />
    );

    expect(screen.getByText("Corrida matinal")).toBeInTheDocument();
    expect(screen.getByText("13/11/2025")).toBeInTheDocument();
    expect(screen.getByText("10.50")).toBeInTheDocument();
    expect(screen.getByText("00:52:30")).toBeInTheDocument();
    expect(screen.getByText("05:00")).toBeInTheDocument();
    expect(screen.getByText(/FC média/i)).toBeInTheDocument();
    expect(screen.getByText(/Calorias/i)).toBeInTheDocument();
    expect(screen.getByText(/145/)).toBeInTheDocument();
    expect(screen.getByText(/450/)).toBeInTheDocument();
  });

  it("hides optional metrics when values are missing", () => {
    render(
      <LatestRunCard
        data={{
          title: "Treino fácil",
          date: "2025-11-14",
          distance: 5,
          time: "00:30:00",
          pace: "06:00",
        }}
      />
    );

    expect(screen.queryByText(/FC média/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Calorias/i)).not.toBeInTheDocument();
  });
});