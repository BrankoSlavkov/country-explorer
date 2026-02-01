import { ChevronDown, Search } from "lucide-react";
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
    <div className="rounded-xl backdrop-blur-md bg-black/50 border border-white/20 p-6 mb-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <label
          htmlFor="search-country"
          className="block text-white/70 text-sm mb-2"
        >
          Search Country
        </label>
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
          />
          <input
            id="search-country"
            type="text"
            placeholder="Type to search..."
            defaultValue={search ?? ""}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label
            htmlFor="filter-continent"
            className="block text-white/70 text-sm mb-2"
          >
            Continent
          </label>
          <div className="relative">
            <select
              id="filter-continent"
              className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white appearance-none focus:outline-none focus:border-white/40 disabled:opacity-50"
              disabled={isLoading}
            >
              <option value="">All Continents</option>
              {continents.map((continent) => (
                <option key={continent} value={continent}>
                  {continent}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="filter-population"
            className="block text-white/70 text-sm mb-2"
          >
            Population
          </label>
          <div className="relative">
            <select
              id="filter-population"
              className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white appearance-none focus:outline-none focus:border-white/40"
            >
              <option value="">All Populations</option>
              <option value="small">&lt; 1M</option>
              <option value="medium">1M - 10M</option>
              <option value="large">10M - 50M</option>
              <option value="huge">&gt; 50M</option>
            </select>
            <ChevronDown
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="filter-language"
            className="block text-white/70 text-sm mb-2"
          >
            Language
          </label>
          <div className="relative">
            <select
              id="filter-language"
              className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white appearance-none focus:outline-none focus:border-white/40 disabled:opacity-50"
              disabled={isLoading}
            >
              <option value="">All Languages</option>
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
            />
          </div>
        </div>

        <CountrySort isLoading={isLoading} />
      </div>
    </div>
  );
}
