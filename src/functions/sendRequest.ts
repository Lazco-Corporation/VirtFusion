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

import axios from "axios";
import { urlJoin } from "url-join-ts";

import { object } from "modules/object";
import { CustomError } from "modules/customError";
import { VirtFusionV1 } from "..";
import { isArray } from "lodash";

export async function sendRequest<ResponseType>(
  method: HttpRequestMethods,
  endpoint: string[],
  options: {
    passToken: boolean;
    query?: object;
    body?: object;
    timeout?: number;
  },
) {
  try {
    const { passToken, query, body, timeout } = options;

    const virtfusion = new VirtFusionV1();

    const response = await axios({
      method,
      url: urlJoin(String(virtfusion.getValue("baseUrl")), ...endpoint),
      data: body,
      params: query,
      timeout: timeout || 10 * 1000,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: passToken
          ? `Bearer ${virtfusion.getValue("token")}`
          : undefined,
      },
    });

    const responseData = response.data;

    if (isArray(responseData)) {
      return responseData as unknown as Promise<ResponseType>;
    }

    const data = responseData?.data;
    return {
      ...object.convertKeyToCamelCase(responseData),
      data,
    } as Promise<ResponseType>;
  } catch (error) {
    if (error?.response) {
      throw new CustomError(
        {
          errorMessage: error.response.data.msg,
          errorObject: error.response.data,
        },
        error.response.status,
      );
    }
    throw new CustomError({ errorMessage: error.message });
  }
}

export enum HttpRequestMethods {
  GET = "GET",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
  TRACE = "TRACE",
  PUT = "PUT",
  DELETE = "DELETE",
  POST = "POST",
  PATCH = "PATCH",
  CONNECT = "CONNECT",
}
