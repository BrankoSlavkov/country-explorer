import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_POPULATION_FILTER, DEFAULT_SORT } from "~/constants/filters";
import { FilteredCountriesProvider } from "~/contexts/filtered-countries-context";
import { createMockCountries, createMockCountry } from "~/test-utils";
import { CountryPagination } from "../country-pagination";

const mockNavigate = vi.fn();
let mockSearchParams = { page: 1, perPage: 3 };

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    createFileRoute: () => () => ({ useSearch: () => ({}) }),
  };
});

vi.mock("~/hooks/use-country-search-params", () => ({
  useCountrySearchParams: () => mockSearchParams,
}));

interface WrapperProps {
  countries: ReturnType<typeof createMockCountries>;
  page?: number;
  perPage?: number;
  favorites?: Record<string, boolean>;
}

function renderWithProvider({
  countries,
  page = 1,
  perPage = 3,
  favorites = {},
}: WrapperProps) {
  mockSearchParams = { page, perPage };
  return render(
    <FilteredCountriesProvider
      countries={countries}
      search={undefined}
      sortBy={DEFAULT_SORT}
      populationFilter={DEFAULT_POPULATION_FILTER}
      continent={undefined}
      language={undefined}
      favorites={favorites}
      page={page}
      perPage={perPage}
    >
      <CountryPagination />
    </FilteredCountriesProvider>,
  );
}

describe("CountryPagination", () => {
  const mockCountries = createMockCountries();

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("returns null when only one page exists", () => {
    const { container } = renderWithProvider({
      countries: mockCountries,
      perPage: 100,
    });
    expect(container.firstChild).toBeNull();
  });

  it("displays page numbers and navigation buttons", () => {
    renderWithProvider({ countries: mockCountries });

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to previous page")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to next page")).toBeInTheDocument();
  });

  it("disables previous button on first page and next on last page", () => {
    const { unmount } = renderWithProvider({
      countries: mockCountries,
      page: 1,
    });
    expect(screen.getByLabelText("Go to previous page")).toBeDisabled();
    unmount();

    renderWithProvider({ countries: mockCountries, page: 3 });
    expect(screen.getByLabelText("Go to next page")).toBeDisabled();
  });

  it("shows correct item range", () => {
    renderWithProvider({ countries: mockCountries, page: 1 });
    expect(screen.getByText(/Showing 1-3 of 7/)).toBeInTheDocument();
  });

  it("navigates when page number is clicked", async () => {
    const user = userEvent.setup();
    renderWithProvider({ countries: mockCountries });

    await user.click(screen.getByText("2"));
    expect(mockNavigate).toHaveBeenCalled();
  });

  it("resets to page 1 when per-page changes", async () => {
    const user = userEvent.setup();
    renderWithProvider({ countries: mockCountries, page: 2 });

    await user.selectOptions(screen.getByRole("combobox"), "50");

    const searchFn = mockNavigate.mock.calls[0][0].search;
    expect(searchFn({ page: 2 }).page).toBe(1);
  });

  it("shows ellipsis for many pages", () => {
    const manyCountries = Array.from({ length: 50 }, (_, i) =>
      createMockCountry({
        name: { common: `C${i}`, official: `C${i}` },
        cca3: `C${i}`,
      }),
    );

    renderWithProvider({
      countries: manyCountries,
      perPage: 5,
      page: 5,
    });

    expect(screen.getAllByText("More pages").length).toBeGreaterThan(0);
  });
});
