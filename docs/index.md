---
layout: home

hero:
  name: Qrono
  text: Small. Complete. Deterministic.
  tagline: A <strong>4kB</strong> JavaScript date library with <strong>100+</strong> APIs and strict DST guarantees.<br>Designed for single-timezone applications.
  actions:
    - theme: brand
      text: Get Started
      link: /introduction#getting-started
    - theme: alt
      text: API Reference
      link: /api/
    - theme: alt
      text: Design Philosophy
      link: /introduction#design-philosophy

features:
  - icon: 🔐
    title: Immutable, Intuitive and Chainable
    details: All operations return new instances for safe, predictable data and intuitive API.<br>Covers the majority of common use cases.

  - icon: 🔷
    title: TypeScript Ready
    details: Full TypeScript definitions included for type-safe development.<br>Designed to work seamlessly in both server-side and browser-side JavaScript environments.

  - icon: ⚡
    title: Minimal and Focused
    details: Pure JavaScript with zero dependencies.<br>Lightweight (<strong>4kB</strong>) with <strong>100+</strong> APIs through focused design.

  - icon: 🌍
    title: UTC-first with Local Time Support
    details: Supports UTC by default and the environment's local time zone.<br>Locale-agnostic design delegates localization to the ECMAScript Internationalization API.

  - icon: 🕐
    title: Strict DST Handling
    details: Unique DST-aware APIs that no other library provides.<br>Explicit handling of ambiguous daylight saving time transitions through dedicated APIs.

  - icon: ✅
    title: ISO 8601 Compliant
    details: Fully compliant with the ISO 8601 standard for reliable date-time exchange and interoperability.

---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #3b82f6 75%, #ec4899);
}
</style>

## Quick Start

::: code-group

```sh [npm]
npm install qrono
```

```sh [bun]
bunx jsr add @urin/qrono
```

```sh [deno]
deno add jsr:@urin/qrono
```

```html [browser]
<script src="https://unpkg.com/qrono/dist/qrono.min.js"></script>
```

:::

```javascript
import { qrono } from 'qrono'

// America/New_York — DST ends
qrono({ localtime: true }, '2026-03-29 01:30').plus({ hour: 1 }) // DST-safe
// UTC first
qrono('2026-08-31 12:34').toString() === '2026-08-31T12:34.000Z'
// Flexible APIs
qrono('2026-08-31 12:34') < qrono('2026-09-30 12:34')
const today = qrono.date('2021-08-31')
const tomorrow = qrono.date(today + 1)
tomorrow - today === 1
```

## Learn More

- [Introduction](/introduction) - Design philosophy and getting started
- [API Reference](/api/) - Complete API documentation
