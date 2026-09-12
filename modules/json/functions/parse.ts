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

export function parse(
  jsonString: string,
  options: {
    useOriginal: { undefined?: boolean; NaN?: boolean };
  } = {
    useOriginal: {
      undefined: false,
      NaN: false,
    },
  },
): any {
  const useOriginalUndefined = options.useOriginal.undefined;
  const useOriginalNaN = options.useOriginal.NaN;

  return JSON.parse(jsonString, (_, value) => {
    if (!useOriginalUndefined && value === "__undefined__") {
      return undefined;
    }
    if (!useOriginalNaN && value === "__NaN__") {
      return Number.NaN;
    }
    if (useOriginalUndefined && value === "undefined") {
      return undefined;
    }
    if (useOriginalNaN && value === "NaN") {
      return Number.NaN;
    }
    return value;
  });
}
