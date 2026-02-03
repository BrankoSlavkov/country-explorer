import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import {
  DEFAULT_POPULATION_FILTER,
  DEFAULT_SORT,
  type PopulationFilter,
  type SortOption,
} from "~/constants/filters";
import { createMockCountries } from "~/test-utils";
import {
  FilteredCountriesProvider,
  useFilteredCountries,
} from "../filtered-countries-context";

describe("FilteredCountriesContext", () => {
  const mockCountries = createMockCountries();

  function createWrapper(props: {
    countries?: typeof mockCountries;
    search?: string;
    sortBy?: SortOption;
    populationFilter?: PopulationFilter;
    continent?: string;
    language?: string;
    favorites?: Record<string, boolean>;
    page?: number;
    perPage?: number;
  }) {
    return function Wrapper({ children }: { children: ReactNode }) {
      return (
        <FilteredCountriesProvider
          countries={props.countries ?? mockCountries}
          search={props.search}
          sortBy={props.sortBy ?? DEFAULT_SORT}
          populationFilter={props.populationFilter ?? DEFAULT_POPULATION_FILTER}
          continent={props.continent}
          language={props.language}
          favorites={props.favorites ?? {}}
          page={props.page ?? 1}
          perPage={props.perPage ?? 20}
        >
          {children}
        </FilteredCountriesProvider>
      );
    };
  }

  it("returns empty results when countries is undefined", () => {
    function UndefinedWrapper({ children }: { children: ReactNode }) {
      return (
        <FilteredCountriesProvider
          countries={undefined}
          search={undefined}
          sortBy={DEFAULT_SORT}
          populationFilter={DEFAULT_POPULATION_FILTER}
          continent={undefined}
          language={undefined}
          favorites={{}}
          page={1}
          perPage={20}
        >
          {children}
        </FilteredCountriesProvider>
      );
    }

    const { result } = renderHook(() => useFilteredCountries(), {
      wrapper: UndefinedWrapper,
    });

    expect(result.current.filteredCountries).toEqual([]);
    expect(result.current.totalPages).toBe(0);
  });

  it("filters countries by search term case-insensitively", () => {
    const { result } = renderHook(() => useFilteredCountries(), {
      wrapper: createWrapper({ search: "AUS" }),
    });

    expect(result.current.filteredCountries).toHaveLength(1);
    expect(result.current.filteredCountries[0].name.common).toBe("Australia");
  });

  it("filters by population range", () => {
    const { result } = renderHook(() => useFilteredCountries(), {
      wrapper: createWrapper({ populationFilter: "huge" }),
    });

    // Only Germany has > 50M population
    expect(result.current.filteredCountries).toHaveLength(1);
    expect(result.current.filteredCountries[0].name.common).toBe("Germany");
  });

  it("filters by continent", () => {
    const { result } = renderHook(() => useFilteredCountries(), {
      wrapper: createWrapper({ continent: "Oceania" }),
    });

    const names = result.current.filteredCountries.map((c) => c.name.common);
    expect(names).toContain("Australia");
    expect(names).toContain("Fiji");
    expect(result.current.filteredCountries).toHaveLength(2);
  });

  it("filters by language", () => {
    const { result } = renderHook(() => useFilteredCountries(), {
      wrapper: createWrapper({ language: "French" }),
    });

    const names = result.current.filteredCountries.map((c) => c.name.common);
    expect(names).toContain("Belgium");
    expect(names).toContain("Canada");
  });

  it("sorts by name ascending and descending", () => {
    const { result: asc } = renderHook(() => useFilteredCountries(), {
      wrapper: createWrapper({ sortBy: "name-asc" }),
    });
    const { result: desc } = renderHook(() => useFilteredCountries(), {
      wrapper: createWrapper({ sortBy: "name-desc" }),
    });

    expect(asc.current.filteredCountries[0].name.common).toBe("Australia");
    expect(desc.current.filteredCountries[0].name.common).toBe("Germany");
  });

  it("sorts by population", () => {
    const { result } = renderHook(() => useFilteredCountries(), {
      wrapper: createWrapper({ sortBy: "population-desc" }),
    });

    expect(result.current.filteredCountries[0].name.common).toBe("Germany");
    expect(result.current.filteredCountries[0].population).toBe(83000000);
  });

  it("prioritizes favorites in sort order", () => {
    const { result } = renderHook(() => useFilteredCountries(), {
      wrapper: createWrapper({
        sortBy: "name-asc",
        favorites: { FJI: true },
      }),
    });

    // Fiji should be first even though alphabetically it comes after Australia
    expect(result.current.filteredCountries[0].name.common).toBe("Fiji");
  });

  it("paginates results correctly", () => {
    const { result } = renderHook(() => useFilteredCountries(), {
      wrapper: createWrapper({ page: 1, perPage: 3 }),
    });

    expect(result.current.paginatedCountries).toHaveLength(3);
    expect(result.current.totalPages).toBe(3); // 7 countries / 3 per page
  });

  it("combines multiple filters", () => {
    const { result } = renderHook(() => useFilteredCountries(), {
      wrapper: createWrapper({
        continent: "Europe",
        populationFilter: "huge",
      }),
    });

    // Only Germany is in Europe with > 50M population
    expect(result.current.filteredCountries).toHaveLength(1);
    expect(result.current.filteredCountries[0].name.common).toBe("Germany");
  });

  it("throws error when used outside provider", () => {
    expect(() => {
      renderHook(() => useFilteredCountries());
    }).toThrow(
      "useFilteredCountries must be used within FilteredCountriesProvider",
    );
  });
});
