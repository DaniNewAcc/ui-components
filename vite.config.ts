import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";
import peerDependencies from "./package.json";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), dts({ exclude: "**/*.test.tsx" })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./lib"),
      "@components": path.resolve(__dirname, "./lib/components/"),
      "@utils": path.resolve(__dirname, "./lib/utils/"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setupTests.ts",
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: "./lib/index.ts",
      name: "ui",
      fileName: (format) => `ui.${format}.js`,
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      external: Object.keys(peerDependencies),
      output: { globals: { react: "React", "react-dom": "ReactDOM" } },
    },
  },
});
