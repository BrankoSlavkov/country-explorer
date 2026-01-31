import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CountryDetails } from "~/components/country-details";
import { CountryDetailsSkeleton } from "~/components/country-details-skeleton";
import { ErrorState } from "~/components/error-state";

interface CountryDetailsPageProps {
  countryName: string;
}

export function CountryDetailsPage({ countryName }: CountryDetailsPageProps) {
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
            <span>←</span>
            <span>Back to Countries</span>
          </Link>
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
            <CountryDetails countryName={countryName} />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}
