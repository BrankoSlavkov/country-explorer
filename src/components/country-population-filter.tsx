import { useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import {
  DEFAULT_POPULATION_FILTER,
  POPULATION_FILTERS,
  type PopulationFilter,
} from "~/constants/filters";
import { Route } from "~/routes/index";

interface CountryPopulationFilterProps {
  isLoading?: boolean;
}

export function CountryPopulationFilter({
  isLoading,
}: CountryPopulationFilterProps) {
  const { population } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });

  const handlePopulationChange = (value: PopulationFilter) => {
    navigate({
      search: (prev) => ({ ...prev, population: value, page: 1 }),
    });
  };

  return (
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
          value={population ?? DEFAULT_POPULATION_FILTER}
          onChange={(e) =>
            handlePopulationChange(e.target.value as PopulationFilter)
          }
          disabled={isLoading}
          className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white appearance-none focus:outline-none focus:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {POPULATION_FILTERS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
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
