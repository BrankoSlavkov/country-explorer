import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { countryQueries } from "~/api/countries.queries";
import type { Country } from "~/api/countries.types";

interface BorderCountriesProps {
  codes: NonNullable<Country["borders"]>;
}

export function BorderCountries({ codes }: BorderCountriesProps) {
  const { data: borders } = useSuspenseQuery(countryQueries.borders(codes));

  return (
    <div className="rounded-xl backdrop-blur-md bg-black/50 border border-white/20 p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>🗺️</span> Border Countries
      </h2>
      <div className="flex flex-wrap gap-4">
        {borders.map((border) => (
          <Link
            key={border.cca3}
            to="/$countryName"
            params={{ countryName: border.name.common }}
            className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <img
              src={border.flags.svg}
              alt={`Flag of ${border.name.common}`}
              className="w-16 h-auto rounded shadow"
            />
            <span className="text-sm text-white/80">{border.name.common}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function BorderCountriesSkeleton() {
  return (
    <div className="rounded-xl backdrop-blur-md bg-black/50 border border-white/20 p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>🗺️</span> Border Countries
      </h2>
      <div className="flex flex-wrap gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2 p-3">
            <div className="w-16 h-10 bg-white/10 rounded animate-pulse" />
            <div className="w-16 h-4 bg-white/10 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
