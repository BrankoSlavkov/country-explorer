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

    // Save scroll position
    const scrollY = window.scrollY;

    toggleFavorite(country.cca3);

    // Restore scroll position after state update
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
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
          aria-label={
            favorite
              ? `Remove ${country.name.common} from favorites`
              : `Add ${country.name.common} to favorites`
          }
          aria-pressed={favorite}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors z-10"
        >
          <Heart
            aria-hidden="true"
            className={`w-5 h-5 transition-colors ${
              favorite
                ? "fill-red-500 text-red-500"
                : "text-white/80 hover:text-white"
            }`}
          />
        </button>
      )}
      {compareMode && selected && (
        <div
          className="absolute top-4 right-4 bg-blue-500 rounded-full p-1"
          aria-label="Selected for comparison"
        >
          <Check aria-hidden="true" className="w-5 h-5 text-white" />
        </div>
      )}
      <div
        className="text-6xl mb-4"
        role="img"
        aria-label={`Flag of ${country.name.common}`}
      >
        {country.flag}
      </div>
      <h2 className="text-xl font-semibold text-white mb-3">
        {country.name.common}
      </h2>
      <dl className="space-y-2 text-white/80 text-sm">
        <div>
          <dt className="inline text-white/60">Population:</dt>{" "}
          <dd className="inline">{formattedPopulation}</dd>
        </div>
        <div>
          <dt className="inline text-white/60">Continent:</dt>{" "}
          <dd className="inline">{country.continents.join(", ")}</dd>
        </div>
      </dl>
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
          onFocus={() => setOpen(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setOpen(false);
            }
          }}
        >
          <Link
            to="/$countryName"
            params={{ countryName: country.name.common }}
            aria-describedby={open ? `popover-${country.cca3}` : undefined}
          >
            {cardContent}
          </Link>
        </div>
      </PopoverTrigger>
      <PopoverContent
        id={`popover-${country.cca3}`}
        side="top"
        align="center"
        role="tooltip"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <h3 className="text-white font-semibold mb-2 text-sm">
          More about {country.name.common}
        </h3>
        <dl className="space-y-1.5 text-xs">
          <div>
            <dt className="inline text-white/60">Capital:</dt>{" "}
            <dd className="inline text-white/90">
              {country.capital?.join(", ") ?? "N/A"}
            </dd>
          </div>
          <div>
            <dt className="inline text-white/60">Region:</dt>{" "}
            <dd className="inline text-white/90">{country.region}</dd>
          </div>
          <div>
            <dt className="inline text-white/60">Area:</dt>{" "}
            <dd className="inline text-white/90">{formattedArea} km²</dd>
          </div>
          <div>
            <dt className="inline text-white/60">Currency:</dt>{" "}
            <dd className="inline text-white/90">
              {formatCurrencies(country.currencies)}
            </dd>
          </div>
        </dl>
      </PopoverContent>
    </Popover>
  );
}
