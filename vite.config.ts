import MillionLint from "@million/lint";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
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
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
  ],
});
