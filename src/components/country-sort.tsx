import { useNavigate } from "@tanstack/react-router";
import {
  DEFAULT_SORT,
  SORT_OPTIONS,
  type SortOption,
} from "~/constants/filters";
import { Route } from "~/routes/index";

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
        className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white appearance-none focus:outline-none focus:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
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
