import { queryOptions } from "@tanstack/react-query";
import type {
  Feature,
  FeatureCollection,
  MultiPolygon,
  Polygon,
} from "geojson";
import { geojsonApi } from "~/api/client";

export type CountryFeature = Feature<Polygon | MultiPolygon, { name: string }>;

type CountriesGeoJSON = FeatureCollection<
  Polygon | MultiPolygon,
  { name: string }
>;

export const geojsonQueries = {
  country: (countryCode: string) =>
    queryOptions({
      queryKey: [{ entity: "geojson", scope: "country", countryCode }] as const,
      queryFn: async (): Promise<CountryFeature | null> => {
        const data = await geojsonApi
          .get("countries.geo.json")
          .json<CountriesGeoJSON>();

        const feature = data.features.find(
          (f) => f.id === countryCode.toUpperCase(),
        );
        return (feature as CountryFeature) || null;
      },
      enabled: !!countryCode,
      staleTime: Number.POSITIVE_INFINITY,
    }),
};
