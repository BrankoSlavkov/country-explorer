import { Link } from "@tanstack/react-router";
import type { CountryCard as CountryCardType } from "~/api/countries.queries";
import { formatStatistic } from "~/lib/format";

interface CountryCardProps {
  country: CountryCardType;
}

export function CountryCard({ country }: CountryCardProps) {
  const formattedPopulation = formatStatistic(country.population);

  return (
    <Link
      to="/$countryName"
      params={{ countryName: country.name.common }}
      className="block p-6 rounded-xl backdrop-blur-md bg-black/50 border border-white/20 shadow-lg hover:bg-black/60 transition-colors"
    >
      <div className="text-6xl mb-4">{country.flag}</div>
      <h2 className="text-xl font-semibold text-white mb-3">
        {country.name.common}
      </h2>
      <div className="space-y-2 text-white/70 text-sm">
        <p>
          <span className="text-white/50">Population:</span>{" "}
          {formattedPopulation}
        </p>
        <p>
          <span className="text-white/50">Continent:</span>{" "}
          {country.continents.join(", ")}
        </p>
      </div>
    </Link>
  );
}
