import ky from "ky";

export const countriesApi = ky.create({
  prefixUrl: "https://restcountries.com/v3.1",
  timeout: 30000,
});

export const geojsonApi = ky.create({
  prefixUrl: "https://raw.githubusercontent.com/johan/world.geo.json/master",
});
