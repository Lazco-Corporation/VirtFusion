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

import camelCase from "lodash/camelCase";
import isArray from "lodash/isArray";
import isPlainObject from "lodash/isPlainObject";

export function convertKeyToCamelCase<T extends Record<string, any>>(
  data: unknown,
): T {
  const recursivelyConvertKeyToCamelCase = (value: any): any => {
    if (isArray(value)) {
      return value.map(recursivelyConvertKeyToCamelCase);
    } else if (isPlainObject(value)) {
      return Object.entries(value).reduce(
        (acc, [key, val]) => {
          acc[camelCase(key)] = recursivelyConvertKeyToCamelCase(val);
          return acc;
        },
        {} as Record<string, any>,
      );
    }
    return value;
  };

  return recursivelyConvertKeyToCamelCase(data) as T;
}
