import { CountryCard } from "~/components/country-card";
import { useFilteredCountries } from "~/contexts/filtered-countries-context";

export function CountryGrid() {
  const { paginatedCountries } = useFilteredCountries();

  return (
    <section aria-label="Countries list" className="my-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {paginatedCountries.map((country) => (
          <CountryCard key={country.name.common} country={country} />
        ))}
      </div>
    </section>
  );
}
