import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// ── Local dev proxy for Chargily API ──────────────────────────
// In production this is handled by Vercel serverless functions.
// Locally, this Vite middleware intercepts POST /api/chargily/checkout
// and calls Chargily directly, so you can test without `vercel dev`.
function chargilyDevProxy() {
  return {
    name: 'chargily-dev-proxy',
    configureServer(server) {
      server.middlewares.use('/api/chargily/checkout', async (req, res, next) => {
        if (req.method !== 'POST') { next(); return }

        const secretKey = process.env.CHARGILY_SECRET_KEY
        if (!secretKey) {
          res.writeHead(503, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({
            error: '⚠️  CHARGILY_SECRET_KEY not set in .env.local. Add it to test locally.'
          }))
          return
        }

        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', async () => {
          try {
            const { orderId } = JSON.parse(body)
            const siteUrl = process.env.SITE_URL || 'http://localhost:3000'

            // Call Chargily checkout API v2 directly
            const r = await fetch('https://pay.chargily.net/api/v2/checkouts', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                amount: 100,
                currency: 'dzd',
                success_url: `${siteUrl}/payment/success?order=${orderId}`,
                failure_url: `${siteUrl}/payment/cancel?order=${orderId}`,
                locale: 'fr',
                metadata: { orderId },
              }),
            })

            const data = await r.json()
            if (!r.ok) {
              res.writeHead(502, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: data?.message || 'Chargily API error' }))
              return
            }

            // Convert pay.chargily.dz -> pay.chargily.net if returned by API to bypass DNS timeouts
            let checkoutUrl = data.checkout_url || ''
            if (checkoutUrl.includes('pay.chargily.dz')) {
              checkoutUrl = checkoutUrl.replace('pay.chargily.dz', 'pay.chargily.net')
            }

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ checkout_url: checkoutUrl }))
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: err.message }))
          }
        })
      })
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Expose server-side env vars to the dev proxy plugin
  process.env.CHARGILY_SECRET_KEY = env.CHARGILY_SECRET_KEY || ''
  process.env.SITE_URL = env.SITE_URL || ''

  return {
    plugins: [react(), chargilyDevProxy()],
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
  }
})

