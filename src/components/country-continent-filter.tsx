import { useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { Route } from "~/routes/index";

interface CountryContinentFilterProps {
  continents: string[];
  isLoading?: boolean;
}

export function CountryContinentFilter({
  continents,
  isLoading,
}: CountryContinentFilterProps) {
  const { continent } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });

  const handleContinentChange = (value: string) => {
    navigate({
      search: (prev) => ({ ...prev, continent: value || undefined, page: 1 }),
    });
  };

  return (
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
          value={continent ?? ""}
          onChange={(e) => handleContinentChange(e.target.value)}
          disabled={isLoading}
          className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white appearance-none focus:outline-none focus:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">All Continents</option>
          {continents.map((cont) => (
            <option key={cont} value={cont}>
              {cont}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
        />
      </div>
    </div>
  );
}
