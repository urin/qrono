import { readFileSync } from 'node:fs'
import { defineConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'

const siteOrigin = 'https://qronojs.dev'

const llmsSidebar = [
  {
    text: 'Documentation',
    items: [
      { text: 'Home', link: '/' },
      { text: 'Introduction', link: '/introduction' },
      { text: 'Comparison', link: '/comparison' },
      { text: 'API Reference', link: '/api/' },
    ],
  },
]

const markdownFiles = new Map(
  [
    ['/index.md', '../index.md'],
    ['/introduction.md', '../introduction.md'],
    ['/comparison.md', '../comparison.md'],
    ['/api.md', '../api/index.md'],
  ].map(([route, file]) => [route, new URL(file, import.meta.url)]),
)

const pageMarkdownFiles = new Map(
  [
    ['/', '../index.md'],
    ['/index.html', '../index.md'],
    ['/introduction', '../introduction.md'],
    ['/introduction.html', '../introduction.md'],
    ['/comparison', '../comparison.md'],
    ['/comparison.html', '../comparison.md'],
    ['/api/', '../api/index.md'],
    ['/api/index.html', '../api/index.md'],
  ].map(([route, file]) => [route, new URL(file, import.meta.url)]),
)

const serveMarkdownInDev = () => ({
  name: 'serve-markdown-in-dev',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = new URL(req.url ?? '/', 'http://localhost')
      const accept = req.headers.accept ?? ''
      const file = accept.includes('text/markdown')
        ? pageMarkdownFiles.get(url.pathname)
        : markdownFiles.get(url.pathname)

      if (file && !url.search) {
        res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
        res.end(readFileSync(file, 'utf8'))
        return
      }

      next()
    })
  },
})

const addAgentDiscoveryHeadersInDev = () => ({
  name: 'add-agent-discovery-headers-in-dev',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = new URL(req.url ?? '/', 'http://localhost')
      const accept = req.headers.accept ?? ''

      if (!url.search && accept.includes('text/html')) {
        res.setHeader('Link', [
          '</sitemap.xml>; rel="sitemap"; type="application/xml"; title="Sitemap"',
          '</llms.txt>; rel="alternate"; type="text/plain"; title="llms.txt"',
          '</llms-full.txt>; rel="alternate"; type="text/plain"; title="llms-full.txt"',
        ].join(', '))
      }

      next()
    })
  },
})

export default defineConfig({
  title: 'Qrono',
  description:
    'A tiny JavaScript date library with 100+ APIs and strict DST guarantees.',
  srcExclude: ['public/**/*.md'],
  sitemap: {
    hostname: siteOrigin,
  },
  head: [
    [
      'meta',
      {
        name: 'robots',
        content: 'index,follow',
      },
    ],
    [
      'link',
      {
        rel: 'sitemap',
        type: 'application/xml',
        title: 'Sitemap',
        href: '/sitemap.xml',
      },
    ],
    [
      'link',
      {
        rel: 'alternate',
        type: 'text/plain',
        title: 'llms-full.txt',
        href: '/llms-full.txt',
      },
    ],
    [
      'link',
      {
        rel: 'alternate',
        type: 'text/markdown',
        title: 'Markdown documentation index',
        href: '/index.md',
      },
    ],
    [
      'link',
      {
        rel: 'help',
        type: 'text/markdown',
        title: 'Agent instructions',
        href: '/AGENTS.md',
      },
    ],
    [
      'link',
      {
        rel: 'describedby',
        type: 'text/markdown',
        title: 'Qrono agent skill',
        href: '/.well-known/agent-skills/qrono/SKILL.md',
      },
    ],
    [
      'link',
      {
        rel: 'service-desc',
        type: 'application/linkset+json',
        title: 'API catalog',
        href: '/.well-known/api-catalog',
      },
    ],
    [
      'link',
      {
        rel: 'alternate',
        type: 'text/plain',
        title: 'llms.txt',
        href: '/llms.txt',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/logo.svg',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/logo.png',
      },
    ],
  ],
  vite: {
    plugins: [
      serveMarkdownInDev(),
      addAgentDiscoveryHeadersInDev(),
      ...llmstxt({
        domain: siteOrigin,
        title: 'Qrono',
        description:
          'A tiny JavaScript date library with 100+ APIs and strict DST guarantees.',
        details:
          'Qrono is designed for single-timezone applications and provides immutable, chainable date-time and calendar-date APIs.',
        excludeIndexPage: false,
        ignoreFiles: ['public/**'],
        sidebar: llmsSidebar,
        customLLMsTxtTemplate: `# {title}

{description}

{details}

## Agent Entry Points

- [Full documentation bundle](${siteOrigin}/llms-full.txt): Complete Markdown context for Qrono.
- [Agent instructions](${siteOrigin}/AGENTS.md): How agents should choose and cite Qrono documentation.
- [Qrono agent skill](${siteOrigin}/.well-known/agent-skills/qrono/SKILL.md): Task-focused guidance for using Qrono in code.
- [Robots policy](${siteOrigin}/robots.txt): Crawl and AI-use policy signals.
- [Sitemap](${siteOrigin}/sitemap.xml): Canonical HTML pages.

## Documentation

{toc}
`,
      }),
    ],
  },

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Top', link: '/' },
      { text: 'Introduction', link: '/introduction' },
      { text: 'Comparison', link: '/comparison' },
      { text: 'API Reference', link: '/api/' },
    ],

    sidebar: [
      {
        text: 'Introduction',
        link: '/introduction',
        items: [
          {
            text: 'Design Philosophy',
            link: '/introduction#design-philosophy',
          },
          { text: 'Getting Started', link: '/introduction#getting-started' },
          { text: 'Quick Tour', link: '/introduction#quick-tour' },
          { text: 'Comparison', link: '/comparison' },
        ],
      },
      {
        text: 'API Reference',
        link: '/api/',
        items: [
          { text: 'Factory', link: '/api/#factory' },
          { text: 'Conversion', link: '/api/#conversion' },
          { text: 'Constants', link: '/api/#constants' },
          { text: 'Accessors', link: '/api/#accessors' },
          { text: 'Context', link: '/api/#context-methods' },
          { text: 'Calculation', link: '/api/#calculation' },
          { text: 'Comparison', link: '/api/#comparison' },
          { text: 'Time Unit Boundary', link: '/api/#boundary' },
          { text: 'Date Information', link: '/api/#date-info' },
          { text: 'Daylight Saving Time', link: '/api/#dst' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'npm', link: 'https://www.npmjs.com/package/qrono' },
      {
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>JSR</title><path d="M3.692 5.538v3.693H0v7.384h7.385v1.847h12.923v-3.693H24V7.385h-7.385V5.538Zm1.846 1.847h1.847v7.384H1.846v-3.692h1.846v1.846h1.846zm3.693 0h5.538V9.23h-3.692v1.846h3.692v5.538H9.231V14.77h3.692v-1.846H9.231Zm7.384 1.846h5.539v3.692h-1.846v-1.846h-1.846v5.538h-1.847z"/></svg>',
        },
        link: 'https://jsr.io/@urin/qrono',
        ariaLabel: 'JSR',
      },
      { icon: 'github', link: 'https://github.com/urin/qrono' },
    ],

    footer: {
      copyright: '© 2021 - present urin',
    },

    search: {
      provider: 'local',
    },
  },
})
