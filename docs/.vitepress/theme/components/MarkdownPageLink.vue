<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { page } = useData()

const markdownLink = computed(() => {
  const relativePath = page.value.relativePath

  if (!relativePath?.endsWith('.md')) return undefined

  const pluginPath = relativePath.replace(/\/index\.md$/, '.md')

  return withBase(`/${pluginPath}`)
})

</script>

<template>
  <a
    v-if="markdownLink"
    class="MarkdownPageLink"
    :href="markdownLink"
    target="_self"
    aria-label="View this page as Markdown"
    title="View this page as Markdown"
  >
    <svg
      aria-hidden="true"
      class="MarkdownPageLinkIcon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M8 13h1.5l1.5 2 1.5-2H14v5" />
      <path d="M8 18v-5" />
      <path d="M16 13v5" />
      <path d="m18 16-2 2-2-2" />
    </svg>
  </a>
</template>
