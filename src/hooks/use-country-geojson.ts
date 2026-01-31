import { useSuspenseQuery } from "@tanstack/react-query";
import { geojsonQueries } from "~/api/geojson.queries";

export function useCountryGeoJSON(countryCode: string) {
  return useSuspenseQuery(geojsonQueries.country(countryCode));
}
