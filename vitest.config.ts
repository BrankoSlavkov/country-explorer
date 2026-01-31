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
      include: ["src/lib/**"],
    },
  },
  resolve: {
    conditions: ["development", "browser"],
  },
});

export default mergeConfig(vitestConfig, viteConfig);
