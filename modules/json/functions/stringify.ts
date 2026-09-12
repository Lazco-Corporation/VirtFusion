/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * Copyright (C) 2024-2026 Lazco Corporation (拉資科科技有限公司)
 *
 * This file is part of VirtFusion.
 *
 * VirtFusion is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * VirtFusion is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// biome-ignore lint/suspicious/noShadowRestrictedNames:
import isNaN from "lodash/isNaN";

export function stringify(
  obj: any,
  options: {
    preserve: { undefined?: boolean; NaN?: boolean };
    useOriginal: { undefined?: boolean; NaN?: boolean };
  } = {
    preserve: {
      undefined: false,
      NaN: false,
    },
    useOriginal: {
      undefined: false,
      NaN: false,
    },
  },
): string {
  const preserveUndefined = options.preserve.undefined;
  const preserveNaN = options.preserve.NaN;
  const useOriginalUndefined = options.useOriginal.undefined;
  const useOriginalNaN = options.useOriginal.NaN;

  return JSON.stringify(
    obj,
    (_, value) => {
      if (preserveUndefined && value === undefined) {
        return useOriginalUndefined ? "undefined" : "__undefined__";
      }
      if (preserveNaN && typeof value === "number" && isNaN(value)) {
        return useOriginalNaN ? "NaN" : "__NaN__";
      }
      return value;
    },
    2,
  );
}
