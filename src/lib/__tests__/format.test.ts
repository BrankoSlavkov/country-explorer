import { describe, expect, it } from "vitest";
import { formatStatistic } from "../format";

describe("formatStatistic", () => {
  it("formats small numbers without separators", () => {
    expect(formatStatistic(0)).toBe("0");
    expect(formatStatistic(1)).toBe("1");
    expect(formatStatistic(999)).toBe("999");
  });

  it("formats thousands with separators", () => {
    expect(formatStatistic(1000)).toBe("1,000");
    expect(formatStatistic(10000)).toBe("10,000");
    expect(formatStatistic(100000)).toBe("100,000");
  });

  it("formats millions with separators", () => {
    expect(formatStatistic(1000000)).toBe("1,000,000");
    expect(formatStatistic(1234567)).toBe("1,234,567");
  });

  it("formats large numbers (populations)", () => {
    expect(formatStatistic(331002651)).toBe("331,002,651");
    expect(formatStatistic(1439323776)).toBe("1,439,323,776");
  });

  it("formats decimal numbers", () => {
    expect(formatStatistic(1234.56)).toBe("1,234.56");
  });

  it("formats negative numbers", () => {
    expect(formatStatistic(-1000)).toBe("-1,000");
  });
});
