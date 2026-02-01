import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { countryQueries } from "~/api/countries.queries";

export function useCountries() {
  const { data: countries, isLoading } = useQuery(
    countryQueries.list([
      "name",
      "flag",
      "population",
      "continents",
      "languages",
      "capital",
      "region",
      "area",
      "currencies",
      "cca3",
    ]),
  );

  const { continents, languages } = useMemo(() => {
    if (!countries) return { continents: [], languages: [] };

    const continentSet = new Set<string>();
    const languageSet = new Set<string>();

    for (const country of countries) {
      for (const c of country.continents ?? []) {
        continentSet.add(c);
      }

      if (country.languages) {
        for (const l of Object.values(country.languages)) {
          languageSet.add(l);
        }
      }
    }

    return {
      continents: Array.from(continentSet).sort(),
      languages: Array.from(languageSet).sort(),
    };
  }, [countries]);

  return {
    countries,
    isLoading,
    continents,
    languages,
  };
}
