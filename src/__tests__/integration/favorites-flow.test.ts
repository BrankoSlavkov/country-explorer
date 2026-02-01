import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCountryFiltering } from "~/hooks/use-country-filtering";
import { useFavorites } from "~/hooks/use-favorites";
import { KEY, localStorageFavorites } from "~/lib/favorites";
import { createMockCountries } from "~/test-utils";

describe("Favorites Flow", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists favorites to localStorage and syncs across hooks", () => {
    const { result: hook1 } = renderHook(() => useFavorites());

    act(() => {
      hook1.current.toggleFavorite("USA");
    });

    // Verify persistence
    expect(JSON.parse(localStorage.getItem(KEY) || "{}").USA).toBe(true);

    // Verify another hook instance sees the change
    const { result: hook2 } = renderHook(() => useFavorites());
    expect(hook2.current.isFavorite("USA")).toBe(true);

    // Cleanup
    act(() => {
      hook1.current.toggleFavorite("USA");
    });
  });

  it("prioritizes favorites in country filtering results", () => {
    const mockCountries = createMockCountries();
    const { result: favoritesHook } = renderHook(() => useFavorites());

    // Favorite Germany (alphabetically after Australia)
    act(() => {
      favoritesHook.current.toggleFavorite("DEU");
    });

    const { result: filteringHook } = renderHook(() =>
      useCountryFiltering({
        countries: mockCountries,
        search: undefined,
        sortBy: "name-asc",
        populationFilter: "all",
        continent: undefined,
        language: undefined,
        isFavorite: favoritesHook.current.isFavorite,
        page: 1,
        perPage: 20,
      }),
    );

    expect(filteringHook.current.filteredCountries[0].name.common).toBe(
      "Germany",
    );

    // Cleanup
    act(() => {
      favoritesHook.current.toggleFavorite("DEU");
    });
  });

  it("syncs favorites across browser tabs via storage event", () => {
    const { result } = renderHook(() => useFavorites());

    expect(result.current.isFavorite("USA")).toBe(false);

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: KEY,
          newValue: JSON.stringify({ USA: true }),
        }),
      );
    });

    expect(result.current.isFavorite("USA")).toBe(true);
  });

  it("notifies subscribers when favorites change", () => {
    const listener = vi.fn();
    const unsubscribe = localStorageFavorites.subscribe(listener);

    localStorageFavorites.toggle("TEST");
    expect(listener).toHaveBeenCalled();

    localStorageFavorites.toggle("TEST"); // cleanup
    unsubscribe();
  });
});
