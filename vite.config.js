import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  base: "/admin/",
  build: {
    outDir: "dist",
  },
});
