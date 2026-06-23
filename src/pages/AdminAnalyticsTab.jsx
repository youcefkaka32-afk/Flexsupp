import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

// ── Helpers ──────────────────────────────────────────────────
function fmt(num) {
  if (num === null || num === undefined) return '0'
  return Number(num).toLocaleString('fr-DZ')
}

function fmtDA(num) {
  return fmt(num) + ' DA'
}

function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-DZ', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Build a map of {date_string: totalRevenue} for last N days
function buildDailyRevenue(orders, days = 30) {
  const map = {}
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    map[d.toISOString().slice(0, 10)] = 0
  }
  orders.forEach(o => {
    const day = (o.created_at || '').slice(0, 10)
    if (day in map) map[day] = (map[day] || 0) + Number(o.total_price || 0)
  })
  return Object.entries(map).map(([date, revenue]) => ({ date, revenue }))
}

// Build top products from orders.items JSONB
function buildTopProducts(orders) {
  const map = {}
  orders.forEach(o => {
    const items = Array.isArray(o.items) ? o.items : []
    items.forEach(item => {
      if (!item?.id) return
      if (!map[item.id]) map[item.id] = { id: item.id, name: item.name || item.id, brand: item.brand || '', revenue: 0, orders: 0, qty: 0 }
      map[item.id].revenue += (item.price || 0) * (item.quantity || 1)
      map[item.id].orders += 1
      map[item.id].qty += item.quantity || 1
    })
  })
  return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 7)
}

