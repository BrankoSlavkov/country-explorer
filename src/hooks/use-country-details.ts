import { useQuery } from "@tanstack/react-query";
import { countryQueries } from "../api/countries.queries";

export function useCountryDetails(name: string) {
  return useQuery(countryQueries.detail(name));
}
