import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { CountryCardList } from "~/components/country-card-list";
import { searchParamsSchema } from "~/constants/filters";

export const Route = createFileRoute("/")({
  validateSearch: zodValidator(searchParamsSchema),
  component: function App() {
    return (
      <>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>
        <div
          className="min-h-screen py-8"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, #1a1a2e 0%, #0d0d1a 100%)",
          }}
        >
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white text-center px-8 flex items-center justify-center gap-3">
              <img
                src="/favicon.png"
                alt=""
                aria-hidden="true"
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              Country Explorer
            </h1>
          </header>
          <main id="main-content">
            <CountryCardList />
          </main>
        </div>
      </>
    );
  },
});
