import { useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { Route } from "~/routes/index";

const POPULATION_SMALL_MAX = 1_000_000;
const POPULATION_MEDIUM_MAX = 10_000_000;
const POPULATION_LARGE_MAX = 50_000_000;

export const POPULATION_FILTERS = [
  { value: "all", label: "All Populations" },
  { value: "small", label: "< 1M", min: 0, max: POPULATION_SMALL_MAX },
  {
    value: "medium",
    label: "1M - 10M",
    min: POPULATION_SMALL_MAX,
    max: POPULATION_MEDIUM_MAX,
  },
  {
    value: "large",
    label: "10M - 50M",
    min: POPULATION_MEDIUM_MAX,
    max: POPULATION_LARGE_MAX,
  },
  { value: "huge", label: "> 50M", min: POPULATION_LARGE_MAX, max: Infinity },
] as const;

export type PopulationFilter = (typeof POPULATION_FILTERS)[number]["value"];

export const DEFAULT_POPULATION_FILTER: PopulationFilter = "all";

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
