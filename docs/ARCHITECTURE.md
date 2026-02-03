# Country Explorer Architecture

This document describes the technical architecture of Country Explorer, a React 19 application for exploring country data.

## Tech Stack

- **React 19** with TypeScript
- **TanStack Router** - File-based routing with type-safe URL search params
- **TanStack Query** - Server state management with caching
- **Tailwind CSS** - Utility-first styling
- **Vite** - Build tool with PWA support

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         REST Countries API                          │
│                    https://restcountries.com/v3.1                   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    TanStack Query Cache (5 min)                     │
│                     src/api/countries.queries.ts                    │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         useCountries() Hook                         │
│              Fetches data + memoizes filter options                 │
│                     src/hooks/use-countries.ts                      │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   FilteredCountriesProvider                         │
│     Single computation point: O(n) filter + O(n log n) sort         │
│            src/contexts/filtered-countries-context.tsx              │
└─────────────────────────────────────────────────────────────────────┘
                          │                   │
                          ▼                   ▼
                   ┌────────────┐      ┌─────────────────┐
                   │CountryGrid │      │CountryPagination│
                   │ (renders)  │      │  (reads count)  │
                   └────────────┘      └─────────────────┘
```

## State Management

The application uses a hybrid state management approach:

### 1. URL State (Primary)

**Location:** `src/routes/index.tsx`

All filter/sort/pagination parameters are stored in URL search params using TanStack Router's type-safe schema validation:

```typescript
const searchParamsSchema = z.object({
  search: z.string().optional(),
  page: z.number().int().positive().optional().catch(1),
  perPage: z.number().int().positive().optional().catch(20),
  sortBy: z.enum([...]).optional().catch(DEFAULT_SORT),
  population: z.enum(["all", "small", "medium", "large", "huge"]).optional(),
  continent: z.string().optional(),
  language: z.string().optional(),
});
```

Benefits:

- Shareable/bookmarkable URLs
- Browser history navigation
- Page refresh persistence

### 2. React Query Cache

**Location:** `src/integrations/tanstack-query/root-provider.tsx`

Server data is cached for 5 minutes with automatic revalidation:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});
```

### 3. Context State

**FilteredCountriesContext** (`src/contexts/filtered-countries-context.tsx`)

- Computes filtered/sorted/paginated results once per parameter change
- Shares results between CountryGrid and CountryPagination
- Prevents duplicate O(n) computations

**CompareContext** (`src/contexts/compare-context.tsx`)

- Manages country comparison feature (up to 4 countries)
- Session-only state (not persisted)

### 4. External Store (Favorites)

**Location:** `src/lib/favorites.ts`

Uses React 18+ `useSyncExternalStore` pattern for localStorage integration:

```typescript
class LocalStorageFavorites {
  #cachedRecord: FavoritesRecord;
  #listeners = new Set<() => void>();

  subscribe = (listener: () => void) => { ... };
  getSnapshot = (): FavoritesRecord => { ... };
}
```

Benefits:

- Cross-tab synchronization via storage events
- Persistence across sessions
- Clean separation from React state

## Performance Optimizations

### Filtering Architecture

The filtering logic is centralized in `FilteredCountriesProvider`:

```typescript
// Single memoized computation
const value = useMemo(() => {
  // O(n) filter
  const filtered = countries.filter(...);

  // O(n log n) sort with O(1) favorites lookup via Set
  const sorted = [...filtered].sort(...);

  // O(1) pagination
  const paginated = sorted.slice(startIndex, endIndex);

  return { filteredCountries, paginatedCountries, totalPages, totalCount };
}, [countries, search, sortBy, populationFilter, continent, language, favoritesSet, page, perPage]);
```

### Key Optimizations

1. **Single computation** - Filtering happens once, shared via context
2. **Set for favorites** - `favoritesSet` provides O(1) lookup during sort (called O(n log n) times)
3. **Map for population filters** - `POPULATION_FILTER_MAP` provides O(1) range lookup vs O(k) array find
4. **Pre-computed search term** - `search.toLowerCase()` called once, not per-country
5. **Early loop exit** - Language filter breaks on first match instead of scanning all
6. **Debounced search** - 500ms debounce on search input via `useSearchParam`

### Data Structures Used

| Structure                 | Purpose                             | Complexity   |
| ------------------------- | ----------------------------------- | ------------ |
| `Set<string>`             | Favorites lookup in sort comparator | O(1) vs O(n) |
| `Map<string, {min, max}>` | Population filter range lookup      | O(1) vs O(k) |

### Previous Issues (Resolved)

**Issue 1:** `useCountryFiltering` was called twice per render (in `CountryCardList` and `CountryPagination`), causing duplicate O(n) + O(n log n) operations. Fixed by centralizing in context.

**Issue 2:** Favorites lookup used function reference causing unnecessary recomputations. Fixed by using `Set` with stable reference.

## Component Structure

```
__root.tsx (Root Layout)
├── CompareProvider
├── Outlet
└── OfflineIndicator

index.tsx (Main Page)
├── Header
└── CountryCardList
    ├── FilteredCountriesProvider ← Context wraps children
    │   ├── Buttons (Favorites, Compare)
    │   ├── CountryFilters
    │   │   ├── Search Input (debounced)
    │   │   ├── ContinentFilter
    │   │   ├── PopulationFilter
    │   │   ├── LanguageFilter
    │   │   └── SortSelect
    │   ├── CountryGrid ← Consumes context
    │   │   └── CountryCard (x perPage)
    │   ├── CountryPagination ← Consumes context
    │   └── CountryCompareModal
```

## Key Files Reference

| File                                          | Purpose                    |
| --------------------------------------------- | -------------------------- |
| `src/api/countries.queries.ts`                | TanStack Query definitions |
| `src/api/countries.types.ts`                  | TypeScript interfaces      |
| `src/contexts/filtered-countries-context.tsx` | Centralized filtering      |
| `src/contexts/compare-context.tsx`            | Comparison state           |
| `src/hooks/use-countries.ts`                  | Data fetching hook         |
| `src/hooks/use-country-search-params.ts`      | URL param reader           |
| `src/hooks/use-favorites.ts`                  | Favorites integration      |
| `src/lib/favorites.ts`                        | LocalStorage store         |
| `src/components/country-card-list.tsx`        | Main orchestrator          |
| `src/components/country-pagination.tsx`       | Pagination UI              |

## Scalability Considerations

**Current approach** (195 countries):

- All countries fetched at once from API
- Client-side filtering with O(n) complexity
- Suitable for small datasets

**For larger datasets** (1000+ items):

- Consider server-side filtering/pagination
- Implement virtual scrolling
- Add search indices for faster lookups
- Consider WebWorkers for heavy computations
