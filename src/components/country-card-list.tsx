import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { countryQueries } from "~/api/countries.queries";
import { CountryCard } from "~/components/country-card";
import { CountryCardListSkeleton } from "~/components/country-card-list-skeleton";
import { CountryFilters } from "~/components/country-filters";
import { Route } from "~/routes/index";

export function CountryCardList() {
  const { search } = Route.useSearch();

  const { data: countries, isLoading } = useQuery(
    countryQueries.list([
      "name",
      "flag",
      "population",
      "continents",
      "languages",
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

  const filteredCountries = useMemo(() => {
    if (!countries) return [];

    return countries.filter((country) => {
      if (search) {
        const searchLower = search.toLowerCase();
        return country.name.common.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }, [countries, search]);

  if (isLoading) {
    return (
      <>
        <CountryFilters continents={[]} languages={[]} isLoading />
        <CountryCardListSkeleton />
      </>
    );
  }

  if (!countries) {
    return <div>No countries found</div>;
  }

  return (
    <>
      <CountryFilters continents={continents} languages={languages} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {filteredCountries.map((country) => (
          <CountryCard key={country.name.common} country={country} />
        ))}
      </div>
    </>
  );
}
