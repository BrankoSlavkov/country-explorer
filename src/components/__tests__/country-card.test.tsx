import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CompareProvider } from "~/contexts/compare-context";
import { KEY } from "~/lib/favorites";
import { createMockCountry } from "~/test-utils";
import { CountryCard } from "../country-card";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

function renderWithCompare(ui: React.ReactElement) {
  return render(<CompareProvider>{ui}</CompareProvider>);
}

describe("CountryCard", () => {
  const mockCountry = createMockCountry({
    name: { common: "Australia", official: "Commonwealth of Australia" },
    flag: "\u{1F1E6}\u{1F1FA}",
    population: 25000000,
    continents: ["Oceania"],
    cca3: "AUS",
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it("displays country info: flag, name, population, and continent", () => {
    renderWithCompare(<CountryCard country={mockCountry} />);

    expect(screen.getByText("\u{1F1E6}\u{1F1FA}")).toBeInTheDocument();
    expect(screen.getByText("Australia")).toBeInTheDocument();
    expect(screen.getByText("25,000,000")).toBeInTheDocument();
    expect(screen.getByText("Oceania")).toBeInTheDocument();
  });

  it("links to country detail page", () => {
    renderWithCompare(<CountryCard country={mockCountry} />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/$countryName");
  });

  it("toggles favorite and persists to localStorage", async () => {
    const user = userEvent.setup();
    renderWithCompare(<CountryCard country={mockCountry} />);

    await user.click(screen.getByRole("button"));

    expect(JSON.parse(localStorage.getItem(KEY) || "{}").AUS).toBe(true);
  });

  it("displays multiple continents joined by comma", () => {
    const multiContinentCountry = createMockCountry({
      continents: ["Europe", "Asia"],
    });

    renderWithCompare(<CountryCard country={multiContinentCountry} />);

    expect(screen.getByText("Europe, Asia")).toBeInTheDocument();
  });
});
