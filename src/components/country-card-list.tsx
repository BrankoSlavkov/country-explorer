import { Link } from "@tanstack/react-router";
import { GitCompare, Heart } from "lucide-react";
import { useState } from "react";
import { CountryCardListSkeleton } from "~/components/country-card-list-skeleton";
import { CountryCompareModal } from "~/components/country-compare-modal";
import { CountryFilters } from "~/components/country-filters";
import { CountryGrid } from "~/components/country-grid";
import { CountryPagination } from "~/components/country-pagination";

import { useCompare } from "~/contexts/compare-context";
import { FilteredCountriesProvider } from "~/contexts/filtered-countries-context";
import { useCountries } from "~/hooks/use-countries";
import { useCountrySearchParams } from "~/hooks/use-country-search-params";
import { useFavorites } from "~/hooks/use-favorites";
import { cn } from "~/lib/cn";

export function CountryCardList() {
  const {
    search,
    page,
    perPage,
    sortBy,
    populationFilter,
    continent,
    language,
  } = useCountrySearchParams();
  const { countries, isLoading, continents, languages } = useCountries();
  const { compareMode, toggleCompareMode, selectedCountries, removeCountry } =
    useCompare();
  const { favorites, favoritesCount } = useFavorites();
  const [showCompareModal, setShowCompareModal] = useState(false);

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
    <FilteredCountriesProvider
      countries={countries}
      search={search}
      sortBy={sortBy}
      populationFilter={populationFilter}
      continent={continent}
      language={language}
      favorites={favorites}
      page={page}
      perPage={perPage}
    >
      <div className="sticky top-0 z-10 pb-6 bg-app">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 pt-6 px-4">
          <Link
            to="/favorites"
            className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-all bg-white/10 text-white border border-white/20 hover:bg-white/20 text-sm sm:text-base"
            aria-label={`View favorites, ${favoritesCount} saved`}
          >
            <Heart aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Favorites</span>
            <span className="xs:hidden">{favoritesCount}</span>
            <span className="hidden xs:inline">({favoritesCount})</span>
          </Link>

          <button
            type="button"
            onClick={toggleCompareMode}
            aria-pressed={compareMode}
            aria-label={
              compareMode
                ? "Exit compare mode"
                : "Enter compare mode to select countries for comparison"
            }
            className={cn(
              "flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-all text-white text-sm sm:text-base",
              compareMode
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600",
            )}
          >
            <GitCompare aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">
              {compareMode ? "Exit Compare" : "Compare"}
            </span>
            {compareMode && selectedCountries.length > 0 && (
              <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-sm font-bold">
                <span className="sr-only">
                  {selectedCountries.length} countries selected
                </span>
                <span aria-hidden="true">{selectedCountries.length}</span>
              </span>
            )}
          </button>

          {compareMode && selectedCountries.length >= 2 && (
            <button
              type="button"
              onClick={() => setShowCompareModal(true)}
              aria-label={`Compare ${selectedCountries.length} selected countries`}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Compare Selected</span>
              <span className="sm:hidden">Compare</span>
              <span> ({selectedCountries.length})</span>
            </button>
          )}
        </div>

        <CountryFilters continents={continents} languages={languages} />
      </div>

      <CountryGrid />

      <CountryPagination />

      <CountryCompareModal
        open={showCompareModal}
        onOpenChange={setShowCompareModal}
        countries={selectedCountries}
        onRemoveCountry={removeCountry}
      />
    </FilteredCountriesProvider>
  );
}
