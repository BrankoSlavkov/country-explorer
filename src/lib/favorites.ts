import type { Country } from "~/api/countries.types";

export type FavoritesRecord = Record<Country["cca3"], true>;
export const KEY = "favorite-countries";

export class LocalStorageFavorites {
  #cachedRecord: FavoritesRecord;

  #listeners = new Set<() => void>();

  #emitChange = () => {
    this.#listeners.forEach((listener) => {
      listener();
    });
  };

  constructor() {
    this.#cachedRecord = this.#readFromStorage();

    window.addEventListener("storage", (e) => {
      if (e.key !== KEY) return;

      if (e.newValue === null) {
        this.#cachedRecord = {};
      } else {
        this.#cachedRecord = JSON.parse(e.newValue);
      }

      this.#emitChange();
    });
  }

  #readFromStorage(): FavoritesRecord {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch {
      return {};
    }
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
    localStorage.setItem(KEY, JSON.stringify(this.#cachedRecord));
    this.#emitChange();
  }
}

export const localStorageFavorites = new LocalStorageFavorites();
