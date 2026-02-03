import { useNavigate } from "@tanstack/react-router";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { useFilteredCountries } from "~/contexts/filtered-countries-context";
import { useCountrySearchParams } from "~/hooks/use-country-search-params";

export function CountryPagination() {
  const navigate = useNavigate({ from: "/" });
  const { page, perPage } = useCountrySearchParams();
  const { totalPages, totalCount } = useFilteredCountries();

  const handlePageChange = (newPage: number) => {
    navigate({ search: (prev) => ({ ...prev, page: newPage }) });
  };

  const handlePerPageChange = (newPerPage: number) => {
    navigate({ search: (prev) => ({ ...prev, perPage: newPerPage, page: 1 }) });
  };

  const generatePageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  const startItem = (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, totalCount);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between max-w-7xl mx-auto mt-8 mb-8"
    >
      <div className="flex items-center gap-2">
        <label htmlFor="items-per-page" className="text-white/80 text-sm">
          Show:
        </label>
        <select
          id="items-per-page"
          value={perPage}
          onChange={(e) => handlePerPageChange(Number(e.target.value))}
          aria-label="Number of countries per page"
          className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-white/80 text-sm">per page</span>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              aria-label="Go to previous page"
            />
          </PaginationItem>

          {generatePageNumbers().map((pageNum, i) => (
            <PaginationItem key={i}>
              {pageNum === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => handlePageChange(pageNum)}
                  isActive={page === pageNum}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={page === pageNum ? "page" : undefined}
                >
                  {pageNum}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              aria-label="Go to next page"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <p className="text-white/80 text-sm" aria-live="polite">
        Showing {startItem} to {endItem} of {totalCount} countries
      </p>
    </nav>
  );
}
