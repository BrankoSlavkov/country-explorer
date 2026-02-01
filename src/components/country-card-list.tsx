import { useMemo } from "react";
import { CountryCard } from "~/components/country-card";
import { CountryCardListSkeleton } from "~/components/country-card-list-skeleton";
import { CountryFilters } from "~/components/country-filters";
import { useCountries } from "~/hooks/use-countries";
import { Route } from "~/routes/index";

export function CountryCardList() {
  const { search } = Route.useSearch();
  const { countries, isLoading, continents, languages } = useCountries();

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
