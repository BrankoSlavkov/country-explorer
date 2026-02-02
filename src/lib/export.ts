import { saveAs } from "file-saver";
import type { Country } from "~/api/countries.types";

export type ExportFormat = "pdf" | "json" | "csv" | "png";

export function exportToJSON(country: Country, filename: string): void {
  const data = JSON.stringify(country, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  saveAs(blob, `${filename}.json`);
}

export function exportToCSV(country: Country, filename: string): void {
  const rows: [string, string][] = [
    ["Field", "Value"],
    ["Name", country.name.common],
    ["Official Name", country.name.official],
    ["Capital", country.capital?.join(", ") || "N/A"],
    ["Region", country.region],
    ["Subregion", country.subregion || "N/A"],
    ["Population", country.population.toString()],
    ["Area (km²)", country.area.toString()],
    [
      "Languages",
      country.languages ? Object.values(country.languages).join(", ") : "N/A",
    ],
    [
      "Currencies",
      country.currencies
        ? Object.entries(country.currencies)
            .map(([, c]) => `${c.name} (${c.symbol})`)
            .join(", ")
        : "N/A",
    ],
    ["Timezones", country.timezones.join(", ")],
    ["Continents", country.continents.join(", ")],
    ["Country Code", country.cca3],
    ["Independent", country.independent ? "Yes" : "No"],
    ["UN Member", country.unMember ? "Yes" : "No"],
    ["Landlocked", country.landlocked ? "Yes" : "No"],
    ["Driving Side", country.car.side],
    ["Start of Week", country.startOfWeek],
  ];

  const csvContent = rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  saveAs(blob, `${filename}.csv`);
}

export async function exportToPDF(
  country: Country,
  filename: string,
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();

  let yPos = 20;
  const lineHeight = 7;
  const pageHeight = 280;

  const checkPageBreak = (neededSpace: number) => {
    if (yPos + neededSpace > pageHeight) {
      doc.addPage();
      yPos = 20;
    }
  };

  // Title
  doc.setFontSize(24);
  doc.text(`${country.flag} ${country.name.common}`, 20, yPos);
  yPos += 10;

  // Official name
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(country.name.official, 20, yPos);
  yPos += 15;

  doc.setTextColor(0);

  const addSection = (title: string, items: [string, string][]) => {
    checkPageBreak(lineHeight * (items.length + 2));

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(title, 20, yPos);
    yPos += lineHeight;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    for (const [label, value] of items) {
      doc.text(`${label}: ${value}`, 25, yPos);
      yPos += lineHeight;
    }
    yPos += 5;
  };

  addSection("General Information", [
    ["Capital", country.capital?.join(", ") || "N/A"],
    ["Region", country.region],
    ["Subregion", country.subregion || "N/A"],
    ["Independent", country.independent ? "Yes" : "No"],
    ["UN Member", country.unMember ? "Yes" : "No"],
  ]);

  addSection("Demographics", [
    ["Population", new Intl.NumberFormat().format(country.population)],
    ["Area", `${new Intl.NumberFormat().format(country.area)} km²`],
    [
      "Population Density",
      `${(country.population / country.area).toFixed(2)} people/km²`,
    ],
  ]);

  addSection("Geography", [
    ["Coordinates", `${country.latlng[0]}°, ${country.latlng[1]}°`],
    ["Landlocked", country.landlocked ? "Yes" : "No"],
    ["Continents", country.continents.join(", ")],
    ["Timezones", country.timezones.join(", ")],
  ]);

  if (country.languages) {
    addSection("Languages", [
      ["Languages", Object.values(country.languages).join(", ")],
    ]);
  }

  if (country.currencies) {
    addSection(
      "Currency",
      Object.entries(country.currencies).map(([code, c]) => [
        code,
        `${c.name} (${c.symbol})`,
      ]),
    );
  }

  addSection("Additional Info", [
    ["Country Code (CCA3)", country.cca3],
    ["Country Code (CCA2)", country.cca2],
    ["Driving Side", country.car.side],
    ["Start of Week", country.startOfWeek],
  ]);

  doc.save(`${filename}.pdf`);
}

export async function exportToPNG(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const html2canvas = (await import("html2canvas")).default;
  const canvas = await html2canvas(element, {
    backgroundColor: "#0d0d1a",
    scale: 2,
    logging: false,
  });

  canvas.toBlob((blob) => {
    if (blob) {
      saveAs(blob, `${filename}.png`);
    }
  }, "image/png");
}
