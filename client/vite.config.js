import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://registration-form-backend-e90a.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
