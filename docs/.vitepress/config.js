import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Qrono",
  description: "Just right date time library",
  base: "/qrono/",
  head: [["link", { rel: "icon", href: "/qrono/favicon.ico" }]],

  themeConfig: {
    logo: "/logo.png",

    nav: [
      { text: "Top", link: "/" },
      { text: "Introduction", link: "/introduction" },
      { text: "API Reference", link: "/api/" },
    ],

    sidebar: [
      {
        text: "Guide",
        items: [{ text: "Introduction", link: "/introduction" }],
      },
      {
        text: "API Reference",
        link: "/api/",
        items: [
          { text: "Factory", link: "/api/#factory" },
          { text: "Static Methods", link: "/api/#static-methods" },
          { text: "Constants", link: "/api/#constants" },
          { text: "Getters / Setters", link: "/api/#getters-setters" },
          { text: "Context Methods", link: "/api/#context-methods" },
          { text: "Arithmetic", link: "/api/#arithmetic" },
          { text: "Comparison", link: "/api/#comparison" },
          { text: "Start Of", link: "/api/#start-of" },
          { text: "End Of", link: "/api/#end-of" },
          { text: "Date Information", link: "/api/#date-info" },
          { text: "DST Methods", link: "/api/#dst" },
          { text: "Output", link: "/api/#output" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/urin/qrono" }],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2021-present urin",
    },

    search: {
      provider: "local",
    },
  },
});
