/// <reference types="vitest" />

import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "./lib/index.ts"),
      name: "EnhanceStorage",
      fileName: "enhance-storage",
    },
  },
  plugins: [dts()],
  test: {
    environment: "jsdom",
  },
});
