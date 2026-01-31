import { queryOptions } from "@tanstack/react-query";
import { countriesApi } from "~/api/client";
import type { Country, CountryBorder } from "~/api/countries.types";

export type {
  Country,
  CountryBorder,
  CountryCard,
} from "~/api/countries.types";

type CountryField = keyof Country;

type MaxTenFields =
  | [CountryField]
  | [CountryField, CountryField]
  | [CountryField, CountryField, CountryField]
  | [CountryField, CountryField, CountryField, CountryField]
  | [CountryField, CountryField, CountryField, CountryField, CountryField]
  | [
      CountryField,
      CountryField,
      CountryField,
      CountryField,
      CountryField,
      CountryField,
    ]
  | [
      CountryField,
      CountryField,
      CountryField,
      CountryField,
      CountryField,
      CountryField,
      CountryField,
    ]
  | [
      CountryField,
      CountryField,
      CountryField,
      CountryField,
      CountryField,
      CountryField,
      CountryField,
      CountryField,
    ]
  | [
      CountryField,
      CountryField,
      CountryField,
      CountryField,
      CountryField,
      CountryField,
      CountryField,
      CountryField,
      CountryField,
    ]
  | [
      CountryField,
      CountryField,
      CountryField,
      CountryField,
      CountryField,
      CountryField,
      CountryField,
      CountryField,
      CountryField,
      CountryField,
    ];

export const countryQueries = {
  all: () => [{ entity: "countries" }] as const,

  list: <T extends MaxTenFields>(fields: T) =>
    queryOptions({
      queryKey: [
        { ...countryQueries.all()[0], scope: "list", fields },
      ] as const,
      queryFn: () =>
        countriesApi
          .get("all", {
            searchParams: { fields: fields.join(",") },
          })
          .json<Pick<Country, T[number]>[]>(),
    }),

  detail: (name: Country["name"]["common"]) =>
    queryOptions({
      queryKey: [
        { ...countryQueries.all()[0], scope: "detail", name },
      ] as const,
      queryFn: () => countriesApi.get(`name/${name}`).json<Country[]>(),
      select: (data) => data[0],
      enabled: !!name,
    }),

  borders: (codes: NonNullable<Country["borders"]>) =>
    queryOptions({
      queryKey: [
        { ...countryQueries.all()[0], scope: "borders", codes },
      ] as const,
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
