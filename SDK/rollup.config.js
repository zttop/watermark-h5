import commonjs from "rollup-plugin-commonjs";
import rollupTypescript from "@rollup/plugin-typescript";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

const version = "1.0.0";
const esmPackage = {
  input: "src/index.ts", // 入口文件，必须
  plugins: [
    rollupTypescript(),
    commonjs({
      exclude: "node_modules",
    }),
    babel({
      exclude: "node_modules",
    }),
    terser(),
  ],
  output: {
    // 必须 (如果要输出多个，可以是一个数组)
    file: "lib/watermark-h5/index.js", // 出口文件，必须
    format: "esm", // 必须
    banner: "/* watermark version 🌹" + version + " */",
    footer: "/* up up up */",
    sourcemap: true,
  },
};
const umdPackage = {
  input: "src/index.ts", // 入口文件，必须
  plugins: [
    rollupTypescript(),
    commonjs({
      exclude: "node_modules",
    }),
    babel({
      exclude: "node_modules",
    }),
    terser(),
  ],
  output: {
    // 必须 (如果要输出多个，可以是一个数组)
    file: "lib/umd/watermark.min.js", // 出口文件，必须
    format: "umd", // 必须
    // banner: "/* watermark version 🌹" + version + " */",
    // footer: "/* up up up */",
    // sourcemap: true,
    name: "watermark",
    context: "window",
  },
};

const type = process.env.PACKAGETYPE;
const res = type === "umd" ? umdPackage : esmPackage;

export default res;
