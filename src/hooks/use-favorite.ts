import { useSyncExternalStore } from "react";
import type { Country } from "~/api/countries.types";
import { localStorageFavorites } from "~/lib/favorites";

export function useFavorite(countryCode: Country["cca3"] | undefined): {
  isFavorite: boolean;
  toggle: () => void;
} {
  const record = useSyncExternalStore(
    localStorageFavorites.subscribe,
    localStorageFavorites.getSnapshot,
  );

  const isFavorite = countryCode ? countryCode in record : false;

  const toggle = () => {
    if (countryCode) {
      localStorageFavorites.toggle(countryCode);
    }
  };

  return { isFavorite, toggle };
}
