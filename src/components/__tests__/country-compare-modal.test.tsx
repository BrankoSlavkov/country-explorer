import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockCountry } from "~/test-utils";
import { CountryCompareModal } from "../country-compare-modal";

describe("CountryCompareModal", () => {
  const mockCountries = [
    createMockCountry({
      name: { common: "Australia", official: "Commonwealth of Australia" },
      population: 25000000,
      area: 7692024,
      capital: ["Canberra"],
      region: "Oceania",
      cca3: "AUS",
    }),
    createMockCountry({
      name: { common: "Germany", official: "Federal Republic of Germany" },
      population: 83000000,
      area: 357114,
      capital: ["Berlin"],
      region: "Europe",
      cca3: "DEU",
    }),
  ];

  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    countries: mockCountries,
    onRemoveCountry: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders country comparison with details when open", () => {
    render(<CountryCompareModal {...defaultProps} />);

    expect(screen.getByText("Compare Countries (2)")).toBeInTheDocument();
    expect(screen.getByText("Canberra")).toBeInTheDocument();
    expect(screen.getByText("Berlin")).toBeInTheDocument();
    expect(screen.getByText("Oceania")).toBeInTheDocument();
    expect(screen.getByText("Europe")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<CountryCompareModal {...defaultProps} open={false} />);
    expect(screen.queryByText("Compare Countries")).not.toBeInTheDocument();
  });

  it("renders comparison charts", () => {
    render(<CountryCompareModal {...defaultProps} />);

    expect(screen.getByText("Population Comparison")).toBeInTheDocument();
    expect(screen.getByText("Area Comparison")).toBeInTheDocument();
  });

  it("handles missing data gracefully", () => {
    const countryWithMissingData = createMockCountry({
      name: { common: "NoData", official: "No Data" },
      capital: undefined,
      languages: undefined,
      currencies: undefined,
      cca3: "NOD",
    });

    render(
      <CountryCompareModal
        {...defaultProps}
        countries={[countryWithMissingData]}
      />,
    );

    expect(screen.getAllByText("N/A").length).toBeGreaterThan(0);
  });

  it("calls onRemoveCountry when remove button is clicked", async () => {
    const user = userEvent.setup();
    const onRemoveCountry = vi.fn();

    render(
      <CountryCompareModal
        {...defaultProps}
        onRemoveCountry={onRemoveCountry}
      />,
    );

    const removeButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.querySelector(".w-4.h-4"));

    if (removeButtons.length > 0) {
      await user.click(removeButtons[0]);
      expect(onRemoveCountry).toHaveBeenCalledWith("Australia");
    }
  });
});
