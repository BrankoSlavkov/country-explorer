import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Country } from "~/api/countries.types";
import { exportToCSV } from "../export";

describe("exportToCSV", () => {
  const mockCountry: Country = {
    name: {
      common: "Australia",
      official: "Commonwealth of Australia",
      nativeName: {
        eng: { official: "Commonwealth of Australia", common: "Australia" },
      },
    },
    tld: [".au"],
    cca2: "AU",
    ccn3: "036",
    cca3: "AUS",
    cioc: "AUS",
    independent: true,
    status: "officially-assigned",
    unMember: true,
    currencies: {
      AUD: { name: "Australian dollar", symbol: "$" },
    },
    idd: {
      root: "+6",
      suffixes: ["1"],
    },
    capital: ["Canberra"],
    altSpellings: ["AU", "Oz"],
    region: "Oceania",
    subregion: "Australia and New Zealand",
    languages: { eng: "English" },
    latlng: [-27, 133],
    landlocked: false,
    borders: undefined,
    area: 7692024,
    demonyms: {
      eng: { f: "Australian", m: "Australian" },
    },
    translations: {},
    flag: "🇦🇺",
    maps: {
      googleMaps: "https://goo.gl/maps/australia",
      openStreetMaps: "https://osm.org/australia",
    },
    population: 25687041,
    gini: { "2014": 34.4 },
    fifa: "AUS",
    car: {
      signs: ["AUS"],
      side: "left",
    },
    timezones: ["UTC+05:00", "UTC+10:00"],
    continents: ["Oceania"],
    flags: {
      png: "https://flagcdn.com/w320/au.png",
      svg: "https://flagcdn.com/au.svg",
      alt: "Flag of Australia",
    },
    coatOfArms: {
      png: "https://mainfacts.com/media/images/coats_of_arms/au.png",
      svg: "https://mainfacts.com/media/images/coats_of_arms/au.svg",
    },
    startOfWeek: "monday",
    capitalInfo: {
      latlng: [-35.27, 149.13],
    },
    postalCode: {
      format: "####",
      regex: "^(\\d{4})$",
    },
  };

  let clickedLink: HTMLAnchorElement | null = null;
  let createdBlobUrl: string | null = null;
  let revokedUrl: string | null = null;

  beforeEach(() => {
    clickedLink = null;
    createdBlobUrl = null;
    revokedUrl = null;

    vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
      createdBlobUrl = `blob:${blob.type}`;
      return createdBlobUrl;
    });

    vi.spyOn(URL, "revokeObjectURL").mockImplementation((url) => {
      revokedUrl = url;
    });

    vi.spyOn(document, "createElement").mockImplementation((tag) => {
      if (tag === "a") {
        const link = {
          href: "",
          download: "",
          click: vi.fn(),
        } as unknown as HTMLAnchorElement;
        clickedLink = link;
        return link;
      }
      return document.createElement(tag);
    });
  });

  it("creates a CSV blob with correct content type", () => {
    exportToCSV(mockCountry, "australia-details");

    expect(URL.createObjectURL).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "text/csv;charset=utf-8",
      }),
    );
  });

  it("triggers download with correct filename", () => {
    exportToCSV(mockCountry, "australia-details");

    expect(clickedLink?.download).toBe("australia-details.csv");
    expect(clickedLink?.click).toHaveBeenCalled();
  });

  it("cleans up blob URL after download", () => {
    exportToCSV(mockCountry, "australia-details");

    expect(URL.revokeObjectURL).toHaveBeenCalledWith(createdBlobUrl);
  });

  it("includes all country fields in CSV", async () => {
    let capturedBlob: Blob | null = null;

    vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
      capturedBlob = blob as Blob;
      return "blob:test";
    });

    exportToCSV(mockCountry, "test");

    const csvContent = await capturedBlob!.text();

    // Check key fields are present
    expect(csvContent).toContain("Australia");
    expect(csvContent).toContain("Commonwealth of Australia");
    expect(csvContent).toContain("Canberra");
    expect(csvContent).toContain("Oceania");
    expect(csvContent).toContain("25687041");
    expect(csvContent).toContain("7692024");
    expect(csvContent).toContain("English");
    expect(csvContent).toContain("Australian dollar");
    expect(csvContent).toContain("+61");
    expect(csvContent).toContain("left");
    expect(csvContent).toContain(".au");
  });

  it("handles missing optional fields gracefully", async () => {
    const minimalCountry: Country = {
      ...mockCountry,
      name: {
        common: "TestLand",
        official: "Republic of TestLand",
        nativeName: undefined,
      },
      capital: undefined,
      borders: undefined,
      currencies: undefined,
      languages: undefined,
      gini: undefined,
      demonyms: undefined,
      postalCode: undefined,
      cioc: undefined,
      fifa: undefined,
      ccn3: undefined,
      coatOfArms: {},
      tld: undefined,
    };

    let capturedBlob: Blob | null = null;
    vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
      capturedBlob = blob as Blob;
      return "blob:test";
    });

    exportToCSV(minimalCountry, "test");

    const csvContent = await capturedBlob!.text();

    expect(csvContent).toContain("N/A");
    expect(csvContent).toContain("None"); // For borders
  });

  it("escapes quotes in CSV values", async () => {
    const countryWithQuotes: Country = {
      ...mockCountry,
      name: {
        common: 'Test "Country"',
        official: "Official",
      },
    };

    let capturedBlob: Blob | null = null;
    vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
      capturedBlob = blob as Blob;
      return "blob:test";
    });

    exportToCSV(countryWithQuotes, "test");

    const csvContent = await capturedBlob!.text();

    // CSV escaping doubles quotes
    expect(csvContent).toContain('Test ""Country""');
  });
});
