import DefaultTheme from 'vitepress/theme'
import './custom.css'
import Comparison from './components/Comparison.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('FourCompare', Comparison)
  },
}
