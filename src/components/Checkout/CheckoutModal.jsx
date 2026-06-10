import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../lib/utils'
import { ALGERIA } from '../../data/algeria'
import './CheckoutModal.css'

const WHATSAPP_NUMBER = '213553628299'

// Searchable dropdown component
function SearchableSelect({ id, placeholder, options, value, onChange, error }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  const filtered = query.length > 0
    ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
    : options

  const selected = options.find(o => o.value === value)

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function pick(opt) {
    onChange(opt.value)
    setQuery('')
    setOpen(false)
  }

  function handleInputChange(e) {
    setQuery(e.target.value)
    setOpen(true)
    if (e.target.value === '') onChange('')
  }

  return (
    <div className={`searchable-select${open ? ' open' : ''}${error ? ' error' : ''}`} ref={wrapRef}>
      <div className="searchable-select__input-wrap" onClick={() => setOpen(o => !o)}>
        <input
          id={id}
          type="text"
          autoComplete="off"
          placeholder={selected ? selected.label : placeholder}
          value={open ? query : (selected ? selected.label : '')}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          className={`searchable-select__input${error ? ' error' : ''}`}
        />
        <span className="searchable-select__arrow">{open ? '▴' : '▾'}</span>
      </div>
      {open && (
        <ul className="searchable-select__dropdown" role="listbox">
          {filtered.length === 0
            ? <li className="searchable-select__no-result">No results</li>
            : filtered.map(opt => (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === value}
                  className={`searchable-select__option${opt.value === value ? ' selected' : ''}`}
                  onMouseDown={() => pick(opt)}
                >
                  {opt.label}
                </li>
              ))
          }
        </ul>
      )}
    </div>
  )
}

export default function CheckoutModal() {
  const { t } = useTranslation()
  const { items, dispatch, checkoutOpen, closeCheckout, totalPrice } = useCart()
  const currency = items[0]?.currency ?? 'DA'

  const [name,    setName]    = useState('')
  const [phone,   setPhone]   = useState('')
  const [wilaya,  setWilaya]  = useState('')
  const [commune, setCommune] = useState('')
  const [errors,  setErrors]  = useState({})

  const selectedWilaya = ALGERIA.find(w => w.name === wilaya)
  const communes = selectedWilaya?.communes ?? []

  const wilayaOptions = ALGERIA.map(w => ({
    value: w.name,
    label: `${w.id < 10 ? `0${w.id}` : w.id}. ${w.name}`
  }))

  const communeOptions = communes.map(c => ({ value: c, label: c }))

  function validate() {
    const e = {}
    if (!name.trim())                          e.name    = t('checkout.errors.name')
    if (!/^0[5-7]\d{8}$/.test(phone.trim()))   e.phone   = t('checkout.errors.phone')
    if (!wilaya)                                e.wilaya  = t('checkout.errors.wilaya')
    if (!commune)                               e.commune = 'Veuillez choisir votre commune.'
    return e
  }

  function buildMessage() {
    const lines = [`🛒 *NOUVELLE COMMANDE — FLEX SUPPS*`, '']
    items.forEach(item => {
      lines.push(
        `• *${item.name}* (${item.brand})` +
        `\n  Qté : ${item.quantity}` +
        `\n  Prix : ${formatPrice(item.price * item.quantity, item.currency)}`
      )
    })
    lines.push('')
    lines.push(`*TOTAL : ${formatPrice(totalPrice, currency)}*`)
    lines.push('')
    lines.push('👤 *Informations client*')
    lines.push(`Nom     : ${name.trim()}`)
    lines.push(`Tél     : ${phone.trim()}`)
    lines.push(`Wilaya  : ${wilaya}`)
    lines.push(`Commune : ${commune}`)
    lines.push('')
    lines.push('_Envoyé depuis flexsupps.dz_')
    return lines.join('\n')
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`, '_blank', 'noopener,noreferrer')
    dispatch({ type: 'CLEAR' })
    closeCheckout()
    setName(''); setPhone(''); setWilaya(''); setCommune(''); setErrors({})
  }

  function handleClose() { closeCheckout(); setErrors({}) }

  return (
    <>
      <div className={`checkout-backdrop${checkoutOpen ? ' open' : ''}`} onClick={handleClose} aria-hidden="true" />

      <div className={`checkout-modal${checkoutOpen ? ' open' : ''}`} role="dialog" aria-modal="true">

        {/* Header */}
        <div className="checkout-modal__header">
          <h2 className="checkout-modal__title">{t('checkout.title')}</h2>
          <button className="checkout-modal__close" onClick={handleClose}>✕</button>
        </div>

        {/* Order summary */}
        <div className="checkout-summary">
          <p className="checkout-summary__eyebrow">{t('checkout.summary')}</p>
          {items.map(item => (
            <div key={item.id} className="checkout-summary__item">
              <span className="checkout-summary__name">{item.name}</span>
              <span className="checkout-summary__qty">× {item.quantity}</span>
              <span className="checkout-summary__price">{formatPrice(item.price * item.quantity, item.currency)}</span>
            </div>
          ))}
          <div className="checkout-summary__total">
            <span className="checkout-summary__total-label">Total</span>
            <span className="checkout-summary__total-amount">{formatPrice(totalPrice, currency)}</span>
          </div>
        </div>

        {/* Form */}
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <p className="checkout-form__eyebrow">{t('checkout.yourInfo')}</p>

          {/* Name */}
          <div className="checkout-field">
            <label htmlFor="co-name">{t('checkout.fullName')}</label>
            <input id="co-name" type="text" value={name}
              onChange={e => { setName(e.target.value); setErrors(p => ({...p, name: ''})) }}
              placeholder={t('checkout.namePlaceholder')} autoComplete="name"
              className={errors.name ? 'error' : ''} />
            {errors.name && <span className="checkout-field__error">{errors.name}</span>}
          </div>

          {/* Phone */}
          <div className="checkout-field">
            <label htmlFor="co-phone">{t('checkout.phone')}</label>
            <input id="co-phone" type="tel" value={phone}
              onChange={e => { setPhone(e.target.value); setErrors(p => ({...p, phone: ''})) }}
              placeholder={t('checkout.phonePlaceholder')} autoComplete="tel"
              className={errors.phone ? 'error' : ''} />
            {errors.phone && <span className="checkout-field__error">{errors.phone}</span>}
          </div>

          {/* Wilaya — searchable */}
          <div className="checkout-field">
            <label htmlFor="co-wilaya">Wilaya</label>
            <SearchableSelect
              id="co-wilaya"
              placeholder="— Rechercher la wilaya —"
              options={wilayaOptions}
              value={wilaya}
              onChange={val => { setWilaya(val); setCommune(''); setErrors(p => ({...p, wilaya: ''})) }}
              error={!!errors.wilaya}
            />
            {errors.wilaya && <span className="checkout-field__error">{errors.wilaya}</span>}
          </div>

          {/* Commune — searchable, only show when wilaya selected */}
          {wilaya && (
            <div className="checkout-field">
              <label htmlFor="co-commune">Commune / Baladiya</label>
              <SearchableSelect
                id="co-commune"
                placeholder="— Rechercher la commune —"
                options={communeOptions}
                value={commune}
                onChange={val => { setCommune(val); setErrors(p => ({...p, commune: ''})) }}
                error={!!errors.commune}
              />
              {errors.commune && <span className="checkout-field__error">{errors.commune}</span>}
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="checkout-submit" disabled={items.length === 0}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {t('checkout.confirm')}
          </button>

          <p className="checkout-note">{t('checkout.note')}</p>
        </form>
      </div>
    </>
  )
}
