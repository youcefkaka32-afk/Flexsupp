// api/chargily/checkout.js
// Vercel Serverless Function — server-side only
// ⚠️  The secret key NEVER reaches the browser.

import { ChargilyClient } from '@chargily/chargily-pay'
import { createClient } from '@supabase/supabase-js'

const ALLOWED_ORIGINS = [
  'https://flexsupps.dz',
  'https://www.flexsupps.dz',
  // add your Vercel preview domain if needed, e.g. 'https://flex-supps.vercel.app'
]

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  }
}

export default async function handler(req, res) {
  const origin = req.headers.origin || ''

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    Object.entries(corsHeaders(origin)).forEach(([k, v]) => res.setHeader(k, v))
    return res.status(204).end()
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Apply CORS headers
  Object.entries(corsHeaders(origin)).forEach(([k, v]) => res.setHeader(k, v))

  const { orderId } = req.body || {}
  if (!orderId || typeof orderId !== 'string' || !/^[0-9a-f-]{36}$/.test(orderId)) {
    return res.status(400).json({ error: 'Invalid orderId' })
  }

  // ── Validate env vars ──────────────────────────────────────
  const secretKey = process.env.CHARGILY_SECRET_KEY
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!secretKey || !supabaseUrl || !supabaseServiceKey) {
    console.error('[chargily/checkout] Missing environment variables')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  // ── Read order from Supabase (server-side amount recalculation) ──
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (orderError || !order) {
    console.error('[chargily/checkout] Order not found:', orderError)
    return res.status(404).json({ error: 'Order not found' })
  }

  // Recalculate total server-side to prevent client tampering
  const serverTotal = order.items.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  )

  if (serverTotal <= 0) {
    return res.status(400).json({ error: 'Invalid order total' })
  }

  // ── Create Chargily checkout session ──────────────────────
  const client = new ChargilyClient({
    api_key: secretKey,
    mode: 'live',
  })

  const siteUrl = process.env.SITE_URL || 'https://flexsupps.dz'

  try {
    const checkout = await client.createCheckout({
      amount: serverTotal,
      currency: 'dzd',
      success_url: `${siteUrl}/payment/success?order=${orderId}`,
      failure_url: `${siteUrl}/payment/cancel?order=${orderId}`,
      locale: 'fr',
      metadata: {
        orderId,
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
      },
    })

    // Store the Chargily checkout ID back into the order
    await supabase
      .from('orders')
      .update({
        chargily_checkout_id: checkout.id,
        status: 'payment_pending',
      })
      .eq('id', orderId)

    let checkoutUrl = checkout.checkout_url || ''
    if (checkoutUrl.includes('pay.chargily.dz')) {
      checkoutUrl = checkoutUrl.replace('pay.chargily.dz', 'pay.chargily.net')
    }

    return res.status(200).json({ checkout_url: checkoutUrl })
  } catch (err) {
    console.error('[chargily/checkout] Chargily API error:', err?.message || err)
    return res.status(502).json({ error: 'Payment gateway error. Please try again.' })
  }
}
