import { useSuspenseQuery } from "@tanstack/react-query";
import { countryQueries } from "~/api/countries.queries";

export function useCountryDetails(name: string) {
  return useSuspenseQuery(countryQueries.detail(name));
}