// ── Animated KPI Number ───────────────────────────────────────
function KpiNumber({ value, prefix = '', suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(0)
  const raf = useRef(null)
  useEffect(() => {
    const start = 0
    const end = Number(value) || 0
    const duration = 900
    const startTime = performance.now()
    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(start + (end - start) * eased))
      if (progress < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [value])
  return <span>{prefix}{fmt(display)}{suffix}</span>
}

// ── KPI Card ─────────────────────────────────────────────────
function KpiCard({ icon, label, value, sub, accent = 'red', prefix = '', suffix = '' }) {
  return (
    <div className={`an-kpi an-kpi--${accent}`}>
      <div className="an-kpi__icon">{icon}</div>
      <div className="an-kpi__body">
        <div className="an-kpi__val">
          <KpiNumber value={value} prefix={prefix} suffix={suffix} />
        </div>
        <div className="an-kpi__label">{label}</div>
        {sub && <div className="an-kpi__sub">{sub}</div>}
      </div>
    </div>
  )
}

// ── SVG Donut Chart ───────────────────────────────────────────
function DonutChart({ inStock, outStock }) {
  const total = inStock + outStock
  const pct = total > 0 ? Math.round((inStock / total) * 100) : 0
  const r = 54
  const circ = 2 * Math.PI * r
  const greenArc = total > 0 ? (inStock / total) * circ : 0
  const redArc   = total > 0 ? (outStock / total) * circ : 0

  return (
    <div className="an-donut">
      <svg viewBox="0 0 130 130" className="an-donut__svg">
        {/* Background track */}
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14"/>
        {/* Out of stock (red) — behind */}
        {outStock > 0 && (
          <circle cx="65" cy="65" r={r} fill="none"
            stroke="#ef4444" strokeWidth="14"
            strokeDasharray={`${redArc} ${circ - redArc}`}
            strokeDashoffset={-greenArc}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
          />
        )}
        {/* In stock (green) */}
        {inStock > 0 && (
          <circle cx="65" cy="65" r={r} fill="none"
            stroke="#22c55e" strokeWidth="14"
            strokeDasharray={`${greenArc} ${circ - greenArc}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
          />
        )}
        {/* Center label */}
        <text x="65" y="60" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800">{pct}%</text>
        <text x="65" y="78" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9.5" fontWeight="600" letterSpacing="0.06em">EN STOCK</text>
      </svg>
      <div className="an-donut__legend">
        <div className="an-donut__legend-item">
          <span className="an-donut__dot an-donut__dot--green"/>
          <span>{inStock} En stock</span>
        </div>
        <div className="an-donut__legend-item">
          <span className="an-donut__dot an-donut__dot--red"/>
          <span>{outStock} Épuisé{outStock > 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  )
}

// ── SVG Area / Line Chart (Revenue over time) ─────────────────
function RevenueLineChart({ data }) {
  const [tooltip, setTooltip] = useState(null)
  const svgRef = useRef(null)

  if (!data || data.length === 0) return <div className="an-chart-empty">Pas encore de données</div>

  const W = 560, H = 140, padL = 55, padR = 16, padT = 12, padB = 32
  const values = data.map(d => d.revenue)
  const maxV = Math.max(...values, 1)
  const minV = 0
  const xs = data.map((_, i) => padL + (i / (data.length - 1)) * (W - padL - padR))
  const ys = values.map(v => padT + (1 - (v - minV) / (maxV - minV)) * (H - padT - padB))

  const linePath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ')
  const areaPath = linePath + ` L${xs[xs.length - 1].toFixed(1)},${(H - padB).toFixed(1)} L${padL.toFixed(1)},${(H - padB).toFixed(1)} Z`

  // Y axis ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(p => ({
    y: padT + (1 - p) * (H - padT - padB),
    val: Math.round(minV + p * (maxV - minV)),
  }))

  // X axis labels (every ~7 days)
  const step = Math.ceil(data.length / 5)
  const xLabels = data.filter((_, i) => i % step === 0 || i === data.length - 1)
    .map((d, _, arr) => {
      const i = data.indexOf(d)
      return { x: xs[i], label: d.date.slice(5) } // MM-DD
    })

  function handleMouseMove(e) {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    const mx = (e.clientX - rect.left) * (W / rect.width)
    let closest = 0
    let minDist = Infinity
    xs.forEach((x, i) => {
      const dist = Math.abs(x - mx)
      if (dist < minDist) { minDist = dist; closest = i }
    })
    setTooltip({ x: xs[closest], y: ys[closest], date: data[closest].date, revenue: data[closest].revenue })
  }

  return (
    <div className="an-linechart-wrap" onMouseLeave={() => setTooltip(null)}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="an-linechart" onMouseMove={handleMouseMove}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d31f25" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="#d31f25" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#d31f25"/>
            <stop offset="100%" stopColor="#f59e0b"/>
          </linearGradient>
        </defs>

        {/* Y grid lines */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={padL} y1={t.y} x2={W - padR} y2={t.y} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            <text x={padL - 6} y={t.y + 3.5} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="8">
              {t.val >= 1000 ? `${Math.round(t.val / 1000)}k` : t.val}
            </text>
          </g>
        ))}

        {/* X axis labels */}
        {xLabels.map((l, i) => (
          <text key={i} x={l.x} y={H - padB + 14} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8">{l.label}</text>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#lineGrad)"/>

        {/* Line */}
        <path d={linePath} fill="none" stroke="url(#lineStroke)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Tooltip point */}
        {tooltip && (
          <>
            <line x1={tooltip.x} y1={padT} x2={tooltip.x} y2={H - padB} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 3"/>
            <circle cx={tooltip.x} cy={tooltip.y} r="5" fill="#d31f25" stroke="#fff" strokeWidth="2"/>
          </>
        )}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div className="an-chart-tooltip" style={{ left: `${(tooltip.x / W) * 100}%` }}>
          <div className="an-chart-tooltip__date">{tooltip.date}</div>
          <div className="an-chart-tooltip__val">{fmtDA(tooltip.revenue)}</div>
        </div>
      )}
    </div>
  )
}

// ── Horizontal Bar Chart (Category revenue) ───────────────────
function CategoryBarChart({ categories, products }) {
  const [hovered, setHovered] = useState(null)

  const catData = categories.map(cat => {
    const catProds = products.filter(p => p.category === cat.id)
    const totalValue = catProds.reduce((s, p) => s + Number(p.price || 0), 0)
    const inStock = catProds.filter(p => p.in_stock).length
    return { ...cat, totalValue, count: catProds.length, inStock }
  }).filter(c => c.count > 0).sort((a, b) => b.totalValue - a.totalValue)

  const max = Math.max(...catData.map(c => c.totalValue), 1)

  const palette = ['#d31f25', '#f59e0b', '#22c55e', '#60a5fa', '#a78bfa', '#f472b6', '#34d399']

  if (catData.length === 0) return <div className="an-chart-empty">Aucun produit dans les catégories</div>

  return (
    <div className="an-barlist">
      {catData.map((cat, i) => {
        const pct = (cat.totalValue / max) * 100
        const color = palette[i % palette.length]
        return (
          <div
            key={cat.id}
            className={`an-barlist__row${hovered === cat.id ? ' hovered' : ''}`}
            onMouseEnter={() => setHovered(cat.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="an-barlist__label">
              <span className="an-barlist__name">{cat.name}</span>
              <span className="an-barlist__count">{cat.count} produit{cat.count > 1 ? 's' : ''}</span>
            </div>
            <div className="an-barlist__track">
              <div
                className="an-barlist__fill"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
            <div className="an-barlist__val" style={{ color }}>{fmtDA(cat.totalValue)}</div>
          </div>
        )
      })}
    </div>
  )
}

// ── Order Status Badge ────────────────────────────────────────
const STATUS_MAP = {
  pending:   { label: 'En attente', cls: 'pending' },
  confirmed: { label: 'Confirmée',  cls: 'confirmed' },
  delivered: { label: 'Livrée',     cls: 'delivered' },
  cancelled: { label: 'Annulée',    cls: 'cancelled' },
}

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { label: status, cls: 'pending' }
  return <span className={`an-status an-status--${s.cls}`}>{s.label}</span>
}

// ── Order Status Selector ─────────────────────────────────────
function StatusSelect({ orderId, current, onUpdate }) {
  const [loading, setLoading] = useState(false)

  async function handleChange(e) {
    const newStatus = e.target.value
    setLoading(true)
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)
      if (!error) onUpdate(orderId, newStatus)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  return (
    <select
      className={`an-status-select an-status-select--${current}`}
      value={current}
      onChange={handleChange}
      disabled={loading}
    >
      <option value="pending">En attente</option>
      <option value="confirmed">Confirmée</option>
      <option value="delivered">Livrée</option>
      <option value="cancelled">Annulée</option>
    </select>
  )
}

// ── Main Analytics Tab ────────────────────────────────────────
export default function AnalyticsTab({ products, categories, brands }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeRange, setTimeRange] = useState(30) // days

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      if (err) throw err
      setOrders(data || [])
    } catch (e) {
      setError(e.message || 'Erreur lors du chargement des commandes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  function handleStatusUpdate(orderId, newStatus) {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
  }

  // ── Derived metrics ──────────────────────────────────────────
  const totalRevenue    = orders.reduce((s, o) => s + Number(o.total_price || 0), 0)
  const orderCount      = orders.length
  const avgBasket       = orderCount > 0 ? totalRevenue / orderCount : 0
  const inStockCount    = products.filter(p => p.in_stock).length
  const outStockCount   = products.filter(p => !p.in_stock).length
  const inStockPct      = products.length > 0 ? Math.round((inStockCount / products.length) * 100) : 0
  const promoCount      = products.filter(p => p.old_price != null).length
  const featuredCount   = products.filter(p => p.featured).length
  const newCount        = products.filter(p => p.show_in_new).length

  // Status breakdown
  const statusBreakdown = ['pending', 'confirmed', 'delivered', 'cancelled'].map(s => ({
    status: s, count: orders.filter(o => o.status === s).length,
  }))

  // Revenue over time
  const dailyRevenue = buildDailyRevenue(orders, timeRange)

  // Top products
  const topProducts = buildTopProducts(orders)
  const maxTopRev = topProducts.length > 0 ? topProducts[0].revenue : 1

  // Recent orders (last 10)
  const recentOrders = orders.slice(0, 10)

  // Pending orders count (badge)
  const pendingCount = orders.filter(o => o.status === 'pending').length

  if (loading) {
    return (
      <div className="an-loading">
        <div className="an-loading__spinner"/>
        <span>Chargement des analytiques...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="an-error">
        <span>⚠ {error}</span>
        <button className="admin-btn admin-btn--sm" onClick={fetchOrders}>Réessayer</button>
        {error.includes('does not exist') && (
          <p className="an-error__hint">
            La table <code>orders</code> n'existe pas encore. Exécutez d'abord le fichier <code>supabase/add-orders-table.sql</code> dans l'éditeur SQL de Supabase.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="an-page">

      {/* ── Header ── */}
      <div className="an-header">
        <div className="an-header__left">
          <h2 className="an-title">Analytiques & Insights</h2>
          <p className="an-subtitle">Données en direct depuis Supabase</p>
        </div>
        <button className="admin-btn admin-btn--sm" onClick={fetchOrders}>↻ Actualiser</button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="an-kpi-grid">
        <KpiCard
          icon="💰" label="Chiffre d'affaires" accent="red"
          value={totalRevenue} suffix=" DA"
          sub={`${orderCount} commande${orderCount !== 1 ? 's' : ''} au total`}
        />
        <KpiCard
          icon="📦" label="Commandes reçues" accent="blue"
          value={orderCount}
          sub={pendingCount > 0 ? `${pendingCount} en attente` : 'Aucune en attente'}
        />
        <KpiCard
          icon="🛒" label="Panier moyen" accent="gold"
          value={Math.round(avgBasket)} suffix=" DA"
          sub="Par commande"
        />
        <KpiCard
          icon="✅" label="Taux de stock" accent="green"
          value={inStockPct} suffix="%"
          sub={`${inStockCount} / ${products.length} produits`}
        />
        <KpiCard
          icon="🔥" label="En promotion" accent="orange"
          value={promoCount}
          sub={`${products.length > 0 ? Math.round((promoCount / products.length) * 100) : 0}% du catalogue`}
        />
        <KpiCard
          icon="⭐" label="En vedette + Nouveaux" accent="purple"
          value={featuredCount + newCount}
          sub={`${featuredCount} vedette · ${newCount} nouveaux`}
        />
      </div>

      {/* ── Revenue Over Time + Status Breakdown ── */}
      <div className="an-row">
        <div className="an-card an-card--wide">
          <div className="an-card__header">
            <h3 className="an-card__title">📈 Chiffre d'affaires</h3>
            <div className="an-range-btns">
              {[7, 14, 30].map(d => (
                <button
                  key={d}
                  className={`an-range-btn${timeRange === d ? ' active' : ''}`}
                  onClick={() => setTimeRange(d)}
                >{d}j</button>
              ))}
            </div>
          </div>
          <div className="an-card__body">
            {orders.length === 0 ? (
              <div className="an-chart-empty">
                <div className="an-chart-empty__icon">📊</div>
                <p>Les commandes s'afficheront ici dès que les clients passeront commande via WhatsApp.</p>
              </div>
            ) : (
              <RevenueLineChart data={buildDailyRevenue(orders, timeRange)} />
            )}
          </div>
        </div>

        <div className="an-card">
          <div className="an-card__header">
            <h3 className="an-card__title">🍩 Statut des commandes</h3>
          </div>
          <div className="an-card__body">
            {orders.length === 0 ? (
              <div className="an-chart-empty">
                <div className="an-chart-empty__icon">📋</div>
                <p>Aucune commande pour l'instant</p>
              </div>
            ) : (
              <div className="an-status-breakdown">
                {statusBreakdown.map(s => {
                  const pct = orderCount > 0 ? Math.round((s.count / orderCount) * 100) : 0
                  return (
                    <div key={s.status} className="an-status-row">
                      <StatusBadge status={s.status} />
                      <div className="an-status-row__track">
                        <div
                          className={`an-status-row__fill an-status-row__fill--${s.status}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="an-status-row__count">{s.count}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Category Revenue + Stock Donut ── */}
      <div className="an-row">
        <div className="an-card an-card--wide">
          <div className="an-card__header">
            <h3 className="an-card__title">📊 Valeur par catégorie</h3>
          </div>
          <div className="an-card__body">
            <CategoryBarChart categories={categories} products={products} />
          </div>
        </div>

        <div className="an-card">
          <div className="an-card__header">
            <h3 className="an-card__title">📦 Santé du stock</h3>
          </div>
          <div className="an-card__body an-card__body--center">
            <DonutChart inStock={inStockCount} outStock={outStockCount} />
          </div>
        </div>
      </div>

      {/* ── Top Products ── */}
      {topProducts.length > 0 && (
        <div className="an-card">
          <div className="an-card__header">
            <h3 className="an-card__title">🏆 Top produits (par revenus)</h3>
          </div>
          <div className="an-card__body">
            <div className="an-toplist">
              {topProducts.map((p, i) => (
                <div key={p.id} className="an-toplist__row">
                  <div className="an-toplist__rank">#{i + 1}</div>
                  <div className="an-toplist__info">
                    <div className="an-toplist__name">{p.name}</div>
                    <div className="an-toplist__meta">{p.brand} · {p.orders} commande{p.orders > 1 ? 's' : ''} · {p.qty} unité{p.qty > 1 ? 's' : ''}</div>
                  </div>
                  <div className="an-toplist__bar-wrap">
                    <div className="an-toplist__bar" style={{ width: `${(p.revenue / maxTopRev) * 100}%` }}/>
                  </div>
                  <div className="an-toplist__revenue">{fmtDA(p.revenue)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Recent Orders Table ── */}
      <div className="an-card">
        <div className="an-card__header">
          <h3 className="an-card__title">
            📋 Commandes récentes
            {pendingCount > 0 && <span className="an-badge">{pendingCount}</span>}
          </h3>
          <span className="an-card__sub">{orderCount} au total</span>
        </div>
        <div className="an-card__body an-card__body--flush">
          {recentOrders.length === 0 ? (
            <div className="an-chart-empty" style={{ padding: '2rem' }}>
              <div className="an-chart-empty__icon">🛒</div>
              <p>Les commandes passées via WhatsApp apparaîtront ici automatiquement.</p>
            </div>
          ) : (
            <div className="an-orders-wrap">
              <table className="an-orders-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Client</th>
                    <th>Wilaya</th>
                    <th>Articles</th>
                    <th>Total</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(o => {
                    const itemCount = Array.isArray(o.items) ? o.items.reduce((s, i) => s + (i.quantity || 1), 0) : 0
                    return (
                      <tr key={o.id}>
                        <td className="an-orders-table__date">{fmtDate(o.created_at)}</td>
                        <td>
                          <div className="an-orders-table__name">{o.customer_name}</div>
                          <div className="an-orders-table__phone">{o.customer_phone}</div>
                        </td>
                        <td className="an-orders-table__wilaya">{o.wilaya}<br/><span className="an-muted">{o.commune}</span></td>
                        <td className="an-orders-table__items">
                          <span className="an-items-badge">{itemCount} article{itemCount > 1 ? 's' : ''}</span>
                          {Array.isArray(o.items) && o.items.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="an-muted an-orders-table__item-name">{item.name}</div>
                          ))}
                          {Array.isArray(o.items) && o.items.length > 2 && (
                            <div className="an-muted">+{o.items.length - 2} autres</div>
                          )}
                        </td>
                        <td className="an-orders-table__total">{fmtDA(o.total_price)}</td>
                        <td>
                          <StatusSelect
                            orderId={o.id}
                            current={o.status || 'pending'}
                            onUpdate={handleStatusUpdate}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Catalogue Health ── */}
      <div className="an-card">
        <div className="an-card__header">
          <h3 className="an-card__title">🏪 Santé du catalogue</h3>
        </div>
        <div className="an-card__body">
          <div className="an-cat-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Catégorie</th>
                  <th>Produits</th>
                  <th>En stock</th>
                  <th>Prix moyen</th>
                  <th>Valeur totale</th>
                  <th>Taux stock</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => {
                  const catProds = products.filter(p => p.category === cat.id)
                  if (catProds.length === 0) return null
                  const inS = catProds.filter(p => p.in_stock).length
                  const avgP = catProds.reduce((s, p) => s + Number(p.price || 0), 0) / catProds.length
                  const totalV = catProds.reduce((s, p) => s + Number(p.price || 0), 0)
                  const stockPct = Math.round((inS / catProds.length) * 100)
                  return (
                    <tr key={cat.id}>
                      <td><strong style={{ color: '#fff' }}>{cat.name}</strong></td>
                      <td>{catProds.length}</td>
                      <td>
                        <span style={{ color: inS === catProds.length ? '#22c55e' : inS === 0 ? '#ef4444' : '#f59e0b' }}>
                          {inS} / {catProds.length}
                        </span>
                      </td>
                      <td>{fmtDA(Math.round(avgP))}</td>
                      <td style={{ color: '#d31f25', fontWeight: 700 }}>{fmtDA(totalV)}</td>
                      <td>
                        <div className="an-mini-bar">
                          <div className="an-mini-bar__fill" style={{ width: `${stockPct}%`, background: stockPct === 100 ? '#22c55e' : stockPct < 50 ? '#ef4444' : '#f59e0b' }}/>
                          <span>{stockPct}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}
