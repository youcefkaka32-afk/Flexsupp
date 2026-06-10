import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Footer.css'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="footer-band" id="footerSection">

      {/* ── Top grid: newsletter + 3 link columns ── */}
      <div className="footer-top">
        <div className="section-shell">
          <div className="footer-top-grid">

            {/* Newsletter col */}
            <div className="footer-nl-col">
              <Link to="/" className="footer-logo-link">
                <img src="/flexlgo.png" alt="FLEX SUPPS" className="footer-logo-img" />
              </Link>
              <h3 className="footer-nl-title font-display">{t('footer.newsletter.title')}</h3>
              <p className="footer-nl-desc">{t('footer.newsletter.desc')}</p>
              <form
                className="footer-nl-form"
                onSubmit={e => { e.preventDefault(); alert(t('footer.newsletter.thanks')); e.target.reset() }}
              >
                <input
                  type="email"
                  className="footer-nl-input"
                  placeholder="EMAIL"
                  required
                  aria-label="Email newsletter"
                />
                <button type="submit" className="footer-nl-btn font-display">
                  {t('footer.newsletter.btn')}
                </button>
              </form>
              <p className="footer-nl-note">Provide your email address to subscribe. For e.g. abc@xyz.com</p>
            </div>

            {/* Support */}
            <div className="footer-links-col">
              <h4 className="footer-col-title font-display">{t('footer.support')}</h4>
              <ul className="footer-links">
                <li><Link to="/shop">Shop All</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><a href="https://wa.me/213553628299" target="_blank" rel="noreferrer">WhatsApp Support</a></li>
                <li><a href="#">Returns & Exchanges</a></li>
              </ul>
            </div>

            {/* Inquire */}
            <div className="footer-links-col">
              <h4 className="footer-col-title font-display">INQUIRE</h4>
              <ul className="footer-links">
                <li><Link to="/shop">Whey Protein</Link></li>
                <li><Link to="/shop">Creatine</Link></li>
                <li><Link to="/shop">BCAA</Link></li>
                <li><Link to="/shop">Pre-Workout</Link></li>
                <li><Link to="/shop">Mass Gainers</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div className="footer-links-col">
              <h4 className="footer-col-title font-display">{t('footer.company')}</h4>
              <ul className="footer-links">
                <li><Link to="/about">About Us</Link></li>
                <li><a href="https://www.facebook.com/61573073240674" target="_blank" rel="noreferrer">Facebook</a></li>
                <li><a href="https://www.instagram.com/flex_supps_/" target="_blank" rel="noreferrer">Instagram</a></li>
                <li><a href="https://wa.me/213553628299" target="_blank" rel="noreferrer">WhatsApp</a></li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* ── Social row ── */}
      <div className="footer-social-row">
        <div className="section-shell">
          <div className="footer-social-inner">
            <div className="footer-socials">
              <a href="https://www.instagram.com/flex_supps_/" target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://www.facebook.com/61573073240674" target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              <a href="https://wa.me/213553628299" target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              </a>
            </div>
            <div className="footer-contact-right">
              <span className="footer-contact-item-small">📍 Chéraga, Alger, Algérie</span>
              <a href="tel:+213553628299" className="footer-contact-item-small hover-red">+213 553 62 82 99</a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom-bar">
        <div className="section-shell">
          <div className="footer-bottom-inner">
            <div className="footer-legal-block">
              <p>{t('footer.copyright')}</p>
              <p className="footer-disclaimer">
                These statements have not been evaluated by any official authority. Products are not intended to diagnose, treat, cure or prevent any disease. Always consult a qualified healthcare professional before starting any diet or supplement program.
              </p>
              <p className="footer-address">
                <strong>FLEX SUPPS</strong> — Chéraga, Alger, Algérie<br />
                For customer inquiries: <a href="https://wa.me/213553628299" target="_blank" rel="noreferrer" className="hover-red">WhatsApp +213 553 62 82 99</a>
              </p>
            </div>
            <div className="footer-badges-row">
              <span className="footer-badge font-display">💳 {t('footer.badges.cod')}</span>
              <span className="footer-badge font-display">🚚 {t('footer.badges.shipping')}</span>
              <span className="footer-badge font-display">🛡️ {t('footer.badges.authentic')}</span>
            </div>
          </div>
        </div>
      </div>

    </footer>
  )
}
