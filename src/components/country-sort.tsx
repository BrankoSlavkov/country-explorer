import { useNavigate } from "@tanstack/react-router";
import { Route } from "~/routes/index";

export const SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "population-asc", label: "Population (Low to High)" },
  { value: "population-desc", label: "Population (High to Low)" },
  { value: "area-asc", label: "Area (Small to Large)" },
  { value: "area-desc", label: "Area (Large to Small)" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export const DEFAULT_SORT: SortOption = "name-asc";

interface CountrySortProps {
  isLoading?: boolean;
}

export function CountrySort({ isLoading }: CountrySortProps) {
  const { sortBy } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });

  const handleSortChange = (value: SortOption) => {
    navigate({
      search: (prev) => ({ ...prev, sortBy: value, page: 1 }),
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="sort-by" className="text-sm font-medium text-white/70">
        Sort By
      </label>
      <select
        id="sort-by"
        value={sortBy ?? DEFAULT_SORT}
        onChange={(e) => handleSortChange(e.target.value as SortOption)}
        disabled={isLoading}
        className="w-full px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
