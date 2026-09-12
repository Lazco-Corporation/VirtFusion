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

import isEmpty from "lodash/isEmpty";
import isInteger from "lodash/isInteger";

import { CustomError } from "modules/customError";
import { isSshPublicKey } from "modules/isSshPublicKey";
import { HttpRequestMethods, sendRequest } from "../sendRequest";

export async function addSshKey(addOptions: AddOptions) {
  const { userId, name, publicKey } = addOptions;
  if (!isInteger(userId)) {
    throw new CustomError({
      errorMessage: "User ID must be an integer",
      errorObject: { userId },
    });
  }

  if (isEmpty(name.trim())) {
    throw new CustomError({
      errorMessage: "Name is required",
      errorObject: { name },
    });
  }

  if (!isSshPublicKey(publicKey)) {
    throw new CustomError({
      errorMessage: "Public key must be a valid SSH public key",
      errorObject: { publicKey },
    });
  }

  return await sendRequest<AddSshKeyResponse>(
    HttpRequestMethods.POST,
    ["ssh_keys"],
    {
      passToken: true,
      body: addOptions,
    },
  );
}

export type AddOptions = {
  userId: number; // ID of the user
  name: string; // Name for the SSH key
  publicKey: string; // SSH public key
};

export type AddSshKeyResponse = {
  data: {
    id: number;
    name: string;
    type: string;
    createdAt: string;
  };
};
