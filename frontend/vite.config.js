import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Il backend non ha CORS: il dev server inoltra /api a Spring Boot.
const proxy = { '/api': 'http://localhost:8080' }

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy },
  preview: { proxy },
})
