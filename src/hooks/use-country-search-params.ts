import { DEFAULT_POPULATION_FILTER, DEFAULT_SORT } from "~/constants/filters";
import { Route } from "~/routes/index";

export function useCountrySearchParams() {
  const searchParams = Route.useSearch();

  return {
    search: searchParams.search,
    page: searchParams.page ?? 1,
    perPage: searchParams.perPage ?? 20,
    sortBy: searchParams.sortBy ?? DEFAULT_SORT,
    populationFilter: searchParams.population ?? DEFAULT_POPULATION_FILTER,
    continent: searchParams.continent,
    language: searchParams.language,
  };
}
