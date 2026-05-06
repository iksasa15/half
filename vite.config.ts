import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/thingspeak': {
        target: 'https://api.thingspeak.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/thingspeak/, ''),
      },
    },
  },
})
