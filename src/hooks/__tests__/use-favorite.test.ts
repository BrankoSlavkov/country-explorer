import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useFavorite } from "../use-favorite";

describe("useFavorite", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("tracks and toggles favorite state for a single country", () => {
    const { result } = renderHook(() => useFavorite("USA"));

    expect(result.current.isFavorite).toBe(false);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isFavorite).toBe(true);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isFavorite).toBe(false);
  });

  it("handles undefined countryCode safely", () => {
    const { result } = renderHook(() => useFavorite(undefined));

    expect(result.current.isFavorite).toBe(false);

    act(() => {
      result.current.toggle(); // Should not throw
    });
    expect(result.current.isFavorite).toBe(false);
  });
});
