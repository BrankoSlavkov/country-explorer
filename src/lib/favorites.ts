import type { Country } from "~/api/countries.types";

export type FavoritesRecord = Record<Country["cca3"], true>;

class LocalStorageFavorites {
  #key = "favorite-countries";
  #cachedRecord: FavoritesRecord = JSON.parse(
    localStorage.getItem(this.#key) || "{}",
  );

  #listeners = new Set<() => void>();

  #emitChange = () => {
    this.#listeners.forEach((listener) => {
      listener();
    });
  };

  constructor() {
    window.addEventListener("storage", (e) => {
      if (e.key === this.#key) {
        this.#cachedRecord = JSON.parse(e.newValue || "{}");
        this.#emitChange();
      }
    });
  }

  subscribe = (listener: () => void) => {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  };

  getSnapshot = (): FavoritesRecord => {
    return this.#cachedRecord;
  };

  has(countryCode: Country["cca3"]): boolean {
    return countryCode in this.#cachedRecord;
  }

  toggle(countryCode: Country["cca3"]): void {
    const newRecord = { ...this.#cachedRecord };

    if (countryCode in newRecord) {
      delete newRecord[countryCode];
    } else {
      newRecord[countryCode] = true;
    }

    this.#cachedRecord = newRecord;
    localStorage.setItem(this.#key, JSON.stringify(this.#cachedRecord));
    this.#emitChange();
  }
}

export const localStorageFavorites = new LocalStorageFavorites();
