import { createContext, useReducer, useState, useMemo, useCallback } from 'react'

// ─────────────────────────────────────────────
// Types
// CartItem: { id, name, brand, price, currency, image, quantity }
// ─────────────────────────────────────────────

const STORAGE_KEY = 'flexsupps_cart'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(items) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch { /* quota/private */ }
}

// ── Reducer ──────────────────────────────────
function reducer(state, action) {
  let next

  switch (action.type) {
    case 'ADD': {
      const qty = action.product.quantity ?? 1
      const exists = state.find((i) => i.id === action.product.id)
      next = exists
        ? state.map((i) => i.id === action.product.id ? { ...i, quantity: i.quantity + qty } : i)
        : [...state, { ...action.product, quantity: qty }]
      break
    }
    case 'REMOVE':
      next = state.filter((i) => i.id !== action.id)
      break
    case 'INCREMENT':
      next = state.map((i) => i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i)
      break
    case 'DECREMENT':
      next = state
        .map((i) => i.id === action.id ? { ...i, quantity: i.quantity - 1 } : i)
        .filter((i) => i.quantity > 0)
      break
    case 'CLEAR':
      next = []
      break
    default:
      return state
  }

  save(next)
  return next
}

// ── Context ──────────────────────────────────
export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, dispatch]           = useReducer(reducer, [], load)
  const [drawerOpen, setDrawer]     = useState(false)
  const [checkoutOpen, setCheckout] = useState(false)
  // directItem: a single product bypassing the cart, set via openCheckoutWith()
  const [directItem, setDirectItem] = useState(null)

  const openDrawer    = useCallback(() => setDrawer(true), [])
  const closeDrawer   = useCallback(() => setDrawer(false), [])
  const openCheckout  = useCallback(() => { setDrawer(false); setCheckout(true) }, [])
  const closeCheckout = useCallback(() => { setCheckout(false); setDirectItem(null) }, [])

  // Direct buy: skip cart drawer, open checkout immediately with a specific product
  const openCheckoutWith = useCallback((product) => {
    setDirectItem(product)
    setDrawer(false)
    setCheckout(true)
  }, [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const value = useMemo(() => ({
    items,
    dispatch,
    drawerOpen,
    checkoutOpen,
    directItem,
    openDrawer,
    closeDrawer,
    openCheckout,
    closeCheckout,
    openCheckoutWith,
    totalItems,
    totalPrice,
  }), [items, dispatch, drawerOpen, checkoutOpen, directItem, openDrawer, closeDrawer, openCheckout, closeCheckout, openCheckoutWith, totalItems, totalPrice])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
