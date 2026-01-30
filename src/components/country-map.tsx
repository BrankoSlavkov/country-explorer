import * as d3 from "d3";
import type { Feature, MultiPolygon, Polygon } from "geojson";
import { useEffect, useRef } from "react";

interface CountryMapProps {
  geoJSON: Feature<Polygon | MultiPolygon>;
  width?: number;
  height?: number;
}

export function CountryMap({
  geoJSON,
  width = 400,
  height = 500,
}: CountryMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !geoJSON) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const featureCollection = {
      type: "FeatureCollection" as const,
      features: [geoJSON],
    };

    const projection = d3
      .geoMercator()
      .fitSize([width, height], featureCollection);

    const pathGenerator = d3.geoPath().projection(projection);

    svg
      .selectAll("path")
      .data(featureCollection.features)
      .enter()
      .append("path")
      .attr("d", pathGenerator as never)
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);
  }, [geoJSON, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ display: "block" }}
    />
  );
}
