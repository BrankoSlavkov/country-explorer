import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Suspense, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { countryQueries } from "~/api/countries.queries";
import type { Country } from "~/api/countries.types";
import { CountryDetails } from "~/components/country-details";
import { CountryDetailsSkeleton } from "~/components/country-details-skeleton";
import { ErrorState } from "~/components/error-state";
import { ExportButton } from "~/components/export-button";
import { FavoriteButton } from "~/components/favorite-button";
import { ShareButton } from "~/components/share-button";

interface CountryDetailsPageProps {
  countryName: Country["name"]["common"];
}

export function CountryDetailsPage({ countryName }: CountryDetailsPageProps) {
  const { data: country } = useQuery(countryQueries.detail(countryName));
  const detailsRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="min-h-screen text-white"
      style={{
        backgroundImage:
          "radial-gradient(circle at 30% 20%, #1a1a2e 0%, #0d0d1a 100%)",
      }}
    >
      <header className="sticky top-0 z-10 backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            ← Back to Countries
          </Link>
          <div className="flex items-center gap-2">
            <ExportButton country={country} detailsRef={detailsRef} />
            <ShareButton title={countryName} />
            <FavoriteButton countryCode={country?.cca3} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <ErrorBoundary
          fallback={
            <ErrorState
              variant="not-found"
              message={`We couldn't find a country named "${countryName}". Please check the spelling and try again.`}
            />
          }
        >
          <Suspense fallback={<CountryDetailsSkeleton />}>
            <CountryDetails countryName={countryName} ref={detailsRef} />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}
