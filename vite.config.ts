import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  root: "src/review",
  publicDir: resolve(__dirname, "public"),
  resolve: {
    alias: {
      "@shared": resolve(__dirname, "src/shared"),
      "@content": resolve(__dirname, "src/content"),
    },
  },
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});
