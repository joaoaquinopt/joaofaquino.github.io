import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import PageWrapper from "../PageWrapper";

const sectionSpy = vi.fn((props: any) => <section {...props} />);

vi.mock("framer-motion", () => ({
  motion: {
    section: (props: any) => sectionSpy(props),
  },
}));

describe("PageWrapper", () => {
  afterEach(() => {
    sectionSpy.mockClear();
  });

  it("passes animation props to the motion section", () => {
    render(
      <PageWrapper>
        <span>Conteúdo</span>
      </PageWrapper>
    );

    expect(sectionSpy).toHaveBeenCalledTimes(1);
    const callProps = sectionSpy.mock.calls[0][0];
    expect(callProps.initial).toEqual({ opacity: 0, y: 10 });
    expect(callProps.animate).toEqual({ opacity: 1, y: 0 });
    expect(callProps.exit).toEqual({ opacity: 0, y: -10 });
    expect(callProps.className).toContain("min-h-screen");
    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
  });
});