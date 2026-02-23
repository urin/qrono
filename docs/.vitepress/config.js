import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Qrono',
  description:
    'A 4kB JavaScript date library with 100+ APIs and strict DST guarantees.',
  head: [
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
