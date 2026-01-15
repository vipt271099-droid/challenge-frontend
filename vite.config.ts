import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Use "/" in dev, and "/challenge-frontend/" only for production builds (GitHub Pages)
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/challenge-frontend/" : "/",
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
}));
