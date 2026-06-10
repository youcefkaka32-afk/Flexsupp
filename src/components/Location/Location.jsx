import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from 'react-i18next'
import './Location.css'

gsap.registerPlugin(ScrollTrigger)

export default function Location() {
  const sectionRef = useRef(null)
  const { t } = useTranslation()

  useEffect(() => {
    const sec = sectionRef.current
    if (!sec) return
    gsap.fromTo(
      sec.querySelectorAll('.contact-left__eyebrow, .contact-left__title, .contact-left__desc, .contact-left__socials'),
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: sec, start: 'top 80%', once: true } }
    )
    gsap.fromTo(
      sec.querySelector('.contact-card'),
      { opacity: 0, scale: 0.95, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sec, start: 'top 80%', once: true } }
    )
  }, [])

  return (
    <section className="contact-sports-section" id="contactSection" ref={sectionRef}>
      <div className="contact-sports-bg" style={{ backgroundImage: "url('/gym_bg.svg')" }} />
      <div className="contact-sports-overlay" />
      <div className="section-shell">
        <div className="contact-layout-grid">
          <div className="contact-left-col">
            <span className="contact-left__eyebrow font-display text-red">{t('contact.eyebrow')}</span>
            <h2 className="contact-left__title font-display">{t('contact.title')}</h2>
            <p className="contact-left__desc">{t('contact.desc')}</p>
            <div className="contact-left__socials">
              <a href="https://www.facebook.com/61573073240674" target="_blank" rel="noopener noreferrer" className="social-icon-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              <a href="https://www.instagram.com/flex_supps_/" target="_blank" rel="noopener noreferrer" className="social-icon-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://wa.me/213553628299" target="_blank" rel="noopener noreferrer" className="social-icon-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              </a>
            </div>
            <div className="contact-left__address font-display">
              <span className="address-lbl">{t('contact.address')}</span>
              <p className="address-val">CHÉRAGA, ALGER, ALGÉRIE</p>
              <a href="https://maps.google.com/maps?q=QW6F%2BXW%2C%20Ch%C3%A9raga&t=m&z=16&output=embed" target="_blank" rel="noopener noreferrer" className="map-link hover-red">
                {t('contact.mapLink')}
              </a>
            </div>
          </div>

          <div className="contact-right-col">
            <div className="contact-card">
              <form onSubmit={(e) => { e.preventDefault(); alert(t('contact.successMsg')); e.target.reset() }}>
                <div className="form-group">
                  <label htmlFor="contact-name" className="form-label font-display">{t('contact.nameLabel')}</label>
                  <input type="text" id="contact-name" className="form-input" placeholder={t('contact.namePlaceholder')} required />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email" className="form-label font-display">{t('contact.emailLabel')}</label>
                  <input type="email" id="contact-email" className="form-input" placeholder={t('contact.emailPlaceholder')} required />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-msg" className="form-label font-display">{t('contact.msgLabel')}</label>
                  <textarea id="contact-msg" className="form-input text-area" rows="4" placeholder={t('contact.msgPlaceholder')} required />
                </div>
                <button type="submit" className="btn primary submit-form-btn font-display">{t('contact.submit')}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

gsap.registerPlugin(ScrollTrigger)

export default function Location() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const sec = sectionRef.current
    if (!sec) return

    gsap.fromTo(
      sec.querySelectorAll('.contact-left__eyebrow, .contact-left__title, .contact-left__desc, .contact-left__socials'),
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: sec, start: 'top 80%', once: true } }
    )

    gsap.fromTo(
      sec.querySelector('.contact-card'),
      { opacity: 0, scale: 0.95, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sec, start: 'top 80%', once: true } }
    )
  }, [])

  return (
    <section className="contact-sports-section" id="contactSection" ref={sectionRef}>
      {/* Grayscale gym background image */}
      <div className="contact-sports-bg" style={{ backgroundImage: "url('/gym_bg.svg')" }} />
      <div className="contact-sports-overlay" />

      <div className="section-shell">
        <div className="contact-layout-grid">
          
          {/* Left Column: Info */}
          <div className="contact-left-col">
            <span className="contact-left__eyebrow font-display text-red">CONTACT</span>
            <h2 className="contact-left__title font-display">GET IN TOUCH</h2>
            <p className="contact-left__desc">
              Une question sur nos formules ? Besoin d'un conseil personnalisé ou d'une demande de partenariat ? Contactez notre équipe d'experts directement via ce formulaire ou rejoignez-nous sur nos réseaux. Votre satisfaction est notre seule priorité.
            </p>

            {/* Social Icons matching design image */}
            <div className="contact-left__socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.163c-.272-1.022-1.074-1.826-2.099-2.099C19.56 3.5 12 3.5 12 3.5s-7.56 0-9.399.564c-1.025.273-1.827 1.077-2.1 2.099C0 8.002 0 12 0 12s0 3.998.564 5.837c.273 1.022 1.075 1.825 2.1 2.098C4.44 20.5 12 20.5 12 20.5s7.56 0 9.399-.564c1.025-.273 1.827-1.076 2.1-2.098C24 15.998 24 12 24 12s0-3.998-.564-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
            
            {/* Embedded Local Address Meta */}
            <div className="contact-left__address font-display">
              <span className="address-lbl">BOUTIQUE PHYSIQUE:</span>
              <p className="address-val">CHÉRAGA, ALGER, ALGÉRIE</p>
              <a href="https://maps.google.com/maps?q=QW6F%2BXW%2C%20Ch%C3%A9raga&t=m&z=16&output=embed" target="_blank" rel="noopener noreferrer" className="map-link hover-red">
                → VOIR LA CARTE SUR GOOGLE MAPS
              </a>
            </div>
          </div>

          {/* Right Column: Floating Contact Card */}
          <div className="contact-right-col">
            <div className="contact-card">
              <form onSubmit={(e) => { e.preventDefault(); alert('Votre message a été envoyé avec succès !'); e.target.reset(); }}>
                <div className="form-group">
                  <label htmlFor="contact-name" className="form-label font-display">VOTRE NOM</label>
                  <input 
                    type="text" 
                    id="contact-name" 
                    className="form-input" 
                    placeholder="Entrez votre nom" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email" className="form-label font-display">VOTRE EMAIL</label>
                  <input 
                    type="email" 
                    id="contact-email" 
                    className="form-input" 
                    placeholder="Entrez votre adresse mail" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-msg" className="form-label font-display">VOTRE MESSAGE</label>
                  <textarea 
                    id="contact-msg" 
                    className="form-input text-area" 
                    rows="4" 
                    placeholder="Écrivez votre message..." 
                    required 
                  />
                </div>

                <button type="submit" className="btn primary submit-form-btn font-display">
                  ENVOYER
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

