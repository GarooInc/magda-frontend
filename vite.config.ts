import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/analysis": {
        target: "https://magdalena-garoo.koyeb.app/", 
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
