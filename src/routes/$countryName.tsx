import { createFileRoute } from "@tanstack/react-router";
import { CountryDetailsPage } from "~/components/country-details-page";

export const Route = createFileRoute("/$countryName")({
  component: function CountryDetailsRoute() {
    const { countryName } = Route.useParams();

    return <CountryDetailsPage countryName={countryName} />;
  },
});
