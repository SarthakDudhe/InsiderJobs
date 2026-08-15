import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'react-vendor', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'charts-vendor', test: /node_modules[\\/](recharts|d3-|victory-vendor|decimal.js|clsx)[\\/]/ },
            { name: 'ui-vendor', test: /node_modules[\\/](lucide-react|react-toastify|axios)[\\/]/ }
          ]
        }
      }
    }
  },
  server: {
    port: 5174,
  }
})
