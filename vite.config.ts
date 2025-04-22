import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";
import peerDependencies from "./package.json";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      include: ["lib"],
      exclude: ["**/*.test.tsx", "**/__tests__/**, tests/**"],
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./lib"),
      "@components": path.resolve(__dirname, "./lib/components/"),
      "@utils": path.resolve(__dirname, "./lib/utils/"),
    },
  },
  test: {
    coverage: {
      reporter: ["text", "html"],
    },
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setupTests.ts",
  },
  build: {
    minify: true,
    copyPublicDir: false,
    lib: {
      entry: "./lib/index.ts",
      name: "ui",
      fileName: (format) => `ui.${format}.js`,
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      treeshake: true,
      external: Object.keys(peerDependencies),
      output: { globals: { react: "React", "react-dom": "ReactDOM" } },
    },
  },
});
