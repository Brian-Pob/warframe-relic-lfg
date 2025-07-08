import MillionLint from "@million/lint";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
const ReactCompilerConfig = {
  target: "19",
};

const SERVER_PORT = Bun.env.SERVER_PORT || 5174;
const UI_PORT = Bun.env.UI_PORT || 5173;
// https://vite.dev/config/
export default defineConfig({
  server: {
    port: Number(UI_PORT),
    proxy: {
      "/api": {
        target: `http://localhost:${SERVER_PORT}`,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": `${process.cwd()}/src`,
    },
  },
  plugins: [
    MillionLint.vite({
      enabled: true,
    }),
    tanstackRouter({
      target: "react",
    }),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
  ],
});
