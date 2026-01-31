import { useQuery } from "@tanstack/react-query";
import { countryQueries } from "~/api/countries.queries";
import { CountryCard } from "~/components/country-card";
import { LoadingState } from "~/components/loading-state";

export function CountryCardList() {
  const { data: countries, isLoading } = useQuery(countryQueries.cards());

  if (isLoading || !countries) {
    return <LoadingState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
      {countries.map((country) => (
        <CountryCard key={country.name.common} country={country} />
      ))}
    </div>
  );
}
