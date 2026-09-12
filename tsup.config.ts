import { defineConfig } from "tsup";

// Keep the license notice in every published artifact, where the source
// headers are otherwise stripped by the compiler. The top-level `banner`
// option reaches esbuild only, so it covers .js and .mjs. Declaration files
// come from a separate rollup pass that reads `dts.banner`.
const LICENSE_BANNER = `/*!
 * VirtFusion - A client for the VirtFusion API.
 * Copyright (C) 2024-2026 Lazco Corporation (拉資科科技有限公司)
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version. This program comes with ABSOLUTELY NO WARRANTY.
 * See <https://www.gnu.org/licenses/> for details.
 */`;

export default defineConfig({
  entry: ["src/index.ts"],
  banner: { js: LICENSE_BANNER },
  format: ["cjs", "esm"], // Build for commonJS and ESmodules
  dts: { banner: LICENSE_BANNER }, // Generate declaration file (.d.ts)
  splitting: false,
  sourcemap: true,
  clean: true,
});
