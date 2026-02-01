import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebounce } from "../use-debounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("delays callback execution by specified time", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    result.current("test");
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledWith("test");
  });

  it("cancels previous call when called again before delay", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    result.current("first");
    vi.advanceTimersByTime(300);
    result.current("second");
    vi.advanceTimersByTime(500);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("second");
  });
});
