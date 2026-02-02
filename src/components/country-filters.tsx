import { Search } from "lucide-react";
import { CountryContinentFilter } from "~/components/country-continent-filter";
import { CountryLanguageFilter } from "~/components/country-language-filter";
import { CountryPopulationFilter } from "~/components/country-population-filter";
import { CountrySort } from "~/components/country-sort";
import { useSearchParam } from "~/hooks/use-search-param";

interface CountryFiltersProps {
  continents: string[];
  languages: string[];
  isLoading?: boolean;
}

export function CountryFilters({
  continents,
  languages,
  isLoading,
}: CountryFiltersProps) {
  const { search, setSearch } = useSearchParam();

  return (
    <search className="rounded-xl backdrop-blur-md bg-black/50 border border-white/20 p-6 px-8 mb-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <label
          htmlFor="search-country"
          className="block text-white/80 text-sm mb-2"
        >
          Search Country
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60"
          />
          <input
            id="search-country"
            type="search"
            placeholder="Type to search..."
            defaultValue={search ?? ""}
            onChange={(e) => setSearch(e.target.value)}
            aria-describedby="search-hint"
            className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-blue-500"
          />
          <span id="search-hint" className="sr-only">
            Search countries by name
          </span>
        </div>
      </div>

      <fieldset>
        <legend className="sr-only">Filter and sort options</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CountryContinentFilter
            continents={continents}
            isLoading={isLoading}
          />

          <CountryPopulationFilter isLoading={isLoading} />

          <CountryLanguageFilter languages={languages} isLoading={isLoading} />

          <CountrySort isLoading={isLoading} />
        </div>
      </fieldset>
    </search>
  );
}
