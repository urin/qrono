<script setup>
import { useRoute } from "vitepress";
import { ref, watch, computed } from "vue";

const route = useRoute();
const hidden = ref(false);

watch(
  () => route.path,
  () => {
    hidden.value = false;
  },
);

const isComparison = computed(() => route.path.includes("/comparison"));

function toggle() {
  hidden.value = !hidden.value;
  document.documentElement.classList.toggle("sidebar-hidden", hidden.value);
}
</script>

<template>
  <button
    v-if="isComparison"
    @click.stop.prevent="toggle"
    class="sidebar-toggle-btn"
    :title="hidden ? 'Show sidebar' : 'Hide sidebar'"
  >
    <svg
      v-if="!hidden"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-opacity="0.4"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="1.5" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <polyline points="7 9 4.5 12 7 15" />
      <line x1="4.5" y1="12" x2="8.5" y2="12" />
    </svg>

    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-opacity="0.4"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="1.5" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <polyline points="11 9 13.5 12 11 15" />
      <line x1="13.5" y1="12" x2="9.5" y2="12" />
    </svg>
  </button>
</template>

<style>
.sidebar-toggle-btn {
  display: none;
  align-items: center;
  padding: 0 8px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  background: none;
  border: none;
}

@media (min-width: 960px) {
  .sidebar-toggle-btn {
    display: flex;
  }
}

.sidebar-toggle-btn:hover {
  color: var(--vp-c-text-1);
}

html.sidebar-hidden .VPSidebar {
  display: none !important;
}

html.sidebar-hidden .VPLocalNav {
  padding-left: 0 !important;
  left: 0 !important;
}

html.sidebar-hidden .VPContent.has-sidebar {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

html.sidebar-hidden .VPDoc.has-sidebar > .container {
  max-width: 100% !important;
  padding-left: 32px !important;
  padding-right: 32px !important;
}

html.sidebar-hidden .VPDoc.has-sidebar > .container > .content {
  max-width: 100% !important;
  margin: 0 !important;
}
</style>
