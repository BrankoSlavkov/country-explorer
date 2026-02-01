import { Link } from "@tanstack/react-router";
import { GitCompare, Heart } from "lucide-react";
import { useState } from "react";
import { CountryCard } from "~/components/country-card";
import { CountryCardListSkeleton } from "~/components/country-card-list-skeleton";
import { CountryCompareModal } from "~/components/country-compare-modal";
import { CountryFilters } from "~/components/country-filters";
import { CountryPagination } from "~/components/country-pagination";
import { useCompare } from "~/contexts/compare-context";
import { useCountries } from "~/hooks/use-countries";
import { useCountryFiltering } from "~/hooks/use-country-filtering";
import { useCountrySearchParams } from "~/hooks/use-country-search-params";
import { useFavorites } from "~/hooks/use-favorites";

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
  const { isFavorite, favoritesCount } = useFavorites();
  const [showCompareModal, setShowCompareModal] = useState(false);

  const { paginatedCountries } = useCountryFiltering({
    countries,
    search,
    sortBy,
    populationFilter,
    continent,
    language,
    isFavorite,
    page,
    perPage,
  });

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

      <CountryPagination
        countries={countries}
        search={search}
        sortBy={sortBy}
        populationFilter={populationFilter}
        continent={continent}
        language={language}
        isFavorite={isFavorite}
        page={page}
        perPage={perPage}
      />

      <CountryCompareModal
        open={showCompareModal}
        onOpenChange={setShowCompareModal}
        countries={selectedCountries}
        onRemoveCountry={removeCountry}
      />
    </>
  );
}
