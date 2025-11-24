import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Reveal from "../Reveal";

const divSpy = vi.fn((props: any) => <div {...props} />);
const useInViewMock = vi.fn();

vi.mock("framer-motion", () => ({
  motion: {
    div: (props: any) => divSpy(props),
  },
  useInView: (...args: any[]) => useInViewMock(...args),
}));

describe("Reveal", () => {
  afterEach(() => {
    divSpy.mockClear();
    useInViewMock.mockReset();
  });

  it("animates into view when the element becomes visible", () => {
    useInViewMock.mockReturnValue(true);

    render(
      <Reveal>
        <span>Conteúdo visível</span>
      </Reveal>
    );

    expect(useInViewMock).toHaveBeenCalledWith(expect.any(Object), {
      once: true,
      margin: "-50px",
    });

    const callProps = divSpy.mock.calls[0][0];
    expect(callProps.initial).toEqual({ opacity: 0, y: 30 });
    expect(callProps.animate).toEqual({ opacity: 1, y: 0 });
    expect(callProps.transition.delay).toBe(0);
    expect(screen.getByText("Conteúdo visível")).toBeInTheDocument();
  });

  it("keeps animation empty until the element is in view", () => {
    useInViewMock.mockReturnValue(false);

    render(
      <Reveal delay={0.2}>
        <span>Conteúdo oculto</span>
      </Reveal>
    );

    const callProps = divSpy.mock.calls[0][0];
    expect(callProps.animate).toEqual({});
    expect(callProps.transition.delay).toBe(0.2);
  });
});