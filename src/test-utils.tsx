import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type RenderOptions, render } from "@testing-library/react";
import type { PropsWithChildren, ReactElement } from "react";
import type { CountryCard } from "~/api/countries.types";
import { CompareProvider } from "~/contexts/compare-context";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

export function createWrapper() {
  const queryClient = createTestQueryClient();

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>
        <CompareProvider>{children}</CompareProvider>
      </QueryClientProvider>
    );
  }

  return { Wrapper, queryClient };
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  const { Wrapper, queryClient } = createWrapper();

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    queryClient,
  };
}

export function createMockCountry(
  overrides: Partial<CountryCard> = {},
): CountryCard {
  return {
    name: { common: "Test Country", official: "Official Test Country" },
    flag: "\u{1F3F3}\u{FE0F}",
    population: 1000000,
    continents: ["Europe"],
    languages: { eng: "English" },
    capital: ["Test Capital"],
    region: "Europe",
    area: 100000,
    currencies: { USD: { name: "US Dollar", symbol: "$" } },
    cca3: "TST",
    ...overrides,
  };
}

export function createMockCountries(): CountryCard[] {
  return [
    createMockCountry({
      name: { common: "Australia", official: "Commonwealth of Australia" },
      population: 25000000,
      area: 7692024,
      cca3: "AUS",
      continents: ["Oceania"],
      languages: { eng: "English" },
    }),
    createMockCountry({
      name: { common: "Belgium", official: "Kingdom of Belgium" },
      population: 11500000,
      area: 30528,
      cca3: "BEL",
      continents: ["Europe"],
      languages: { nld: "Dutch", fra: "French", deu: "German" },
    }),
    createMockCountry({
      name: { common: "Canada", official: "Canada" },
      population: 38000000,
      area: 9984670,
      cca3: "CAN",
      continents: ["North America"],
      languages: { eng: "English", fra: "French" },
    }),
    createMockCountry({
      name: { common: "Denmark", official: "Kingdom of Denmark" },
      population: 5800000,
      area: 43094,
      cca3: "DNK",
      continents: ["Europe"],
      languages: { dan: "Danish" },
    }),
    createMockCountry({
      name: { common: "Estonia", official: "Republic of Estonia" },
      population: 1300000,
      area: 45228,
      cca3: "EST",
      continents: ["Europe"],
      languages: { est: "Estonian" },
    }),
    createMockCountry({
      name: { common: "Fiji", official: "Republic of Fiji" },
      population: 900000,
      area: 18272,
      cca3: "FJI",
      continents: ["Oceania"],
      languages: { eng: "English", fij: "Fijian", hin: "Hindi" },
    }),
    createMockCountry({
      name: { common: "Germany", official: "Federal Republic of Germany" },
      population: 83000000,
      area: 357114,
      cca3: "DEU",
      continents: ["Europe"],
      languages: { deu: "German" },
    }),
  ];
}
