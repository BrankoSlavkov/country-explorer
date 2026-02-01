import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockCountries, createMockCountry } from "~/test-utils";
import { CountryPagination } from "../country-pagination";

const mockNavigate = vi.fn();

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    createFileRoute: () => () => ({ useSearch: () => ({}) }),
  };
});

describe("CountryPagination", () => {
  const mockCountries = createMockCountries();
  const defaultProps = {
    countries: mockCountries,
    search: undefined,
    sortBy: "name-asc" as const,
    populationFilter: "all" as const,
    continent: undefined,
    language: undefined,
    isFavorite: () => false,
    page: 1,
    perPage: 3,
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("returns null when only one page exists", () => {
    const { container } = render(
      <CountryPagination {...defaultProps} perPage={100} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("displays page numbers and navigation buttons", () => {
    render(<CountryPagination {...defaultProps} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to previous page")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to next page")).toBeInTheDocument();
  });

  it("disables previous button on first page and next on last page", () => {
    const { rerender } = render(
      <CountryPagination {...defaultProps} page={1} />,
    );
    expect(screen.getByLabelText("Go to previous page")).toBeDisabled();

    rerender(<CountryPagination {...defaultProps} page={3} />);
    expect(screen.getByLabelText("Go to next page")).toBeDisabled();
  });

  it("shows correct item range", () => {
    render(<CountryPagination {...defaultProps} page={1} />);
    expect(
      screen.getByText(/Showing 1 to 3 of 7 countries/),
    ).toBeInTheDocument();
  });

  it("navigates when page number is clicked", async () => {
    const user = userEvent.setup();
    render(<CountryPagination {...defaultProps} />);

    await user.click(screen.getByText("2"));
    expect(mockNavigate).toHaveBeenCalled();
  });

  it("resets to page 1 when per-page changes", async () => {
    const user = userEvent.setup();
    render(<CountryPagination {...defaultProps} page={2} />);

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

    render(
      <CountryPagination
        {...defaultProps}
        countries={manyCountries}
        perPage={5}
        page={5}
      />,
    );

    expect(screen.getAllByText("More pages").length).toBeGreaterThan(0);
  });
});
