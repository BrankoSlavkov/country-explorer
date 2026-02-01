import { Link } from "@tanstack/react-router";
import { Check, Heart } from "lucide-react";
import { useState } from "react";
import type { CountryCard as CountryCardType } from "~/api/countries.queries";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useCompare } from "~/contexts/compare-context";
import { useFavorites } from "~/hooks/use-favorites";
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
  const { compareMode, isSelected, addCountry, removeCountry, canAddMore } =
    useCompare();
  const { isFavorite, toggleFavorite } = useFavorites();

  const selected = isSelected(country.name.common);
  const favorite = isFavorite(country.cca3);

  const handleClick = (e: React.MouseEvent) => {
    if (compareMode) {
      e.preventDefault();
      if (selected) {
        removeCountry(country.name.common);
      } else if (canAddMore) {
        addCountry(country);
      }
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(country.cca3);
  };

  const cardContent = (
    <div
      className={`block p-6 rounded-xl backdrop-blur-md border shadow-lg transition-all duration-200 ${
        compareMode
          ? selected
            ? "bg-blue-600/60 border-blue-400 scale-105"
            : canAddMore
              ? "bg-black/50 border-white/20 hover:bg-black/60 hover:scale-105 cursor-pointer"
              : "bg-black/30 border-white/10 opacity-50 cursor-not-allowed"
          : "bg-black/50 border-white/20 hover:bg-black/60 hover:scale-105"
      }`}
      onClick={handleClick}
    >
      {!compareMode && (
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors z-10"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              favorite
                ? "fill-red-500 text-red-500"
                : "text-white/70 hover:text-white"
            }`}
          />
        </button>
      )}
      {compareMode && selected && (
        <div className="absolute top-4 right-4 bg-blue-500 rounded-full p-1">
          <Check className="w-5 h-5 text-white" />
        </div>
      )}
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
    </div>
  );

  if (compareMode) {
    return <div className="relative">{cardContent}</div>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className="relative"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <Link
            to="/$countryName"
            params={{ countryName: country.name.common }}
          >
            {cardContent}
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
