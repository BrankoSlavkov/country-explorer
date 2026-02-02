import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { countryQueries } from "~/api/countries.queries";
import type { Country } from "~/api/countries.types";
import {
  BorderCountries,
  BorderCountriesSkeleton,
} from "~/components/border-countries";
import { CountryMapSection } from "~/components/country-map-section";
import { ErrorState } from "~/components/error-state";
import { InfoCard } from "~/components/info-card";
import { InfoItem } from "~/components/info-item";
import { formatStatistic } from "~/lib/format";

interface CountryDetailsProps {
  countryName: Country["name"]["common"];
}

export function CountryDetails({ countryName }: CountryDetailsProps) {
  const { data: country } = useSuspenseQuery(
    countryQueries.detail(countryName),
  );

  if (!country) {
    return (
      <ErrorState
        variant="not-found"
        message={`We couldn't find a country named "${countryName}".`}
      />
    );
  }

  const populationDensity = (country.population / country.area).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="rounded-xl backdrop-blur-md bg-black/50 border border-white/20 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 flex items-center justify-center p-8 bg-white/5">
            <img
              src={country.flags.svg}
              alt={country.flags.alt || `Flag of ${country.name.common}`}
              className="max-h-64 w-auto rounded shadow-2xl"
            />
          </div>

          <div className="flex-1 flex items-center justify-center p-8 border-t lg:border-t-0 lg:border-l border-white/10">
            <Suspense
              fallback={
                <div className="size-75 bg-white/10 rounded animate-pulse" />
              }
            >
              <CountryMapSection cca3={country.cca3} />
            </Suspense>
          </div>
        </div>

        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{country.flag}</span>
            <div>
              <h1 className="text-3xl font-bold">{country.name.common}</h1>
              <p className="text-white/60">{country.name.official}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoCard title="General Information" icon="🌐">
          <InfoItem
            label="Capital"
            value={country.capital?.join(", ") || "N/A"}
          />
          <InfoItem label="Region" value={country.region} />
          <InfoItem label="Subregion" value={country.subregion || "N/A"} />
          <InfoItem
            label="Independent"
            value={country.independent ? "Yes" : "No"}
          />
          <InfoItem label="UN Member" value={country.unMember ? "Yes" : "No"} />
        </InfoCard>

        <InfoCard title="Demographics" icon="👥">
          <InfoItem
            label="Population"
            value={formatStatistic(country.population)}
          />
          <InfoItem
            label="Area"
            value={`${formatStatistic(country.area)} km²`}
          />
          <InfoItem
            label="Population Density"
            value={`${populationDensity} people/km²`}
          />
          {country.demonyms?.eng && (
            <InfoItem label="Demonym" value={country.demonyms.eng.m} />
          )}
          {country.gini && Object.entries(country.gini).length > 0 && (
            <InfoItem
              label="Gini Index"
              value={Object.entries(country.gini)
                .map(([year, value]) => `${value} (${year})`)
                .join(", ")}
            />
          )}
        </InfoCard>

        <InfoCard title="Geography" icon="📍">
          <div className="flex items-center gap-4 mb-3">
            <div>
              <p className="text-white/50 text-xs">Coordinates</p>
              <p className="text-white/90">
                {country.latlng[0]}°, {country.latlng[1]}°
              </p>
            </div>
            <div>
              <p className="text-white/50 text-xs">Landlocked</p>
              <p className="text-white/90">
                {country.landlocked ? "Yes" : "No"}
              </p>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-white/50 text-xs mb-2">Continents</p>
            <div className="flex flex-wrap gap-2">
              {country.continents.map((continent) => (
                <span
                  key={continent}
                  className="px-3 py-1 bg-white/10 rounded-full text-sm"
                >
                  {continent}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <p className="text-white/50 text-xs mb-2">Timezones</p>
            <div className="flex flex-wrap gap-1">
              {country.timezones.map((tz) => (
                <span
                  key={tz}
                  className="px-2 py-0.5 bg-white/10 rounded text-xs"
                >
                  {tz}
                </span>
              ))}
            </div>
          </div>

          {country.maps.googleMaps && (
            <a
              href={country.maps.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm inline-block"
            >
              View on Google Maps →
            </a>
          )}
        </InfoCard>

        <InfoCard title="Languages & Currency" icon="🗣️">
          {country.languages && (
            <div className="mb-4">
              <p className="text-white/50 text-xs mb-2">Languages</p>
              <div className="flex flex-wrap gap-2">
                {Object.values(country.languages).map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1 bg-white/10 rounded-full text-sm"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {country.currencies && (
            <div className="mb-4">
              <p className="text-white/50 text-xs mb-2">Currencies</p>
              <div className="space-y-1">
                {Object.entries(country.currencies).map(([code, currency]) => (
                  <p key={code} className="text-white/90">
                    {currency.name} ({currency.symbol}) - {code}
                  </p>
                ))}
              </div>
            </div>
          )}

          {country.idd.root && (
            <div>
              <p className="text-white/50 text-xs mb-2">Calling Codes</p>
              <div className="flex flex-wrap gap-2">
                {country.idd.suffixes?.map((suffix) => (
                  <span
                    key={suffix}
                    className="px-3 py-1 bg-white/10 rounded-full text-sm"
                  >
                    {country.idd.root}
                    {suffix}
                  </span>
                )) || (
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
                    {country.idd.root}
                  </span>
                )}
              </div>
            </div>
          )}
        </InfoCard>

        <InfoCard title="Additional Info" icon="ℹ️">
          <InfoItem label="Country Code" value={country.cca3} />
          <InfoItem
            label="ISO Codes"
            value={`${country.cca2} / ${country.ccn3 || "N/A"}`}
          />
          {country.cioc && <InfoItem label="IOC Code" value={country.cioc} />}
          {country.fifa && <InfoItem label="FIFA Code" value={country.fifa} />}
          <InfoItem label="Driving Side" value={country.car.side} />
          <InfoItem label="Start of Week" value={country.startOfWeek} />
          {country.tld && country.tld.length > 0 && (
            <InfoItem label="TLD" value={country.tld.join(", ")} />
          )}
        </InfoCard>

        {country.coatOfArms.svg && (
          <InfoCard title="Coat of Arms" icon="🛡️">
            <div className="flex items-center justify-center h-full">
              <img
                src={country.coatOfArms.svg}
                alt={`Coat of Arms of ${country.name.common}`}
                className="max-h-40 w-auto"
              />
            </div>
          </InfoCard>
        )}
      </div>

      {country.borders && country.borders.length > 0 && (
        <Suspense fallback={<BorderCountriesSkeleton />}>
          <BorderCountries codes={country.borders} />
        </Suspense>
      )}
    </div>
  );
}
