import { useSuspenseQuery } from "@tanstack/react-query";
import { countryQueries } from "~/api/countries.queries";
import type { Country } from "~/api/countries.types";

export function useCountryDetails(name: Country["name"]["common"]) {
  return useSuspenseQuery(countryQueries.detail(name));
}
