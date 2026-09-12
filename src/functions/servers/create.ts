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

import { HttpRequestMethods, sendRequest } from "../sendRequest";

export async function createServer(createOptions: CreateOptions) {
  return await sendRequest<any>(HttpRequestMethods.POST, ["servers"], {
    passToken: true,
    body: createOptions,
  });
}

export type CreateOptions = {
  packageId: number; // ID of the package
  userId: number; // ID of the user
  hypervisorId: number; // ID of the hypervisor group
  ipv4?: number; // Number of IPv4 addresses
  storage?: number; // Number of GB primary storage
  traffic?: number; // Number of GB traffic (0 = unlimited)
  memory?: number; // Number of MB memory
  cpuCores?: number; // Number of CPU cores
  networkSpeedInbound?: number; // Inbound network speed (kB/s)
  networkSpeedOutbound?: number; // Outbound network speed (kB/s)
  storageProfile?: number; // Storage profile ID
  networkProfile?: number; // Network profile ID
  firewallRulesets?: number[]; // Optional array of firewall rulesets (-1 to force no rulesets)
  hypervisorAssetGroups?: number[] | -1; // Optional array of hypervisor asset groups (-1 to force no groups)
  additionalStorage1Enable?: boolean; // Enable/disable additional storage 1
  additionalStorage2Enable?: boolean; // Enable/disable additional storage 2
  additionalStorage1Profile?: number; // Additional storage 1 profile ID
  additionalStorage2Profile?: number; // Additional storage 2 profile ID
  additionalStorage1Capacity?: number; // Number of GB additional storage 1 capacity
  additionalStorage2Capacity?: number; // Number of GB additional storage 2 capacity
};
