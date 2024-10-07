import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: "0.0.0.0",
    port: 5277,
    proxy: {
      '/winter': {
        target: 'http://localhost:9090',
        secure: true,
        changeOrigin: true,
      }
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler" // or 'modern'
      }
    }
  },
})

