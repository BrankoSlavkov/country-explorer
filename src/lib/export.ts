import type { Country } from "~/api/countries.types";

export function exportToCSV(country: Country, filename: string): void {
  const rows: [string, string][] = [
    ["Field", "Value"],
    // Names
    ["Name (Common)", country.name.common],
    ["Name (Official)", country.name.official],
    [
      "Native Names",
      country.name.nativeName
        ? Object.entries(country.name.nativeName)
            .map(([lang, n]) => `${lang}: ${n.common} (${n.official})`)
            .join("; ")
        : "N/A",
    ],
    ["Alternative Spellings", country.altSpellings.join(", ")],
    // Codes
    ["Country Code (CCA2)", country.cca2],
    ["Country Code (CCA3)", country.cca3],
    ["Country Code (CCN3)", country.ccn3 || "N/A"],
    ["IOC Code", country.cioc || "N/A"],
    ["FIFA Code", country.fifa || "N/A"],
    // Status
    ["Independent", country.independent ? "Yes" : "No"],
    ["Status", country.status],
    ["UN Member", country.unMember ? "Yes" : "No"],
    // Geography
    ["Region", country.region],
    ["Subregion", country.subregion || "N/A"],
    ["Continents", country.continents.join(", ")],
    ["Capital", country.capital?.join(", ") || "N/A"],
    [
      "Capital Coordinates",
      country.capitalInfo.latlng
        ? `${country.capitalInfo.latlng[0]}°, ${country.capitalInfo.latlng[1]}°`
        : "N/A",
    ],
    ["Latitude", country.latlng[0].toString()],
    ["Longitude", country.latlng[1].toString()],
    ["Landlocked", country.landlocked ? "Yes" : "No"],
    ["Borders", country.borders?.join(", ") || "None"],
    ["Area (km²)", country.area.toString()],
    ["Timezones", country.timezones.join(", ")],
    // Demographics
    ["Population", country.population.toString()],
    [
      "Population Density (per km²)",
      (country.population / country.area).toFixed(2),
    ],
    ["Demonym (Male)", country.demonyms?.eng.m || "N/A"],
    ["Demonym (Female)", country.demonyms?.eng.f || "N/A"],
    [
      "Gini Index",
      country.gini
        ? Object.entries(country.gini)
            .map(([year, value]) => `${value} (${year})`)
            .join(", ")
        : "N/A",
    ],
    // Languages & Currency
    [
      "Languages",
      country.languages ? Object.values(country.languages).join(", ") : "N/A",
    ],
    [
      "Currencies",
      country.currencies
        ? Object.entries(country.currencies)
            .map(([code, c]) => `${c.name} (${c.symbol}) [${code}]`)
            .join(", ")
        : "N/A",
    ],
    [
      "Calling Codes",
      country.idd.root
        ? country.idd.suffixes
          ? country.idd.suffixes
              .map((s) => `${country.idd.root}${s}`)
              .join(", ")
          : country.idd.root
        : "N/A",
    ],
    // Driving & Week
    ["Driving Side", country.car.side],
    ["Car Signs", country.car.signs?.join(", ") || "N/A"],
    ["Start of Week", country.startOfWeek],
    // Internet
    ["Top Level Domains", country.tld?.join(", ") || "N/A"],
    // Postal
    ["Postal Code Format", country.postalCode?.format || "N/A"],
    // Flag & Symbols
    ["Flag Emoji", country.flag],
    ["Flag (PNG)", country.flags.png],
    ["Flag (SVG)", country.flags.svg],
    ["Flag Description", country.flags.alt || "N/A"],
    ["Coat of Arms (PNG)", country.coatOfArms.png || "N/A"],
    ["Coat of Arms (SVG)", country.coatOfArms.svg || "N/A"],
    // Maps
    ["Google Maps", country.maps.googleMaps],
    ["OpenStreetMaps", country.maps.openStreetMaps],
  ];

  const csvContent = rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
