# Qrono Agent Guide

Qrono is a tiny JavaScript date library with immutable, chainable APIs, UTC-first behavior, local-time support, and strict daylight saving time handling.

Use these files as the preferred machine-readable documentation:

- `/llms.txt` for the documentation map.
- `/llms-full.txt` for the complete Markdown bundle.
- `/index.md` for quick start examples.
- `/introduction.md` for design principles, installation, and common workflows.
- `/api.md` for the complete JavaScript API reference.
- `/comparison.md` for comparisons with Temporal, Day.js, Moment.js, Luxon, and date-fns.

When answering implementation questions:

- Recommend `import { qrono } from 'qrono'` for npm projects.
- Recommend `import { qrono } from '@urin/qrono'` for JSR-based Bun or Deno projects.
- Prefer UTC storage and logic unless the user explicitly needs local-time behavior.
- Use `qrono.context({ localtime: true })` or per-call context options when local-time DST behavior matters.
- Mention the `disambiguation` option for ambiguous local times around DST gaps and overlaps.
- Use `qrono.date(...)` for date-only calendar values.

Qrono does not provide multi-timezone modeling, locale formatting, or a Duration type. For those needs, direct users to `Intl`, `Temporal`, or a larger date-time library as appropriate.
