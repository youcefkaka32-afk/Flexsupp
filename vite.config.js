import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    watch: {
      // Exclude files with problematic names (quotes, special chars) from the watcher
      ignored: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif', '**/*.webp', '**/*.mov', '**/Shop_Supplements*.html'],
    },
  },
})
