import { Heart } from "lucide-react";
import type { Country } from "~/api/countries.types";
import { useFavorite } from "~/hooks/use-favorite";
import { cn } from "~/lib/cn";

interface FavoriteButtonProps {
  countryCode: Country["cca3"] | undefined;
}

export function FavoriteButton({ countryCode }: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorite(countryCode);

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn("p-2 rounded-lg transition-colors cursor-pointer", {
        ["text-red-500 hover:text-red-400"]: isFavorite,
        ["text-white/70 hover:text-white hover:bg-white/10"]: !isFavorite,
      })}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
    </button>
  );
}
