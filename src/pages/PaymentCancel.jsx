import { Link } from 'react-router-dom'
import '../styles/payment-pages.css'

export default function PaymentCancel() {
  return (
    <div className="pay-page pay-page--cancel">
      {/* Animated background orbs */}
      <div className="pay-page__orb pay-page__orb--1" />
      <div className="pay-page__orb pay-page__orb--2" />

      <div className="pay-card">
        {/* X animation */}
        <div className="pay-card__icon pay-card__icon--cancel">
          <svg viewBox="0 0 52 52" fill="none">
            <circle className="pay-icon__circle" cx="26" cy="26" r="25" stroke="#E31B23" strokeWidth="2" />
            <path className="pay-icon__x" d="M17 17l18 18M35 17L17 35" stroke="#E31B23" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        <h1 className="pay-card__title">Paiement annulé</h1>
        <p className="pay-card__subtitle">
          Votre paiement n'a pas abouti. Ne vous inquiétez pas — votre panier est toujours intact.
        </p>

        <div className="pay-card__order-box">
          <p className="pay-card__hint">
            Vous pouvez réessayer le paiement en ligne, ou choisir l'option <strong>paiement à la livraison</strong> si vous préférez.
          </p>
        </div>

        <div className="pay-card__actions">
          <Link to="/shop" className="pay-btn pay-btn--primary">
            Réessayer ma commande
          </Link>
          <a
            href="https://wa.me/213553628299"
            target="_blank"
            rel="noopener noreferrer"
            className="pay-btn pay-btn--whatsapp"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Commander via WhatsApp
          </a>
          <Link to="/" className="pay-btn pay-btn--ghost">
            Retour à l'accueil
          </Link>
        </div>

        <p className="pay-card__note">
          Besoin d'aide ?&nbsp;
          <a href="https://wa.me/213553628299" target="_blank" rel="noopener noreferrer">
            Contactez-nous
          </a>
        </p>
      </div>
    </div>
  )
}
