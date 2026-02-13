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
  - icon: 🚀
    title: Simple & Intuitive
    details: Easy-to-use API designed for common date-time operations without the complexity
  
  - icon: 🔒
    title: Immutable
    details: All operations return new instances, ensuring your data remains predictable and safe
  
  - icon: ⚡
    title: Lightweight
    details: All features packed into just 4kB. Pure JavaScript without dependencies. Minimal bundle size for optimal performance
  
  - icon: 🌍
    title: Unique DST Handling
    details: The only library with dedicated APIs for daylight saving time transitions — detect, inspect, and handle edge cases properly
  
  - icon: 🔧
    title: TypeScript Ready
    details: Full TypeScript definitions included for type-safe development

  - icon: 🎯
    title: Chainable API
    details: Fluent method chaining for expressive and readable date-time transformations
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

// Get current time
const now = qrono()

// Add 7 days
const nextWeek = now.plus({ day: 7 })

// Comparisons work naturally
if (now < nextWeek) {
  ...
}

// ISO 8601 format (UTC default)
now.toString()                        // 2026-02-08T21:28:12.214Z
qrono({ localtime: true }).toString() // 2026-02-08T17:28:12.214-04:00
```

## Learn More

- [Introduction](/introduction) - Design philosophy and getting started
- [API Reference](/api/) - Complete API documentation
