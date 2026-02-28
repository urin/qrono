<script setup lang="ts">
const titles = ['Qrono', 'Day.js', 'Luxon', 'date-fns']
</script>

<template>
  <div class="compare-grid">
    <div v-for="(title, index) in titles" :key="index" class="compare-cell">
      <div class="header">
        <span class="title">{{ title }}</span>
      </div>
      <div class="content">
        <slot :name="['a', 'b', 'c', 'd'][index]" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.compare-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 1.5rem 0;
}

.compare-cell {
  min-width: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  font-size: 0.72rem;
  font-weight: 600;
  line-height: 1.2;
}

.title {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 8px 0 8px 0;
  background: var(--vp-c-divider);
}

.content {
  flex: 1;
}

.content :deep([class*='language-'] ) {
  height: 100%;
  margin: 0;
}

.content :deep([class*='language-'] pre) {
  height: 100%;
  padding: 4px 12px;
}

.content :deep([class*='language-'] pre code) {
  height: 100%;
  padding: 0 0 1em;
}

.content :deep([class*='language-'] button.copy),
.content :deep([class*='language-'] span.lang) {
  display: none;
}

@media (max-width: 768px) {
  .compare-grid {
    grid-template-columns: 1fr;
  }
}
</style>
