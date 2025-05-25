import { fileURLToPath, URL } from 'node:url'
import VueRouter from 'unplugin-vue-router/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import {VueRouterAutoImports} from 'unplugin-vue-router'
import Components from 'unplugin-vue-components/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith('iconify-')
      }
    }
  }), vueDevTools(), VueRouter(),tailwindcss(),AutoImport({
    include: [
      /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      /\.vue$/,
      /\.vue\?vue/, // .vue
      /\.vue\.[tj]sx?\?vue/, // .vue (vue-loader with experimentalInlineMatchResource enabled)
      /\.md$/, // .md
    ],
    imports: [
      'vue',
      'vue-i18n',
      VueRouterAutoImports
    ],
    dts:true,
    viteOptimizeDeps:true
  }),Components({
    dts:true,
    include: [
      'src/**/*.vue'
    ]
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

})
