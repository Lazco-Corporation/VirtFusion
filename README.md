# VirtFusion
[![](https://img.shields.io/npm/v/@lazco/virtfusion.svg?color=blue)](https://www.npmjs.com/package/@lazco/virtfusion) [![](https://img.shields.io/npm/last-update/@lazco/virtfusion.svg)](https://github.com/Lazco-Corporation/VirtFusion/commits/main) [![](https://img.shields.io/npm/dm/@lazco/virtfusion?color=E4BD68)](https://www.npmjs.com/package/@lazco/virtfusion) [![](https://img.shields.io/npm/l/@lazco/virtfusion.svg?color=e3e3e3)](https://www.gnu.org/licenses/agpl-3.0.html)

A TypeScript client for interacting with the VirtFusion API. Built by [Lazco Corporation](https://github.com/Lazco-Corporation).

## Installation
Install the package using `pnpm`:
```bash
pnpm add @lazco/virtfusion
```

> [!IMPORTANT]
> This package was named `virtfusion` up to and including `0.7.2`. From `0.8.0` it is `@lazco/virtfusion`. The old name is deprecated and receives no further releases.

## Usage

### Initialization
Before making API calls, initialize the client with the required configuration:
```ts
import { VirtFusionV1 } from "@lazco/virtfusion";

const virtfusion = new VirtFusionV1();

const VIRTFUSION_API_HOST = "vf.example.com"; // Hostname of the VirtFusion API server
const VIRTFUSION_API_KEY = "****" // Your API key

virtfusion.init({
  host: VIRTFUSION_API_HOST,
  token: VIRTFUSION_API_KEY,
  useHttps: true,
});
```

> [!TIP]
> For detailed usage instructions, please refer to the [Wiki Page](https://github.com/Lazco-Corporation/VirtFusion/wiki).

## Roadmap
> [!NOTE]
> The project is under active development, with features being implemented incrementally. For detailed features support list, please refer to the [Roadmap Page](https://github.com/Lazco-Corporation/VirtFusion/wiki/Roadmap).

## License
Copyright (C) 2024-2026 Lazco Corporation (拉資科科技有限公司).

This project is licensed under the [GNU Affero General Public License v3.0 or later](https://www.gnu.org/licenses/agpl-3.0.html). See [`LICENSE`](./LICENSE) for the full text.

Releases up to and including `0.6.0` were published under GPL-3.0. Those releases remain available under GPL-3.0.

If you distribute a modified version, AGPL-3.0 section 5 requires you to keep the copyright notices intact and to state that you modified the work, with a date.