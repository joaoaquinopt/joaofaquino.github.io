import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useReveal } from "../useReveal";

const useInViewMock = vi.fn();

vi.mock("framer-motion", () => ({
  useInView: (...args: any[]) => useInViewMock(...args),
}));

describe("useReveal", () => {
  afterEach(() => {
    useInViewMock.mockReset();
  });

  it("returns a ref and forwards options to useInView", () => {
    useInViewMock.mockReturnValue(true);

    function TestComponent() {
      const { ref, isInView } = useReveal();
      return <div data-testid="result" data-in-view={isInView ? "true" : "false"} ref={ref} />;
    }

    const { getByTestId } = render(<TestComponent />);

    expect(useInViewMock).toHaveBeenCalledWith(expect.any(Object), {
      once: true,
      margin: "-50px",
    });
    const resultNode = getByTestId("result");
    expect(resultNode.dataset.inView).toBe("true");
    const refArg = useInViewMock.mock.calls[0][0];
    expect(refArg.current).toBe(resultNode);
  });
});