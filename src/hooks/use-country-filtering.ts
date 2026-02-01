import { useMemo } from "react";
import type { CountryCard } from "~/api/countries.queries";
import type { PopulationFilter } from "~/components/country-population-filter";
import { POPULATION_FILTERS } from "~/components/country-population-filter";
import type { SortOption } from "~/components/country-sort";

interface UseCountryFilteringParams {
  countries: CountryCard[] | undefined;
  search?: string;
  sortBy: SortOption;
  populationFilter: PopulationFilter;
  isFavorite: (cca3: string) => boolean;
  page: number;
  perPage: number;
}

export function useCountryFiltering({
  countries,
  search,
  sortBy,
  populationFilter,
  isFavorite,
  page,
  perPage,
}: UseCountryFilteringParams) {
  return useMemo(() => {
    if (!countries)
      return { filteredCountries: [], totalPages: 0, paginatedCountries: [] };

    // Apply filters
    const filtered = countries.filter((country) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        if (!country.name.common.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Population filter
      if (populationFilter !== "all") {
        const popFilter = POPULATION_FILTERS.find(
          (f) => f.value === populationFilter,
        );
        if (popFilter && "min" in popFilter && "max" in popFilter) {
          if (
            country.population < popFilter.min ||
            country.population >= popFilter.max
          ) {
            return false;
          }
        }
      }

      return true;
    });

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      // Favorites always come first regardless of sort
      const aFav = isFavorite(a.cca3);
      const bFav = isFavorite(b.cca3);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;

      // Then apply selected sort
      switch (sortBy) {
        case "name-asc":
          return a.name.common.localeCompare(b.name.common);
        case "name-desc":
          return b.name.common.localeCompare(a.name.common);
        case "population-asc":
          return a.population - b.population;
        case "population-desc":
          return b.population - a.population;
        case "area-asc":
          return a.area - b.area;
        case "area-desc":
          return b.area - a.area;
        default:
          return 0;
      }
    });

    // Apply pagination
    const totalPages = Math.ceil(sorted.length / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginated = sorted.slice(startIndex, endIndex);

    return {
      filteredCountries: sorted,
      totalPages,
      paginatedCountries: paginated,
    };
  }, [countries, search, isFavorite, page, perPage, sortBy, populationFilter]);
}
