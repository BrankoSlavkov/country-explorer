import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod/v4";
import { CountryCardList } from "~/components/country-card-list";
import { DEFAULT_POPULATION_FILTER } from "~/components/country-population-filter";
import { DEFAULT_SORT } from "~/components/country-sort";

const searchParamsSchema = z.object({
  search: z.string().optional(),
  page: z.number().int().positive().optional().catch(1),
  perPage: z.number().int().positive().optional().catch(20),
  sortBy: z
    .enum([
      "name-asc",
      "name-desc",
      "population-asc",
      "population-desc",
      "area-asc",
      "area-desc",
    ])
    .optional()
    .catch(DEFAULT_SORT),
  population: z
    .enum(["all", "small", "medium", "large", "huge"])
    .optional()
    .catch(DEFAULT_POPULATION_FILTER),
  continent: z.string().optional(),
  language: z.string().optional(),
});

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
                className="w-10 h-10"
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
