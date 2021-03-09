import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Markdown, { Mode } from 'vite-plugin-markdown'
import markdownIt from './scripts/markdown'
import WindiCSS from 'vite-plugin-windicss'
import Pages from 'vite-plugin-pages'
import ViteComponents from 'vite-plugin-components'
import VueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}`,
      'vue-composable': 'vue-composable/dist/vue-composable.cjs.prod.js',
    },
  },

  plugins: [
    Vue(),
    VueJsx(),
    ViteComponents({
      dirs: ['src/components', 'src/default-theme', 'src/examples'],
    }),

    Pages({
      extensions: ['vue', 'md'],
    }),

    WindiCSS({
      safelist: 'prose prose-sm m-auto',
    }),

    // plugin({ mode: [Mode.HTML, Mode.TOC, Mode.VUE], markdownIt: markdownIt({ html: true }).use(markdownItPrism) }),
    Markdown({
      mode: [Mode.HTML, Mode.TOC, Mode.VUE],
      markdownIt,
    }),
  ],
})
