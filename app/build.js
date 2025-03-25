import { execSync } from "child_process";
import { rmSync } from "fs";

import { commonjs } from "@hyrious/esbuild-plugin-commonjs";
import importGlobPlugin from "@sirse-dev/esbuild-plugin-import-glob";
import { build } from "esbuild";

rmSync("dist", { recursive: true, force: true });

build({
  alias: {
    "~": "./src",
  },
  outfile: "dist/main/index.cjs",
  entryPoints: ["src/index.ts"],
  platform: "node",
  format: "cjs",
  external: ["electron"],
  target: "node12",
  allowOverwrite: true,
  bundle: true,
  logLevel: "info",
  minify: true,
  mangleCache: {},
  plugins: [commonjs(), importGlobPlugin.default()],
})
  .then(() =>
    execSync(`electron-builder ${process.platform === "win32" ? "--" + process.arch : process.platform === "darwin" ? "--mac" : "--linux --" + process.arch}`, {
      stdio: "inherit",
    }),
  )
  .catch(() => process.exit(1));
