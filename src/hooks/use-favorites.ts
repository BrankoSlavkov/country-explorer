import { useSyncExternalStore } from "react";
import type { Country } from "~/api/countries.types";
import { localStorageFavorites } from "~/lib/favorites";

export function useFavorites() {
  const favorites = useSyncExternalStore(
    localStorageFavorites.subscribe,
    localStorageFavorites.getSnapshot,
  );

  const isFavorite = (countryCode: Country["cca3"]) => {
    return localStorageFavorites.has(countryCode);
  };

  const toggleFavorite = (countryCode: Country["cca3"]) => {
    localStorageFavorites.toggle(countryCode);
  };

  const favoritesList = Object.keys(favorites);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    favoritesList,
    favoritesCount: favoritesList.length,
  };
}
