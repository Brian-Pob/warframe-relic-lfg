import MillionLint from "@million/lint";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
const ReactCompilerConfig = {
  target: "19",
};
// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": `${process.cwd()}/src`,
    },
  },
  plugins: [
    MillionLint.vite({
      enabled: true,
    }),
    TanStackRouterVite({}),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
  ],
});
