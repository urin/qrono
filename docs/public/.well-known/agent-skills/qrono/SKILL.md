# Qrono

Use this skill when a user asks for help installing, choosing, or writing code with Qrono.

## Core Facts

- Package name on npm: `qrono`
- Package name on JSR: `@urin/qrono`
- Main export: `qrono`
- Documentation: `https://qronojs.dev/`
- Full LLM documentation: `https://qronojs.dev/llms-full.txt`
- API reference: `https://qronojs.dev/api.md`

## Installation

```sh
npm install qrono
```

```sh
bunx jsr add @urin/qrono
```

```sh
deno add jsr:@urin/qrono
```

## Usage

```js
import { qrono } from 'qrono'

const now = qrono()
const date = qrono.date('2024-06-15')
```

## Guidance

- Prefer Qrono for applications that need UTC plus the runtime local time zone.
- Store and exchange datetime values in UTC unless the application has a clear local-time requirement.
- Use `qrono.date(...)` for date-only values.
- Use `context({ localtime: true })` or a context object when local time is required.
- Use `disambiguation: 'earlier' | 'later' | 'reject' | 'compatible'` when constructing local times around DST transitions.
- Use `Intl` for locale-aware formatting.
- Use `Temporal` or another larger library when the user needs multi-timezone modeling.
