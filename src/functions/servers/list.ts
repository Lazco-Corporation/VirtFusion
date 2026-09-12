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

import isInteger from "lodash/isInteger";

import { CustomError } from "modules/customError";
import { HttpRequestMethods, sendRequest } from "../sendRequest";

export async function listServer(
  options: ListOptions = {
    responseType: "simple",
    page: 1,
    limit: 20,
  },
) {
  const { responseType, page, limit, hypervisorId } = options;

  if (!isInteger(page) || page < 1) {
    throw new CustomError({
      errorMessage: "Page must be an integer, range: 1 ~ Infinity",
      errorObject: { page },
    });
  }

  if (!isInteger(limit) || limit < 1 || limit > 200) {
    throw new CustomError({
      errorMessage: "Results must be an integer, range: 1 ~ 200",
      errorObject: { limit },
    });
  }

  if (!isInteger(hypervisorId)) {
    throw new CustomError({
      errorMessage: "Hypervisor ID must be an integer",
      errorObject: { hypervisorId },
    });
  }

  return await sendRequest<any>(HttpRequestMethods.GET, ["servers"], {
    passToken: true,
    query: {
      type: responseType,
      page: page,
      results: limit,
      hypervisorId,
    },
  });
}

export type ListOptions = {
  responseType?: "full" | "simple";
  page?: number;
  limit?: number;
  hypervisorId?: number;
};
