import * as d3 from "d3";
import { X } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import type { CountryCard } from "~/api/countries.queries";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { formatStatistic } from "~/lib/format";

interface CountryCompareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  countries: CountryCard[];
  onRemoveCountry: (countryName: string) => void;
}

function formatLanguages(languages: CountryCard["languages"]): string {
  if (!languages) return "N/A";
  return Object.values(languages).join(", ");
}

function formatCurrencies(currencies: CountryCard["currencies"]): string {
  if (!currencies) return "N/A";
  return Object.values(currencies)
    .map((c) => `${c.name} (${c.symbol})`)
    .join(", ");
}

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b"];

export function CountryCompareModal({
  open,
  onOpenChange,
  countries,
  onRemoveCountry,
}: CountryCompareModalProps) {
  const populationChartRef = useRef<SVGSVGElement>(null);
  const areaChartRef = useRef<SVGSVGElement>(null);

  const populationData = useMemo(
    () =>
      countries
        .map((c, i) => ({
          name: c.name.common,
          value: c.population,
          color: COLORS[i],
        }))
        .sort((a, b) => b.value - a.value),
    [countries],
  );

  const areaData = useMemo(
    () =>
      countries
        .map((c, i) => ({
          name: c.name.common,
          value: c.area,
          color: COLORS[i],
        }))
        .sort((a, b) => b.value - a.value),
    [countries],
  );

  // Population Bar Chart
  useEffect(() => {
    if (!open || !populationChartRef.current || countries.length === 0) return;

    const svg = d3.select(populationChartRef.current);
    svg.selectAll("*").remove();

    const width = 500;
    const height = countries.length * 60 + 40;
    const margin = { top: 20, right: 120, bottom: 20, left: 150 };

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(populationData, (d) => d.value) || 0])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleBand()
      .domain(populationData.map((d) => d.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.2);

    // Bars
    svg
      .selectAll("rect")
      .data(populationData)
      .join("rect")
      .attr("x", margin.left)
      .attr("y", (d) => y(d.name) || 0)
      .attr("width", (d) => x(d.value) - margin.left)
      .attr("height", y.bandwidth())
      .attr("fill", (d) => d.color)
      .attr("rx", 4);

    // Country names
    svg
      .selectAll(".label-name")
      .data(populationData)
      .join("text")
      .attr("class", "label-name")
      .attr("x", margin.left - 10)
      .attr("y", (d) => (y(d.name) || 0) + y.bandwidth() / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#374151")
      .attr("font-weight", "600")
      .attr("font-size", "14px")
      .text((d) => d.name);

    // Values
    svg
      .selectAll(".label-value")
      .data(populationData)
      .join("text")
      .attr("class", "label-value")
      .attr("x", (d) => x(d.value) + 10)
      .attr("y", (d) => (y(d.name) || 0) + y.bandwidth() / 2)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#374151")
      .attr("font-weight", "600")
      .attr("font-size", "13px")
      .text((d) => formatStatistic(d.value));

    svg.attr("height", height);
  }, [open, populationData, countries.length]);

  // Area Bar Chart
  useEffect(() => {
    if (!open || !areaChartRef.current || countries.length === 0) return;

    const svg = d3.select(areaChartRef.current);
    svg.selectAll("*").remove();

    const width = 500;
    const height = countries.length * 60 + 40;
    const margin = { top: 20, right: 120, bottom: 20, left: 150 };

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(areaData, (d) => d.value) || 0])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleBand()
      .domain(areaData.map((d) => d.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.2);

    // Bars
    svg
      .selectAll("rect")
      .data(areaData)
      .join("rect")
      .attr("x", margin.left)
      .attr("y", (d) => y(d.name) || 0)
      .attr("width", (d) => x(d.value) - margin.left)
      .attr("height", y.bandwidth())
      .attr("fill", (d) => d.color)
      .attr("rx", 4);

    // Country names
    svg
      .selectAll(".label-name")
      .data(areaData)
      .join("text")
      .attr("class", "label-name")
      .attr("x", margin.left - 10)
      .attr("y", (d) => (y(d.name) || 0) + y.bandwidth() / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#374151")
      .attr("font-weight", "600")
      .attr("font-size", "14px")
      .text((d) => d.name);

    // Values
    svg
      .selectAll(".label-value")
      .data(areaData)
      .join("text")
      .attr("class", "label-value")
      .attr("x", (d) => x(d.value) + 10)
      .attr("y", (d) => (y(d.name) || 0) + y.bandwidth() / 2)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#374151")
      .attr("font-weight", "600")
      .attr("font-size", "13px")
      .text((d) => `${formatStatistic(d.value)} km²`);

    svg.attr("height", height);
  }, [open, areaData, countries.length]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[95vw] max-w-[1200px]"
        onClose={() => onOpenChange(false)}
      >
        <DialogHeader>
          <DialogTitle>Compare Countries ({countries.length})</DialogTitle>
        </DialogHeader>
        <DialogBody className="max-h-[80vh] overflow-y-auto">
          {/* Country Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {countries.map((country, i) => (
              <div
                key={country.name.common}
                className="relative bg-white border-2 rounded-lg p-4 shadow-sm"
                style={{ borderColor: COLORS[i] }}
              >
                <button
                  type="button"
                  onClick={() => onRemoveCountry(country.name.common)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{country.flag}</span>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {country.name.common}
                  </h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <div
                      className="font-medium text-xs uppercase tracking-wide mb-1"
                      style={{ color: COLORS[i] }}
                    >
                      Capital
                    </div>
                    <div className="text-gray-700">
                      {country.capital?.join(", ") ?? "N/A"}
                    </div>
                  </div>

                  <div>
                    <div
                      className="font-medium text-xs uppercase tracking-wide mb-1"
                      style={{ color: COLORS[i] }}
                    >
                      Population
                    </div>
                    <div className="text-gray-700 font-semibold">
                      {formatStatistic(country.population)}
                    </div>
                  </div>

                  <div>
                    <div
                      className="font-medium text-xs uppercase tracking-wide mb-1"
                      style={{ color: COLORS[i] }}
                    >
                      Area
                    </div>
                    <div className="text-gray-700 font-semibold">
                      {formatStatistic(country.area)} km²
                    </div>
                  </div>

                  <div>
                    <div
                      className="font-medium text-xs uppercase tracking-wide mb-1"
                      style={{ color: COLORS[i] }}
                    >
                      Region
                    </div>
                    <div className="text-gray-700">{country.region}</div>
                  </div>

                  <div>
                    <div
                      className="font-medium text-xs uppercase tracking-wide mb-1"
                      style={{ color: COLORS[i] }}
                    >
                      Languages
                    </div>
                    <div className="text-gray-700">
                      {formatLanguages(country.languages)}
                    </div>
                  </div>

                  <div>
                    <div
                      className="font-medium text-xs uppercase tracking-wide mb-1"
                      style={{ color: COLORS[i] }}
                    >
                      Currencies
                    </div>
                    <div className="text-gray-700 text-xs">
                      {formatCurrencies(country.currencies)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Population Comparison
              </h3>
              <div className="flex justify-center overflow-x-auto">
                <svg ref={populationChartRef} width="500" />
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Area Comparison
              </h3>
              <div className="flex justify-center overflow-x-auto">
                <svg ref={areaChartRef} width="500" />
              </div>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
