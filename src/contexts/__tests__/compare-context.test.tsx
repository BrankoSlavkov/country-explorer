import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { createMockCountry } from "~/test-utils";
import { CompareProvider, useCompare } from "../compare-context";

function wrapper({ children }: { children: ReactNode }) {
  return <CompareProvider>{children}</CompareProvider>;
}

describe("CompareContext", () => {
  it("starts with compare mode off and empty selection", () => {
    const { result } = renderHook(() => useCompare(), { wrapper });

    expect(result.current.compareMode).toBe(false);
    expect(result.current.selectedCountries).toHaveLength(0);
    expect(result.current.canAddMore).toBe(true);
  });

  it("toggles compare mode and clears selection when turning off", () => {
    const { result } = renderHook(() => useCompare(), { wrapper });

    act(() => {
      result.current.toggleCompareMode();
      result.current.addCountry(createMockCountry());
    });

    expect(result.current.compareMode).toBe(true);
    expect(result.current.selectedCountries).toHaveLength(1);

    act(() => {
      result.current.toggleCompareMode();
    });

    expect(result.current.compareMode).toBe(false);
    expect(result.current.selectedCountries).toHaveLength(0);
  });

  it("limits selection to 4 countries", () => {
    const { result } = renderHook(() => useCompare(), { wrapper });

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
  });

  it("adds and removes countries by name", () => {
    const { result } = renderHook(() => useCompare(), { wrapper });

    act(() => {
      result.current.addCountry(
        createMockCountry({ name: { common: "USA", official: "USA" } }),
      );
      result.current.addCountry(
        createMockCountry({ name: { common: "Canada", official: "Canada" } }),
      );
    });

    expect(result.current.isSelected("USA")).toBe(true);
    expect(result.current.isSelected("Canada")).toBe(true);

    act(() => {
      result.current.removeCountry("USA");
    });

    expect(result.current.isSelected("USA")).toBe(false);
    expect(result.current.isSelected("Canada")).toBe(true);
  });

  it("throws error when useCompare is used outside provider", () => {
    expect(() => {
      renderHook(() => useCompare());
    }).toThrow("useCompare must be used within CompareProvider");
  });
});
