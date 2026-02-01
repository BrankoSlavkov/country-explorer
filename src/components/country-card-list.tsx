import { Link, useNavigate } from "@tanstack/react-router";
import { GitCompare, Heart } from "lucide-react";
import { useState } from "react";
import { CountryCard } from "~/components/country-card";
import { CountryCardListSkeleton } from "~/components/country-card-list-skeleton";
import { CountryCompareModal } from "~/components/country-compare-modal";
import { CountryFilters } from "~/components/country-filters";
import { DEFAULT_POPULATION_FILTER } from "~/components/country-population-filter";
import { DEFAULT_SORT } from "~/components/country-sort";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { useCompare } from "~/contexts/compare-context";
import { useCountries } from "~/hooks/use-countries";
import { useCountryFiltering } from "~/hooks/use-country-filtering";
import { useFavorites } from "~/hooks/use-favorites";
import { Route } from "~/routes/index";

export function CountryCardList() {
  const searchParams = Route.useSearch();
  const search = searchParams.search;
  const page = searchParams.page ?? 1;
  const perPage = searchParams.perPage ?? 20;
  const sortBy = searchParams.sortBy ?? DEFAULT_SORT;
  const populationFilter = searchParams.population ?? DEFAULT_POPULATION_FILTER;
  const navigate = useNavigate({ from: "/" });
  const { countries, isLoading, continents, languages } = useCountries();
  const { compareMode, toggleCompareMode, selectedCountries, removeCountry } =
    useCompare();
  const { isFavorite, favoritesCount } = useFavorites();
  const [showCompareModal, setShowCompareModal] = useState(false);

  const { filteredCountries, totalPages, paginatedCountries } =
    useCountryFiltering({
      countries,
      search,
      sortBy,
      populationFilter,
      isFavorite,
      page,
      perPage,
    });

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

  if (isLoading) {
    return (
      <>
        <CountryFilters continents={[]} languages={[]} isLoading />
        <CountryCardListSkeleton />
      </>
    );
  }

  if (!countries) {
    return <div>No countries found</div>;
  }

  return (
    <>
      <div
        className="sticky top-0 z-10 pb-6"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, #1a1a2e 0%, #0d0d1a 100%)",
        }}
      >
        <div className="flex justify-center gap-4 mb-6 pt-6">
          <Link
            to="/favorites"
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all bg-white/10 text-white border border-white/20 hover:bg-white/20"
          >
            <Heart className="w-5 h-5" />
            Favorites ({favoritesCount})
          </Link>

          <button
            type="button"
            onClick={toggleCompareMode}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              compareMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            <GitCompare className="w-5 h-5" />
            {compareMode ? "Exit Compare Mode" : "Compare Mode"}
            {compareMode && selectedCountries.length > 0 && (
              <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-sm font-bold">
                {selectedCountries.length}
              </span>
            )}
          </button>

          {compareMode && selectedCountries.length >= 2 && (
            <button
              type="button"
              onClick={() => setShowCompareModal(true)}
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all"
            >
              Compare Selected ({selectedCountries.length})
            </button>
          )}
        </div>

        <CountryFilters continents={continents} languages={languages} />
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {paginatedCountries.map((country) => (
            <CountryCard key={country.name.common} country={country} />
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between max-w-7xl mx-auto mt-8 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-white/70 text-sm">Show:</span>
            <select
              value={perPage}
              onChange={(e) => handlePerPageChange(Number(e.target.value))}
              className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-white/70 text-sm">per page</span>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
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
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="text-white/70 text-sm">
            Showing {(page - 1) * perPage + 1} to{" "}
            {Math.min(page * perPage, filteredCountries.length)} of{" "}
            {filteredCountries.length} countries
          </div>
        </div>
      )}

      <CountryCompareModal
        open={showCompareModal}
        onOpenChange={setShowCompareModal}
        countries={selectedCountries}
        onRemoveCountry={removeCountry}
      />
    </>
  );
}
