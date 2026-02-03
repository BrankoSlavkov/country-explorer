import * as d3 from "d3";
import { X } from "lucide-react";
import { useMemo } from "react";
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

interface BarChartData {
  name: string;
  value: number;
  color: string;
}

interface BarChartProps {
  data: BarChartData[];
  width?: number;
  valueFormatter: (value: number) => string;
  unit?: string;
  ariaLabel: string;
}

function BarChart({
  data,
  width = 500,
  valueFormatter,
  unit = "",
  ariaLabel,
}: BarChartProps) {
  const margin = { top: 20, right: 120, bottom: 20, left: 150 };
  const height = data.length * 60 + 40;

  const xScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value) || 0])
        .range([margin.left, width - margin.right]),
    [data, width],
  );

  const yScale = useMemo(
    () =>
      d3
        .scaleBand()
        .domain(data.map((d) => d.name))
        .range([margin.top, height - margin.bottom])
        .padding(0.2),
    [data, height],
  );

  return (
    <svg width={width} height={height} role="img" aria-label={ariaLabel}>
      {data.map((item) => {
        const y = yScale(item.name) ?? 0;
        const barWidth = xScale(item.value) - margin.left;
        const bandwidth = yScale.bandwidth();

        return (
          <g key={item.name}>
            <rect
              x={margin.left}
              y={y}
              width={barWidth}
              height={bandwidth}
              fill={item.color}
              rx={4}
            />
            <text
              x={margin.left - 10}
              y={y + bandwidth / 2}
              textAnchor="end"
              dominantBaseline="middle"
              fill="#374151"
              fontWeight="600"
              fontSize="14px"
            >
              {item.name}
            </text>
            <text
              x={xScale(item.value) + 10}
              y={y + bandwidth / 2}
              textAnchor="start"
              dominantBaseline="middle"
              fill="#374151"
              fontWeight="600"
              fontSize="13px"
            >
              {valueFormatter(item.value)}
              {unit}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function CountryCompareModal({
  open,
  onOpenChange,
  countries,
  onRemoveCountry,
}: CountryCompareModalProps) {
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
                  aria-label={`Remove ${country.name.common} from comparison`}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <X aria-hidden="true" className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-4xl"
                    role="img"
                    aria-label={`Flag of ${country.name.common}`}
                  >
                    {country.flag}
                  </span>
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
            <figure className="bg-gray-50 p-6 rounded-lg">
              <figcaption className="text-lg font-semibold mb-4 text-gray-900">
                Population Comparison
              </figcaption>
              <div className="flex justify-center overflow-x-auto">
                <BarChart
                  data={populationData}
                  valueFormatter={formatStatistic}
                  ariaLabel={`Bar chart comparing population: ${populationData.map((d) => `${d.name}: ${formatStatistic(d.value)}`).join(", ")}`}
                />
              </div>
            </figure>

            <figure className="bg-gray-50 p-6 rounded-lg">
              <figcaption className="text-lg font-semibold mb-4 text-gray-900">
                Area Comparison
              </figcaption>
              <div className="flex justify-center overflow-x-auto">
                <BarChart
                  data={areaData}
                  valueFormatter={formatStatistic}
                  unit=" km²"
                  ariaLabel={`Bar chart comparing area: ${areaData.map((d) => `${d.name}: ${formatStatistic(d.value)} km²`).join(", ")}`}
                />
              </div>
            </figure>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
