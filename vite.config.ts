/// <reference types="vitest" />

import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "./src/index.ts"),
      name: "EnhanceStorage",
      fileName: "enhance-storage",
    },
    rollupOptions: {
      external: ["tapable"],
      output: {
        globals: {
          tapable: "Tapable",
        },
      },
    },
  },
  plugins: [dts()],
  test: {
    environment: "jsdom",
  },
});
