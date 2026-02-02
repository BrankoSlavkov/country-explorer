# Country Explorer

A web application for viewing and analyzing country data from around the world.

## Requirements

- **Bun** >= 1.0.0 ([Install Bun](https://bun.sh/docs/installation))

## Getting Started

### Install dependencies

```bash
bun install
```

### Run development server

```bash
bun run dev
```

The app will be available at http://localhost:5173

### Build for production

```bash
bun run build
```

### Preview production build

```bash
bun run preview
```

## Available Scripts

| Script                | Description                |
| --------------------- | -------------------------- |
| `bun run dev`         | Start development server   |
| `bun run build`       | Build for production       |
| `bun run preview`     | Preview production build   |
| `bun run test`        | Run unit tests (Vitest)    |
| `bun run test:e2e`    | Run E2E tests (Playwright) |
| `bun run test:e2e:ui` | Run E2E tests with UI      |
| `bun run lint`        | Run linter (Biome)         |
| `bun run format`      | Format code (Biome)        |
| `bun run check`       | Check code (Biome)         |

## Features

### Core Features

- **Country Grid** - Browse countries with cards showing flag, name, population, and continent
- **Country Details** - Click any country to see full details including map, borders, currencies, languages
- **Search** - Filter countries by name in real-time
- **Filters** - Filter by continent, population range, and spoken language
- **Sorting** - Sort by name, population, or area (ascending/descending)
- **Pagination** - Navigate through countries with 20, 50, or 100 per page

### Advanced Features

- **Compare Countries** - Select up to 4 countries for side-by-side comparison with charts
- **Favorites** - Save favorite countries to localStorage
- **Export** - Download country data as CSV
- **Share** - Share country details via Web Share API
- **Offline Support** - PWA with service worker caching

## Tech Stack

| Category      | Technology          |
| ------------- | ------------------- |
| Framework     | React 19            |
| Language      | TypeScript 5.9      |
| Build Tool    | Vite 7              |
| Routing       | TanStack Router     |
| Data Fetching | TanStack Query      |
| Styling       | Tailwind CSS 4      |
| UI Components | Radix UI            |
| Charts        | D3.js               |
| HTTP Client   | ky                  |
| Testing       | Vitest + Playwright |
| Linting       | Biome               |

## Project Structure

```
src/
├── api/          # API client and query definitions
├── components/   # React components
├── contexts/     # React contexts (compare mode)
├── hooks/        # Custom hooks
├── lib/          # Utilities (favorites, export, formatting)
├── routes/       # TanStack Router file-based routes
└── integrations/ # Third-party integrations
```

## Offline Support (PWA)

This application is a Progressive Web App with offline caching:

- **Static assets** - Precached on install
- **REST Countries API** - StaleWhileRevalidate, cached 24 hours
- **GeoJSON map data** - CacheFirst, cached 30 days

### Testing offline mode

1. Build the app: `bun run build`
2. Serve the dist folder: `bunx serve dist`
3. Open in browser and visit some pages
4. Go offline (DevTools > Network > Offline)
5. Previously visited pages will still work

## Future Improvements

### User Experience

- **Dark/Light Theme Toggle** - User-selectable theme preference with system detection
- **Internationalization (i18n)** - Multi-language support for UI labels
- **Keyboard Shortcuts** - Navigate with keyboard (j/k for navigation, / for search, etc.)
- **Recent Searches** - History of recently viewed countries
- **Accessibility (a11y)** - Screen reader improvements, ARIA labels, focus management

### Features

- **Interactive World Map** - Browse countries by clicking on a world map
- **Country Visit Tracker** - Mark countries as "visited" with dates and trip notes
- **Travel Wishlist** - Separate list from favorites for planning future trips
- **Country Notes** - Add personal notes and memories to countries
- **Statistics Dashboard** - Aggregate stats (total population of favorites, countries visited by continent, etc.)
- **Country Quiz Game** - Gamification - guess flags, capitals, populations

### Filters & Data

- **Region/Subregion Filters** - More granular geographic filtering (e.g., Western Europe, Southeast Asia)
- **Currency Converter** - Real-time conversion between country currencies using exchange rate API
- **Time Zone Display** - Show current local time for each country
- **Data Export Options** - Export to JSON, PDF in addition to CSV

### Technical

#### Enhanced Offline Storage with IndexedDB

The current PWA implementation uses service worker caching which works well for ~250 countries. For more advanced offline scenarios, consider implementing IndexedDB:

**When to consider:**

- Adding user-generated content (notes, custom tags)
- Implementing offline-first sync capabilities
- Storing large datasets like historical statistics
- Needing complex offline queries

**Implementation:**

```bash
bun add idb
```

```typescript
// src/lib/offline-db.ts
import { openDB } from "idb";

const db = await openDB("country-explorer", 1, {
  upgrade(db) {
    db.createObjectStore("countries", { keyPath: "cca3" });
    db.createObjectStore("visits", { keyPath: "id", autoIncrement: true });
  },
});

export const cacheCountry = (country: Country) => db.put("countries", country);
export const getOfflineCountry = (cca3: string) => db.get("countries", cca3);
```

## API

This app uses the [REST Countries API](https://restcountries.com/) for country data.

## License

MIT
