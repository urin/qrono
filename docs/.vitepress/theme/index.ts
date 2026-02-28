import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import './custom.css'
import Comparison from './components/Comparison.vue'
import ComparisonSidebarToggle from './components/ComparisonSidebarToggle.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('FourCompare', Comparison)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-before': () => h(ComparisonSidebarToggle),
    })
  }
}
