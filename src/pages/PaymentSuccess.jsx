import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../lib/utils'
import '../styles/payment-pages.css'

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) { setLoading(false); return }
    supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()
      .then(({ data }) => {
        setOrder(data)
        setLoading(false)
      })
  }, [orderId])

  return (
    <div className="pay-page pay-page--success">
      {/* Animated background orbs */}
      <div className="pay-page__orb pay-page__orb--1" />
      <div className="pay-page__orb pay-page__orb--2" />

      <div className="pay-card">
        {/* Checkmark animation */}
        <div className="pay-card__icon pay-card__icon--success">
          <svg viewBox="0 0 52 52" fill="none">
            <circle className="pay-icon__circle" cx="26" cy="26" r="25" stroke="#22c55e" strokeWidth="2" />
            <path className="pay-icon__check" d="M14 27l8 8 16-16" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="pay-card__title">Paiement réussi !</h1>
        <p className="pay-card__subtitle">
          Merci pour votre commande. Nous l'avons bien reçue et nous la traiterons dans les plus brefs délais.
        </p>

        {!loading && order && (
          <div className="pay-card__order-box">
            <div className="pay-card__order-row">
              <span className="pay-card__order-label">Commande</span>
              <span className="pay-card__order-value pay-card__order-value--mono">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div className="pay-card__order-row">
              <span className="pay-card__order-label">Client</span>
              <span className="pay-card__order-value">{order.customer_name}</span>
            </div>
            <div className="pay-card__order-row">
              <span className="pay-card__order-label">Total payé</span>
              <span className="pay-card__order-value pay-card__order-value--highlight">
                {formatPrice(order.total_price, order.currency)}
              </span>
            </div>
            <div className="pay-card__order-row">
              <span className="pay-card__order-label">Statut</span>
              <span className="pay-card__badge pay-card__badge--paid">Payé ✓</span>
            </div>
          </div>
        )}

        {!loading && !order && orderId && (
          <div className="pay-card__order-box pay-card__order-box--muted">
            <p>Votre paiement a été enregistré. Vous recevrez une confirmation prochainement.</p>
          </div>
        )}

        <div className="pay-card__actions">
          <Link to="/shop" className="pay-btn pay-btn--primary">
            Continuer mes achats
          </Link>
          <Link to="/" className="pay-btn pay-btn--ghost">
            Retour à l'accueil
          </Link>
        </div>

        <p className="pay-card__note">
          Une question ? Contactez-nous sur&nbsp;
          <a href="https://wa.me/213553628299" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </p>
      </div>
    </div>
  )
}
