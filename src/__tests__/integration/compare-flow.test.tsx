import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { CompareProvider, useCompare } from "~/contexts/compare-context";
import { createMockCountry } from "~/test-utils";

function wrapper({ children }: { children: ReactNode }) {
  return <CompareProvider>{children}</CompareProvider>;
}

describe("Compare Flow", () => {
  it("completes full compare workflow: enter mode, select, remove, exit", () => {
    const { result } = renderHook(() => useCompare(), { wrapper });

    // Initially not in compare mode
    expect(result.current.compareMode).toBe(false);

    // Enter compare mode
    act(() => {
      result.current.toggleCompareMode();
    });
    expect(result.current.compareMode).toBe(true);

    // Select countries
    const countries = [
      createMockCountry({
        name: { common: "USA", official: "USA" },
        cca3: "USA",
      }),
      createMockCountry({
        name: { common: "Canada", official: "Canada" },
        cca3: "CAN",
      }),
      createMockCountry({
        name: { common: "Mexico", official: "Mexico" },
        cca3: "MEX",
      }),
    ];

    for (const country of countries) {
      act(() => {
        result.current.addCountry(country);
      });
    }

    expect(result.current.selectedCountries).toHaveLength(3);
    expect(result.current.isSelected("USA")).toBe(true);

    // Remove one
    act(() => {
      result.current.removeCountry("Canada");
    });
    expect(result.current.selectedCountries).toHaveLength(2);
    expect(result.current.isSelected("Canada")).toBe(false);

    // Exit compare mode clears selection
    act(() => {
      result.current.toggleCompareMode();
    });
    expect(result.current.compareMode).toBe(false);
    expect(result.current.selectedCountries).toHaveLength(0);
  });

  it("enforces maximum of 4 countries for comparison", () => {
    const { result } = renderHook(() => useCompare(), { wrapper });

    act(() => {
      result.current.toggleCompareMode();
    });

    // Try to add 5 countries
    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current.addCountry(
          createMockCountry({
            name: { common: `Country${i}`, official: `C${i}` },
            cca3: `C0${i}`,
          }),
        );
      });
    }

    expect(result.current.selectedCountries).toHaveLength(4);
    expect(result.current.canAddMore).toBe(false);

    // Removing one allows adding again
    act(() => {
      result.current.removeCountry("Country0");
    });
    expect(result.current.canAddMore).toBe(true);
  });
});
