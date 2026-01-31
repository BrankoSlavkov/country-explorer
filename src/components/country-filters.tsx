import { ChevronDown, Search } from "lucide-react";

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
  return (
    <div className="rounded-xl backdrop-blur-md bg-black/50 border border-white/20 p-6 mb-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <label className="block text-white/70 text-sm mb-2">
          Search Country
        </label>
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
          />
          <input
            type="text"
            placeholder="Type to search..."
            className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-2">Continent</label>
          <div className="relative">
            <select
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
          <label className="block text-white/70 text-sm mb-2">Population</label>
          <div className="relative">
            <select className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white appearance-none focus:outline-none focus:border-white/40">
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
          <label className="block text-white/70 text-sm mb-2">Language</label>
          <div className="relative">
            <select
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

        <div>
          <label className="block text-white/70 text-sm mb-2">Sort By</label>
          <div className="relative">
            <select className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white appearance-none focus:outline-none focus:border-white/40">
              <option value="name-asc">Name (A-Z)</option>
              <option value="population-desc">Population (High to Low)</option>
              <option value="population-asc">Population (Low to High)</option>
              <option value="area-desc">Area (Largest First)</option>
              <option value="area-asc">Area (Smallest First)</option>
            </select>
            <ChevronDown
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
