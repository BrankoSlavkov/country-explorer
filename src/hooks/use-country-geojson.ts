import { useSuspenseQuery } from "@tanstack/react-query";
import type { Country } from "~/api/countries.types";
import { geojsonQueries } from "~/api/geojson.queries";

export function useCountryGeoJSON(countryCode: Country["cca3"]) {
  return useSuspenseQuery(geojsonQueries.country(countryCode));
}
