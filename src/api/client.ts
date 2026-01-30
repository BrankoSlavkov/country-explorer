import ky from "ky";

export const countriesApi = ky.create({
  prefixUrl: "https://restcountries.com/v3.1",
});
