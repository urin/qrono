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
    - theme: alt
      text: Comparison
      link: /comparison

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

// UTC-first
const now = qrono().toString() // '2027-01-23T12:34:56:789Z'
// DST overlap (occurs twice) of Europe/London
qrono.context({ localtime: true })
const t = '2019-10-27T01:30:00'
qrono(t) // 01:30 +00:00 Same as JavaScript's `Date`
qrono({ disambiguation: 'earlier' }, t) // 01:30 +00:00
qrono({ disambiguation: 'later' }, t)   // 01:30 +01:00
qrono({ disambiguation: 'reject' }, t)  // throws RangeError

now.plus(0, 1, 10) // +1 month, +10 days
now.startOfMonth()
now.isBetween(qrono('2024-01-01'), qrono('2024-12-31'))
const date = qrono.date('2024-06-15')
date.dayOfYear()   // 167
date.weekOfYear()  // 24
date.endOfMonth()  // 2024-06-30
```

## Learn More

- [Introduction](/introduction) - Design philosophy and getting started
- [API Reference](/api/) - Complete API documentation
