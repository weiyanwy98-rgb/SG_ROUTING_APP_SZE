import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',        // Allow access from Docker host (important!)
    port: 5173,             // Match your exposed Docker port
    watch: {
      usePolling: true,     // 👈 Fix: enable polling for Windows + Docker
      interval: 500,        // Optional: check every 500ms for file changes
    },
  },
})
