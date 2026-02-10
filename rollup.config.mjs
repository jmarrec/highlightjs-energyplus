import terser from "@rollup/plugin-terser";
import commonjs from "@rollup/plugin-commonjs";

const input = "src/languages/energyplus.js";

export default [
  // CommonJS (Node.js)
  {
    input,
    output: {
      file: "dist/energyplus.min.js",
      format: "cjs",
      exports: "auto",
    },
    plugins: [commonjs(), terser()],
  },
  // ES Module (modern bundlers)
  {
    input,
    output: {
      file: "dist/energyplus.es.min.js",
      format: "es",
    },
    plugins: [commonjs(), terser()],
  },
];
