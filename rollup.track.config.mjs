import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";
import { loadEnv } from "vite";

const env = loadEnv("production", process.cwd());

export default {
  input: "src/scripts/track.js",
  output: {
    file: "dist/js/track.js",
    format: "iife",
  },
  plugins: [
    replace({
      __WEBSOCKET_API__: env.VITE_WEBSOCKET_API,
      delimiters: ["", ""],
      preventAssignment: true,
    }),
    terser({ compress: { evaluate: false } }),
  ],
};