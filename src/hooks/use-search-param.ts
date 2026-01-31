import { useNavigate } from "@tanstack/react-router";
import { useDebounce } from "~/hooks/use-debounce";
import { Route } from "~/routes/index";

interface UseSearchParamOptions {
  timeout?: number;
}

interface UseSearchParamReturn {
  search: string | undefined;
  setSearch: (value: string) => void;
}

export function useSearchParam(
  { timeout = 500 } = {} as UseSearchParamOptions,
): UseSearchParamReturn {
  const { search } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });

  const setSearch = useDebounce((value: string) => {
    const trimmed = value.trim() || undefined;
    if (trimmed === search) return;
    navigate({
      search: (prev) => ({
        ...prev,
        search: trimmed,
      }),
      replace: true,
    });
  }, timeout);

  return { search, setSearch };
}
