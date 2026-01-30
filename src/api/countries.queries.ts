import { queryOptions } from "@tanstack/react-query";
import { countriesApi } from "./client";

interface CountryName {
  common: string;
  official: string;
  nativeName?: Record<string, { official: string; common: string }>;
}

export interface Country {
  name: CountryName;
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  area: number;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  currencies?: Record<string, { name: string; symbol: string }>;
  languages?: Record<string, string>;
}

export const countryQueries = {
  all: () =>
    queryOptions({
      queryKey: [{ entity: "countries" }] as const,
    }),

  list: () =>
    queryOptions({
      queryKey: [
        { ...countryQueries.all().queryKey[0], scope: "list" },
      ] as const,
      queryFn: () => countriesApi.get("all").json<Country[]>(),
    }),

  detail: (name: string) =>
    queryOptions({
      queryKey: [
        { ...countryQueries.all().queryKey[0], scope: "detail", name },
      ] as const,
      queryFn: () => countriesApi.get(`name/${name}`).json<Country[]>(),
      enabled: !!name,
    }),
};
