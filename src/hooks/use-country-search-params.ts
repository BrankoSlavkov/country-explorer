import { DEFAULT_POPULATION_FILTER, DEFAULT_SORT } from "~/constants/filters";
import { PAGINATION } from "~/constants/ui";
import { Route } from "~/routes/index";

export function useCountrySearchParams() {
  const searchParams = Route.useSearch();

  return {
    search: searchParams.search,
    page: searchParams.page ?? PAGINATION.DEFAULT_PAGE,
    perPage: searchParams.perPage ?? PAGINATION.DEFAULT_PER_PAGE,
    sortBy: searchParams.sortBy ?? DEFAULT_SORT,
    populationFilter: searchParams.population ?? DEFAULT_POPULATION_FILTER,
    continent: searchParams.continent,
    language: searchParams.language,
  };
}
