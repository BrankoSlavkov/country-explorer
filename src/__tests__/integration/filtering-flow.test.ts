import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useCountryFiltering } from "~/hooks/use-country-filtering";
import { createMockCountries } from "~/test-utils";

describe("Filtering Flow", () => {
  const mockCountries = createMockCountries();
  const defaultParams = {
    countries: mockCountries,
    search: undefined,
    sortBy: "name-asc" as const,
    populationFilter: "all" as const,
    continent: undefined,
    language: undefined,
    isFavorite: () => false,
    page: 1,
    perPage: 20,
  };

  it("applies multiple filters together correctly", () => {
    const { result } = renderHook(() =>
      useCountryFiltering({
        ...defaultParams,
        continent: "Europe",
        language: "French",
      }),
    );

    // Belgium is the only European country that speaks French
    expect(result.current.filteredCountries).toHaveLength(1);
    expect(result.current.filteredCountries[0].name.common).toBe("Belgium");
  });

  it("sorts filtered results and paginates correctly", () => {
    const { result } = renderHook(() =>
      useCountryFiltering({
        ...defaultParams,
        continent: "Europe",
        sortBy: "population-desc",
        page: 1,
        perPage: 2,
      }),
    );

    // Europe sorted by population: Germany (83M), Belgium (11.5M), Denmark (5.8M), Estonia (1.3M)
    expect(result.current.paginatedCountries[0].name.common).toBe("Germany");
    expect(result.current.paginatedCountries[1].name.common).toBe("Belgium");
    expect(result.current.totalPages).toBe(2);
  });

  it("prioritizes favorites while maintaining sort order", () => {
    const isFavorite = vi.fn((cca3: string) => ["DNK", "EST"].includes(cca3));

    const { result } = renderHook(() =>
      useCountryFiltering({
        ...defaultParams,
        sortBy: "name-asc",
        isFavorite,
      }),
    );

    // Denmark and Estonia are favorites, should come first, sorted alphabetically
    expect(result.current.filteredCountries[0].name.common).toBe("Denmark");
    expect(result.current.filteredCountries[1].name.common).toBe("Estonia");
    // Non-favorites follow
    expect(result.current.filteredCountries[2].name.common).toBe("Australia");
  });
});
