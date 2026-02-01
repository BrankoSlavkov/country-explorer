import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CountryFilters } from "../country-filters";

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("~/routes/index", () => ({
  Route: {
    useSearch: () => ({
      search: undefined,
      continent: undefined,
      population: "all",
      language: undefined,
      sortBy: "name-asc",
    }),
  },
}));

describe("CountryFilters", () => {
  const defaultProps = {
    continents: ["Europe", "Asia", "Africa"],
    languages: ["English", "French", "Spanish"],
    isLoading: false,
  };

  it("renders all filter controls", () => {
    render(<CountryFilters {...defaultProps} />);

    expect(screen.getByLabelText("Search Country")).toBeInTheDocument();
    expect(screen.getByLabelText("Continent")).toBeInTheDocument();
    expect(screen.getByLabelText("Population")).toBeInTheDocument();
    expect(screen.getByLabelText("Language")).toBeInTheDocument();
    expect(screen.getByLabelText("Sort By")).toBeInTheDocument();
  });

  it("populates filter options from props", () => {
    render(<CountryFilters {...defaultProps} />);

    const continentSelect = screen.getByLabelText("Continent");
    expect(continentSelect.querySelectorAll("option").length).toBeGreaterThan(
      1,
    );

    const languageSelect = screen.getByLabelText("Language");
    expect(languageSelect.querySelectorAll("option").length).toBeGreaterThan(1);
  });

  it("includes all population filter options", () => {
    render(<CountryFilters {...defaultProps} />);

    const populationSelect = screen.getByLabelText("Population");
    const options = Array.from(populationSelect.querySelectorAll("option")).map(
      (o) => o.textContent,
    );

    expect(options).toContain("All Populations");
    expect(options).toContain("< 1M");
    expect(options).toContain("1M - 10M");
    expect(options).toContain("10M - 50M");
    expect(options).toContain("> 50M");
  });

  it("includes all sort options", () => {
    render(<CountryFilters {...defaultProps} />);

    const sortSelect = screen.getByLabelText("Sort By");
    const options = Array.from(sortSelect.querySelectorAll("option")).map(
      (o) => o.textContent,
    );

    expect(options).toContain("Name (A-Z)");
    expect(options).toContain("Population (High to Low)");
    expect(options).toContain("Area (Large to Small)");
  });
});
