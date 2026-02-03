import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { CountryCard } from "~/components/country-card";
import { useCountries } from "~/hooks/use-countries";
import { useFavorites } from "~/hooks/use-favorites";

export const Route = createFileRoute("/favorites")({
  component: FavoritesPage,
});

function FavoritesPage() {
  const { countries, isLoading } = useCountries();
  const { favoritesList } = useFavorites();

  const favoriteCountries = useMemo(() => {
    if (!countries) return [];
    return countries.filter((country) => favoritesList.includes(country.cca3));
  }, [countries, favoritesList]);

  return (
    <div className="min-h-screen p-8 bg-app">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to All Countries
          </Link>
        </div>

        {isLoading ? (
          <div className="text-white text-center py-12">Loading...</div>
        ) : favoriteCountries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              No favorites yet
            </h2>
            <p className="text-white/70 mb-6">
              Start adding countries to your favorites by clicking the heart
              icon
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all"
            >
              Browse Countries
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteCountries.map((country) => (
              <CountryCard key={country.name.common} country={country} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
