// api/chargily/webhook.js
// Vercel Serverless Function — server-side only
// Receives payment events from Chargily and verifies their HMAC signature.

import { verifySignature } from '@chargily/chargily-pay'
import { createClient } from '@supabase/supabase-js'

// Disable the default body parser so we can access the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
}

// Read raw request body as a Buffer
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secretKey = process.env.CHARGILY_SECRET_KEY
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!secretKey || !supabaseUrl || !supabaseServiceKey) {
    console.error('[chargily/webhook] Missing environment variables')
    return res.status(500).end()
  }

  // ── Read and verify signature ──────────────────────────────
  const rawBody = await getRawBody(req)
  const signature = req.headers['signature'] || ''

  if (!signature) {
    console.warn('[chargily/webhook] Missing signature header')
    return res.status(400).json({ error: 'Missing signature' })
  }

  let isValid = false
  try {
    isValid = verifySignature(rawBody, signature, secretKey)
  } catch (err) {
    console.error('[chargily/webhook] Signature verification error:', err)
    return res.status(403).json({ error: 'Signature verification failed' })
  }

  if (!isValid) {
    console.warn('[chargily/webhook] Invalid signature — rejecting request')
    return res.status(403).json({ error: 'Invalid signature' })
  }

  // ── Parse payload ──────────────────────────────────────────
  let event
  try {
    event = JSON.parse(rawBody.toString('utf8'))
  } catch {
    return res.status(400).json({ error: 'Invalid JSON payload' })
  }

  console.log('[chargily/webhook] Event received:', event.type)

  // ── Handle events ──────────────────────────────────────────
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  if (event.type === 'checkout.paid') {
    const checkout = event.data
    const orderId = checkout?.metadata?.orderId

    if (!orderId) {
      console.warn('[chargily/webhook] checkout.paid missing orderId in metadata')
      return res.status(200).end() // ACK anyway
    }

    const { error } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        chargily_checkout_id: checkout.id,
        payment_method: checkout.payment_method || null,
      })
      .eq('id', orderId)

    if (error) {
      console.error('[chargily/webhook] Supabase update error:', error)
      // Still return 200 to prevent Chargily from retrying unnecessarily
      // Log alert for manual review
    } else {
      console.log(`[chargily/webhook] Order ${orderId} marked as paid ✓`)
    }
  }

  if (event.type === 'checkout.failed') {
    const checkout = event.data
    const orderId = checkout?.metadata?.orderId

    if (orderId) {
      await supabase
        .from('orders')
        .update({ status: 'payment_failed' })
        .eq('id', orderId)

      console.log(`[chargily/webhook] Order ${orderId} marked as payment_failed`)
    }
  }

  // Always respond 200 to acknowledge receipt
  return res.status(200).json({ received: true })
}
