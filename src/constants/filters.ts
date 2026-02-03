import { z } from "zod/v4";
import { PAGINATION } from "./ui";

export const SORT = {
  NAME_ASC: "name-asc",
  NAME_DESC: "name-desc",
  POPULATION_ASC: "population-asc",
  POPULATION_DESC: "population-desc",
  AREA_ASC: "area-asc",
  AREA_DESC: "area-desc",
} as const;

export const SORT_VALUES = Object.values(SORT);

export type SortOption = (typeof SORT)[keyof typeof SORT];

export const DEFAULT_SORT: SortOption = SORT.NAME_ASC;

export const SORT_OPTIONS = [
  { value: SORT.NAME_ASC, label: "Name (A-Z)" },
  { value: SORT.NAME_DESC, label: "Name (Z-A)" },
  { value: SORT.POPULATION_ASC, label: "Population (Low to High)" },
  { value: SORT.POPULATION_DESC, label: "Population (High to Low)" },
  { value: SORT.AREA_ASC, label: "Area (Small to Large)" },
  { value: SORT.AREA_DESC, label: "Area (Large to Small)" },
] as const satisfies readonly { value: SortOption; label: string }[];

const POPULATION_SMALL_MAX = 1_000_000;
const POPULATION_MEDIUM_MAX = 10_000_000;
const POPULATION_LARGE_MAX = 50_000_000;

export const POPULATION = {
  ALL: "all",
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
  HUGE: "huge",
} as const;

export const POPULATION_FILTER_VALUES = Object.values(POPULATION);

export type PopulationFilter = (typeof POPULATION)[keyof typeof POPULATION];

export const DEFAULT_POPULATION_FILTER: PopulationFilter = POPULATION.ALL;

export const POPULATION_FILTERS = [
  { value: POPULATION.ALL, label: "All Populations" },
  {
    value: POPULATION.SMALL,
    label: "< 1M",
    min: 0,
    max: POPULATION_SMALL_MAX,
  },
  {
    value: POPULATION.MEDIUM,
    label: "1M - 10M",
    min: POPULATION_SMALL_MAX,
    max: POPULATION_MEDIUM_MAX,
  },
  {
    value: POPULATION.LARGE,
    label: "10M - 50M",
    min: POPULATION_MEDIUM_MAX,
    max: POPULATION_LARGE_MAX,
  },
  {
    value: POPULATION.HUGE,
    label: "> 50M",
    min: POPULATION_LARGE_MAX,
    max: Infinity,
  },
] as const;

export const searchParamsSchema = z.object({
  search: z.string().optional(),
  page: z.number().int().positive().optional().catch(PAGINATION.DEFAULT_PAGE),
  perPage: z
    .number()
    .int()
    .positive()
    .optional()
    .catch(PAGINATION.DEFAULT_PER_PAGE),
  sortBy: z.enum(SORT_VALUES).optional().catch(DEFAULT_SORT),
  population: z
    .enum(POPULATION_FILTER_VALUES)
    .optional()
    .catch(DEFAULT_POPULATION_FILTER),
  continent: z.string().optional(),
  language: z.string().optional(),
});
