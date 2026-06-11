import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    watch: {
      ignored: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif', '**/*.webp', '**/*.mov', '**/Shop_Supplements*.html'],
    },
  },
  build: {
    // Raise warning threshold — chunks are intentionally split
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Three.js in its own chunk (~600KB) — only loaded by Hero
          if (id.includes('node_modules/three')) return 'three'
          // Framer Motion in its own chunk
          if (id.includes('node_modules/framer-motion')) return 'framer-motion'
          // GSAP in its own chunk
          if (id.includes('node_modules/gsap')) return 'gsap'
          // Supabase in its own chunk
          if (id.includes('node_modules/@supabase')) return 'supabase'
          // i18n in its own chunk
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) return 'i18n'
          // React core
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) return 'react-vendor'
        },
      },
    },
  },
})
