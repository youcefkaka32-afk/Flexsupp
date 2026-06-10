import { createContext, useReducer, useState } from 'react'

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
  const [items, dispatch]       = useReducer(reducer, [], load)
  const [drawerOpen, setDrawer] = useState(false)
  const [checkoutOpen, setCheckout] = useState(false)

  const openDrawer   = () => setDrawer(true)
  const closeDrawer  = () => setDrawer(false)
  const openCheckout = () => { setDrawer(false); setCheckout(true) }
  const closeCheckout = () => setCheckout(false)

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items,
      dispatch,
      drawerOpen,
      checkoutOpen,
      openDrawer,
      closeDrawer,
      openCheckout,
      closeCheckout,
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  )
}
