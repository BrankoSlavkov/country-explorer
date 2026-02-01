import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { KEY } from "~/lib/favorites";
import { useFavorites } from "../use-favorites";

describe("useFavorites", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("toggles favorites and persists to localStorage", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite("USA");
    });

    expect(result.current.isFavorite("USA")).toBe(true);
    expect(JSON.parse(localStorage.getItem(KEY) || "{}").USA).toBe(true);

    act(() => {
      result.current.toggleFavorite("USA");
    });

    expect(result.current.isFavorite("USA")).toBe(false);
  });

  it("tracks favorites count and list", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite("USA");
      result.current.toggleFavorite("CAN");
    });

    expect(result.current.favoritesCount).toBe(2);
    expect(result.current.favoritesList).toContain("USA");
    expect(result.current.favoritesList).toContain("CAN");
  });
});
