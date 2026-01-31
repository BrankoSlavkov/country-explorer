import { queryOptions } from "@tanstack/react-query";
import { countriesApi } from "~/api/client";

interface CountryName {
  common: string;
  official: string;
  nativeName?: Record<string, { official: string; common: string }>;
}

interface Demonym {
  f: string;
  m: string;
}

export interface Country {
  name: CountryName;
  tld?: string[];
  cca2: string;
  ccn3?: string;
  cca3: string;
  cioc?: string;
  independent?: boolean;
  status: string;
  unMember: boolean;
  currencies?: Record<string, { name: string; symbol: string }>;
  idd: {
    root?: string;
    suffixes?: string[];
  };
  capital?: string[];
  altSpellings: string[];
  region: string;
  subregion?: string;
  languages?: Record<string, string>;
  latlng: [number, number];
  landlocked: boolean;
  borders?: string[];
  area: number;
  demonyms?: {
    eng: Demonym;
    fra?: Demonym;
  };
  translations: Record<string, { official: string; common: string }>;
  flag: string;
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
  population: number;
  gini?: Record<string, number>;
  fifa?: string;
  car: {
    signs?: string[];
    side: string;
  };
  timezones: string[];
  continents: string[];
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  coatOfArms: {
    png?: string;
    svg?: string;
  };
  startOfWeek: string;
  capitalInfo: {
    latlng?: [number, number];
  };
  postalCode?: {
    format: string;
    regex?: string;
  };
}

export type CountryCard = Pick<
  Country,
  "name" | "flag" | "population" | "continents"
>;

export type CountryBorder = Pick<Country, "name" | "cca3" | "flags">;

export const countryQueries = {
  all: () => ["countries"] as const,

  list: () =>
    queryOptions({
      queryKey: [...countryQueries.all(), "list"] as const,
      queryFn: () => countriesApi.get("all").json<Country[]>(),
    }),

  cards: () =>
    queryOptions({
      queryKey: [...countryQueries.all(), "cards"] as const,
      queryFn: () =>
        countriesApi
          .get("all", {
            searchParams: { fields: "name,flag,population,continents" },
          })
          .json<CountryCard[]>(),
    }),

  detail: (name: string) =>
    queryOptions({
      queryKey: [...countryQueries.all(), "detail", name] as const,
      queryFn: () => countriesApi.get(`name/${name}`).json<Country[]>(),
      select: (data) => data[0],
      enabled: !!name,
    }),

  borders: (codes: string[]) =>
    queryOptions({
      queryKey: [...countryQueries.all(), "borders", codes] as const,
      queryFn: () =>
        countriesApi
          .get(`alpha`, {
            searchParams: {
              codes: codes.join(","),
              fields: "name,cca3,flags",
            },
          })
          .json<CountryBorder[]>(),
      enabled: codes.length > 0,
    }),
};
