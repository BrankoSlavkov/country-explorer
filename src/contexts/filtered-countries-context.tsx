import { createContext, use, useMemo } from "react";
import type { CountryCard } from "~/api/countries.queries";
import {
  POPULATION_FILTERS,
  type PopulationFilter,
  SORT,
  type SortOption,
} from "~/constants/filters";

interface FilteredCountriesContextValue {
  filteredCountries: CountryCard[];
  paginatedCountries: CountryCard[];
  totalPages: number;
  totalCount: number;
}

const FilteredCountriesContext =
  createContext<FilteredCountriesContextValue | null>(null);

interface FilteredCountriesProviderProps {
  children: React.ReactNode;
  countries: CountryCard[] | undefined;
  search?: string;
  sortBy: SortOption;
  populationFilter: PopulationFilter;
  continent?: string;
  language?: string;
  favorites: Record<string, boolean>;
  page: number;
  perPage: number;
}

const POPULATION_FILTER_MAP = new Map<
  PopulationFilter,
  { min: number; max: number }
>(
  POPULATION_FILTERS.filter(
    (
      f,
    ): f is (typeof POPULATION_FILTERS)[number] & {
      min: number;
      max: number;
    } => "min" in f && "max" in f,
  ).map((f) => [f.value, { min: f.min, max: f.max }]),
);

export function FilteredCountriesProvider({
  children,
  countries,
  search,
  sortBy,
  populationFilter,
  continent,
  language,
  favorites,
  page,
  perPage,
}: FilteredCountriesProviderProps) {
  const favoritesSet = useMemo(
    () => new Set(Object.keys(favorites).filter((k) => favorites[k])),
    [favorites],
  );

  const value = useMemo(() => {
    if (!countries) {
      return {
        filteredCountries: [],
        paginatedCountries: [],
        totalPages: 0,
        totalCount: 0,
      };
    }

    const searchLower = search?.toLowerCase();

    const popRange = POPULATION_FILTER_MAP.get(populationFilter);

    const filtered = countries.filter((country) => {
      if (searchLower) {
        if (!country.name.common.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      if (popRange) {
        if (
          country.population < popRange.min ||
          country.population >= popRange.max
        ) {
          return false;
        }
      }

      if (continent) {
        if (!country.continents.includes(continent)) {
          return false;
        }
      }

      if (language) {
        if (!country.languages) {
          return false;
        }

        let hasLanguage = false;
        for (const lang of Object.values(country.languages)) {
          if (lang === language) {
            hasLanguage = true;
            break;
          }
        }
        if (!hasLanguage) {
          return false;
        }
      }

      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      const aFav = favoritesSet.has(a.cca3);
      const bFav = favoritesSet.has(b.cca3);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;

      switch (sortBy) {
        case SORT.NAME_ASC:
          return a.name.common.localeCompare(b.name.common);
        case SORT.NAME_DESC:
          return b.name.common.localeCompare(a.name.common);
        case SORT.POPULATION_ASC:
          return a.population - b.population;
        case SORT.POPULATION_DESC:
          return b.population - a.population;
        case SORT.AREA_ASC:
          return a.area - b.area;
        case SORT.AREA_DESC:
          return b.area - a.area;
        default:
          return 0;
      }
    });

    const totalPages = Math.ceil(sorted.length / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginated = sorted.slice(startIndex, endIndex);

    return {
      filteredCountries: sorted,
      paginatedCountries: paginated,
      totalPages,
      totalCount: sorted.length,
    };
  }, [
    countries,
    search,
    sortBy,
    populationFilter,
    continent,
    language,
    favoritesSet,
    page,
    perPage,
  ]);

  return (
    <FilteredCountriesContext value={value}>
      {children}
    </FilteredCountriesContext>
  );
}

export function useFilteredCountries() {
  const context = use(FilteredCountriesContext);
  if (!context) {
    throw new Error(
      "useFilteredCountries must be used within FilteredCountriesProvider",
    );
  }
  return context;
}
