import { createFileRoute } from "@tanstack/react-router";
import { useCountryDetails } from "../../hooks/use-country-details";

export const Route = createFileRoute("/demo/argentina")({
  component: function ArgentinaDemo() {
    const { data, isLoading, error } = useCountryDetails("argentina");

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl">Loading...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl text-red-500">Error: {error.message}</p>
        </div>
      );
    }

    const country = data?.[0];

    if (!country) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl">Country not found</p>
        </div>
      );
    }

    return (
      <div
        className="flex items-center justify-center min-h-screen p-4 text-white"
        style={{
          backgroundImage:
            "radial-gradient(50% 50% at 95% 5%, #75aadb 0%, #3b5998 70%, #1a1a2e 100%)",
        }}
      >
        <div className="w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={country.flags.svg}
              alt={country.flags.alt || `Flag of ${country.name.common}`}
              className="w-24 h-auto rounded shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold">{country.name.common}</h1>
              <p className="text-white/70">{country.name.official}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/10 border border-white/20 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">General Info</h2>
              <ul className="space-y-1 text-white/90">
                <li>
                  <span className="text-white/60">Capital:</span>{" "}
                  {country.capital?.join(", ")}
                </li>
                <li>
                  <span className="text-white/60">Region:</span>{" "}
                  {country.region}
                </li>
                <li>
                  <span className="text-white/60">Subregion:</span>{" "}
                  {country.subregion}
                </li>
                <li>
                  <span className="text-white/60">Population:</span>{" "}
                  {country.population.toLocaleString()}
                </li>
                <li>
                  <span className="text-white/60">Area:</span>{" "}
                  {country.area.toLocaleString()} km²
                </li>
              </ul>
            </div>

            {country.currencies && (
              <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Currencies</h2>
                <ul className="space-y-1 text-white/90">
                  {Object.entries(country.currencies).map(
                    ([code, currency]) => (
                      <li key={code}>
                        {currency.name} ({currency.symbol})
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}

            {country.languages && (
              <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Languages</h2>
                <p className="text-white/90">
                  {Object.values(country.languages).join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
});
