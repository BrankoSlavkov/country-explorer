import { createFileRoute } from "@tanstack/react-router";
import { CountryCardList } from "~/components/country-card-list";

export const Route = createFileRoute("/")({
  component: function App() {
    return (
      <div
        className="min-h-screen p-8"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, #1a1a2e 0%, #0d0d1a 100%)",
        }}
      >
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Country Explorer
        </h1>
        <CountryCardList />
      </div>
    );
  },
});
