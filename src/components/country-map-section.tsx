import type { Country } from "~/api/countries.types";
import { CountryMap } from "~/components/country-map";
import { useCountryGeoJSON } from "~/hooks/use-country-geojson";

interface CountryMapSectionProps {
  cca3: Country["cca3"];
}

export function CountryMapSection({ cca3 }: CountryMapSectionProps) {
  const { data: geoJSON } = useCountryGeoJSON(cca3);

  if (!geoJSON) {
    return <div className="text-white/50">Map not available</div>;
  }

  return <CountryMap geoJSON={geoJSON} width={300} height={300} />;
}
