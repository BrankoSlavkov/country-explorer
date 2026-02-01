import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createMockCountries } from "~/test-utils";
import { useCountryFiltering } from "../use-country-filtering";

describe("useCountryFiltering", () => {
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

  it("returns empty results when countries is undefined", () => {
    const { result } = renderHook(() =>
      useCountryFiltering({ ...defaultParams, countries: undefined }),
    );

    expect(result.current.filteredCountries).toEqual([]);
    expect(result.current.totalPages).toBe(0);
  });

  it("filters countries by search term case-insensitively", () => {
    const { result } = renderHook(() =>
      useCountryFiltering({ ...defaultParams, search: "AUS" }),
    );

    expect(result.current.filteredCountries).toHaveLength(1);
    expect(result.current.filteredCountries[0].name.common).toBe("Australia");
  });

  it("filters by population range", () => {
    const { result } = renderHook(() =>
      useCountryFiltering({ ...defaultParams, populationFilter: "huge" }),
    );

    // Only Germany has > 50M population
    expect(result.current.filteredCountries).toHaveLength(1);
    expect(result.current.filteredCountries[0].name.common).toBe("Germany");
  });

  it("filters by continent", () => {
    const { result } = renderHook(() =>
      useCountryFiltering({ ...defaultParams, continent: "Oceania" }),
    );

    const names = result.current.filteredCountries.map((c) => c.name.common);
    expect(names).toContain("Australia");
    expect(names).toContain("Fiji");
    expect(result.current.filteredCountries).toHaveLength(2);
  });

  it("filters by language", () => {
    const { result } = renderHook(() =>
      useCountryFiltering({ ...defaultParams, language: "French" }),
    );

    const names = result.current.filteredCountries.map((c) => c.name.common);
    expect(names).toContain("Belgium");
    expect(names).toContain("Canada");
  });

  it("sorts by name ascending and descending", () => {
    const { result: asc } = renderHook(() =>
      useCountryFiltering({ ...defaultParams, sortBy: "name-asc" }),
    );
    const { result: desc } = renderHook(() =>
      useCountryFiltering({ ...defaultParams, sortBy: "name-desc" }),
    );

    expect(asc.current.filteredCountries[0].name.common).toBe("Australia");
    expect(desc.current.filteredCountries[0].name.common).toBe("Germany");
  });

  it("sorts by population", () => {
    const { result } = renderHook(() =>
      useCountryFiltering({ ...defaultParams, sortBy: "population-desc" }),
    );

    expect(result.current.filteredCountries[0].name.common).toBe("Germany");
    expect(result.current.filteredCountries[0].population).toBe(83000000);
  });

  it("prioritizes favorites in sort order", () => {
    const isFavorite = vi.fn((cca3: string) => cca3 === "FJI");

    const { result } = renderHook(() =>
      useCountryFiltering({ ...defaultParams, sortBy: "name-asc", isFavorite }),
    );

    // Fiji should be first even though alphabetically it comes after Australia
    expect(result.current.filteredCountries[0].name.common).toBe("Fiji");
  });

  it("paginates results correctly", () => {
    const { result } = renderHook(() =>
      useCountryFiltering({ ...defaultParams, page: 1, perPage: 3 }),
    );

    expect(result.current.paginatedCountries).toHaveLength(3);
    expect(result.current.totalPages).toBe(3); // 7 countries / 3 per page
  });

  it("combines multiple filters", () => {
    const { result } = renderHook(() =>
      useCountryFiltering({
        ...defaultParams,
        continent: "Europe",
        populationFilter: "huge",
      }),
    );

    // Only Germany is in Europe with > 50M population
    expect(result.current.filteredCountries).toHaveLength(1);
    expect(result.current.filteredCountries[0].name.common).toBe("Germany");
  });
});
