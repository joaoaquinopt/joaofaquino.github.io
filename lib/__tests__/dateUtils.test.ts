import { describe, expect, it } from "vitest";
import { formatActivityDayMonth } from "../dateUtils";

describe("formatActivityDayMonth", () => {
  it("returns placeholder for empty values", () => {
    expect(formatActivityDayMonth()).toBe("--/--");
    expect(formatActivityDayMonth("")).toBe("--/--");
  });

  it("formats slash separated dates", () => {
    expect(formatActivityDayMonth("13/11/2025")).toBe("13/11");
  });

  it("handles ISO style dates with time components", () => {
    expect(formatActivityDayMonth("2025-11-13")).toBe("13/11");
    expect(formatActivityDayMonth("2025-11-13T10:45:00Z")).toBe("13/11");
  });

  it("falls back to original chunk when parsing fails", () => {
    expect(formatActivityDayMonth("2025-11-XX")).toBe("2025-11-XX");
    expect(formatActivityDayMonth("invalid")).toBe("invalid");
  });
});
