import { useQuery } from "@tanstack/react-query";
import { geojsonQueries } from "~/api/geojson.queries";

export function useCountryGeoJSON(countryCode: string) {
  return useQuery(geojsonQueries.country(countryCode));
}
