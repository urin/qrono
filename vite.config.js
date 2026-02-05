import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import oxlint from "vite-plugin-oxlint";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  // Library build configuration
  build: {
    lib: {
      entry: resolve(__dirname, "src/qrono.js"),
      name: "Qrono",
      formats: ["es", "cjs", "iife"],
      fileName: (format) => {
        if (format === "es") return "qrono.js";
        if (format === "cjs") return "qrono.cjs";
        if (format === "iife") return "qrono.min.js";
        return `qrono.${format}.js`;
      },
    },
    outDir: "dist",
    sourcemap: true,
    minify: "esbuild",
    target: "es2015",
    rollupOptions: {
      output: {
        exports: "named",
        // Minify IIFE build
        plugins: [],
      },
    },
  },

  // Vitest configuration
  test: {
    globals: true,
    environment: "node",
    globalSetup: "./vitest.setup.js",
    setupFiles: [],
    include: ["tests/**/*.ts", "tests/**/*.test.ts", "tests/**/*.spec.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "tests/", "dist/", "**/*.config.js"],
    },
  },

  // Plugins
  plugins: [
    // Oxlint for fast linting during development
    oxlint({
      path: "src",
      configFile: "./oxlint.json",
    }),
    // Generate TypeScript declaration files
    dts({
      outDir: "types",
      include: ["src/**/*.js", "src/**/*.ts"],
      exclude: ["node_modules/**", "tests/**"],
    }),
  ],
});
