import { defineConfig } from "vitest/config";
import { mergeConfig } from "vite";

import viteConfig from "./vite.config";

const vitestConfig = defineConfig({
  test: {
    environment: "happy-dom",
    setupFiles: ["test-setup.ts"],
    bail: process.env.CI ? 1 : 0,
    coverage: {
      enabled: true,
      provider: "v8",
      include: [
        "src/lib/**",
        "src/hooks/**",
        "src/components/**",
        "src/contexts/**",
      ],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/routeTree.gen.ts",
        "src/main.tsx",
      ],
    },
  },
  resolve: {
    conditions: ["development", "browser"],
  },
});

export default mergeConfig(vitestConfig, viteConfig);
