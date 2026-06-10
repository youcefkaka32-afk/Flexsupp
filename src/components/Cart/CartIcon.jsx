import { useCart } from '../../hooks/useCart'
import './CartIcon.css'

export default function CartIcon() {
  const { totalItems, totalPrice, openDrawer } = useCart()

  const label = totalItems > 0
    ? `${totalPrice.toLocaleString('fr-DZ')} DA`
    : '0 DA'

  return (
    <button
      className="cart-icon-btn"
      onClick={openDrawer}
      aria-label={`Panier — ${totalItems} article${totalItems !== 1 ? 's' : ''}`}
      type="button"
    >
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M6 6h15l-1.5 8h-11z" />
          <path d="M6 6l-2-3H1" />
          <circle cx="10" cy="20" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="18" cy="20" r="1.5" fill="currentColor" stroke="none" />
        </svg>
        {totalItems > 0 && (
          <span className="cart-icon-btn__badge" aria-hidden="true">
            {totalItems > 9 ? '9+' : totalItems}
          </span>
        )}
      </span>
      <span>{label}</span>
    </button>
  )
}
