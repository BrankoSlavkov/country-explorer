import { createContext, type ReactNode, useContext, useState } from "react";
import type { CountryCard } from "~/api/countries.queries";

interface CompareContextValue {
  compareMode: boolean;
  selectedCountries: CountryCard[];
  toggleCompareMode: () => void;
  addCountry: (country: CountryCard) => void;
  removeCountry: (countryName: string) => void;
  clearSelection: () => void;
  isSelected: (countryName: string) => boolean;
  canAddMore: boolean;
}

const CompareContext = createContext<CompareContextValue | undefined>(
  undefined,
);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareMode, setCompareMode] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<CountryCard[]>([]);

  const toggleCompareMode = () => {
    setCompareMode((prev) => !prev);
    if (compareMode) {
      setSelectedCountries([]);
    }
  };

  const addCountry = (country: CountryCard) => {
    if (selectedCountries.length < 4) {
      setSelectedCountries((prev) => [...prev, country]);
    }
  };

  const removeCountry = (countryName: string) => {
    setSelectedCountries((prev) =>
      prev.filter((c) => c.name.common !== countryName),
    );
  };

  const clearSelection = () => {
    setSelectedCountries([]);
  };

  const isSelected = (countryName: string) => {
    return selectedCountries.some((c) => c.name.common === countryName);
  };

  const canAddMore = selectedCountries.length < 4;

  return (
    <CompareContext.Provider
      value={{
        compareMode,
        selectedCountries,
        toggleCompareMode,
        addCountry,
        removeCountry,
        clearSelection,
        isSelected,
        canAddMore,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within CompareProvider");
  }
  return context;
}
