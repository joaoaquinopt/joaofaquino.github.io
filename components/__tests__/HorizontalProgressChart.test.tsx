import { render, screen } from "@testing-library/react";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import HorizontalProgressChart from "../HorizontalProgressChart";

const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);

afterEach(() => {
  consoleLogSpy.mockClear();
});

afterAll(() => {
  consoleLogSpy.mockRestore();
});

describe("HorizontalProgressChart", () => {
  it("shows an empty state when there are no activities", () => {
    render(<HorizontalProgressChart activities={[]} />);

    expect(screen.getByText(/Sem dados para exibir/i)).toBeInTheDocument();
  });

  it("renders run mode sorted by date with pace formatting", () => {
    const { container } = render(
      <HorizontalProgressChart
        activities={[
          {
            date: "2025-11-15",
            distance: 5,
            average_pace: 5,
          },
          {
            date: "2025-11-14",
            distance: 10,
            pace: "4:30/km",
          },
        ]}
      />
    );

    expect(screen.getAllByText(/km$/).map((el) => el.textContent)).toEqual(
      expect.arrayContaining(["10.0 km", "5.0 km"])
    );

    const labels = screen
      .getAllByText(/\d{2}\/\d{2}/)
      .map((node) => node.textContent || "");
    const uniqueLabels = labels.filter((label, index, arr) => arr.indexOf(label) === index);
    expect(uniqueLabels).toEqual(["14/11", "15/11"]);

    expect(screen.getByText("4:30/km")).toBeInTheDocument();
    expect(screen.getByText("5:00/km")).toBeInTheDocument();

    const bars = container.querySelectorAll("[style*='linear-gradient']");
    expect(bars).toHaveLength(2);
    expect(bars[0]).toHaveStyle({ height: "100%" });
    expect(bars[1]).toHaveStyle({ height: "50%" });
  });

  it("aggregates activities by month when mode is set to month", () => {
    const localeSpy = vi.spyOn(Date.prototype, "toLocaleDateString");

    localeSpy.mockImplementation(function (this: Date) {
      return `${this.getMonth() + 1}/${this.getFullYear()}`;
    });

    try {
      const { container } = render(
        <HorizontalProgressChart
          mode="month"
          activities={[
            { date: "2025-11-01", distance: 10 },
            { date: "2025-11-20", distance: 5 },
            { date: "2025-12-05", distance: 8 },
          ]}
        />
      );

      expect(screen.queryByText(/Sem dados/i)).not.toBeInTheDocument();

      const labels = screen
        .getAllByText(/\d{1,2}\/2025/)
        .map((node) => node.textContent || "");
      const uniqueLabels = labels.filter((label, index, arr) => arr.indexOf(label) === index);
      expect(uniqueLabels).toEqual(["11/2025", "12/2025"]);

      expect(screen.queryAllByText("15.0 km")).not.toHaveLength(0);
      expect(screen.queryAllByText("8.0 km")).not.toHaveLength(0);

      const bars = container.querySelectorAll("[style*='linear-gradient']");
      expect(bars).toHaveLength(2);
      expect(bars[0]).toHaveStyle({ height: "100%" });

      const secondHeight = (bars[1] as HTMLElement).style.height;
      expect(Number.parseFloat(secondHeight)).toBeCloseTo(53.33, 2);
    } finally {
      localeSpy.mockRestore();
    }
  });

  it("handles zero-distance runs and missing pace gracefully", () => {
    const { container } = render(
      <HorizontalProgressChart
        activities={[
          {
            date: "2025-11-10",
            distance: 0,
          },
        ]}
      />
    );

    expect(screen.getAllByText("0.0 km")).not.toHaveLength(0);
    expect(screen.getByText("N/A")).toBeInTheDocument();
    expect(screen.getAllByText("10/11")).not.toHaveLength(0);

    const bar = container.querySelector("[style*='linear-gradient']") as HTMLElement;
    expect(bar.style.height).toBe("0%");
  });

  it("shows empty state when month aggregation yields no valid data", () => {
    render(
      <HorizontalProgressChart
        mode="month"
        activities={[
          { date: "invalid", distance: 5 },
          { date: "", distance: 3 },
        ]}
      />
    );

    expect(screen.getByText(/Sem dados para exibir/i)).toBeInTheDocument();
  });
});