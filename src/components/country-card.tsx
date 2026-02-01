import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { CountryCard as CountryCardType } from "~/api/countries.queries";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { formatStatistic } from "~/lib/format";

interface CountryCardProps {
  country: CountryCardType;
}

function formatCurrencies(currencies: CountryCardType["currencies"]): string {
  if (!currencies) return "N/A";
  return Object.values(currencies)
    .map((c) => `${c.name} (${c.symbol})`)
    .join(", ");
}

export function CountryCard({ country }: CountryCardProps) {
  const [open, setOpen] = useState(false);
  const formattedPopulation = formatStatistic(country.population);
  const formattedArea = formatStatistic(country.area);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <Link
            to="/$countryName"
            params={{ countryName: country.name.common }}
            className="block p-6 rounded-xl backdrop-blur-md bg-black/50 border border-white/20 shadow-lg hover:bg-black/60 transition-all duration-200 hover:scale-105"
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
        </div>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <h3 className="text-white font-semibold mb-2 text-sm">
          More about {country.name.common}
        </h3>
        <div className="space-y-1.5 text-xs">
          <p className="text-white/80">
            <span className="text-white/50">Capital:</span>{" "}
            {country.capital?.join(", ") ?? "N/A"}
          </p>
          <p className="text-white/80">
            <span className="text-white/50">Region:</span> {country.region}
          </p>
          <p className="text-white/80">
            <span className="text-white/50">Subregion:</span>{" "}
            {country.subregion ?? "N/A"}
          </p>
          <p className="text-white/80">
            <span className="text-white/50">Area:</span> {formattedArea} km²
          </p>
          <p className="text-white/80">
            <span className="text-white/50">Currency:</span>{" "}
            {formatCurrencies(country.currencies)}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
