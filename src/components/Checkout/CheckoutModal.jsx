import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../lib/utils'
import { ALGERIA } from '../../data/algeria'
import { supabase } from '../../lib/supabase'
import './CheckoutModal.css'

const WHATSAPP_NUMBER = '213553628299'

// Bank Details Constants from User
const CCP_ACCOUNT = '0019663855'
const CCP_KEY     = '64'
const CCP_NAME    = 'Guittoum Djamel Eddine'
const BARIDIMOB_RIP = '007999999001966385564'

// ── Searchable dropdown ───────────────────────────────────────
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

// ── Payment method toggle ─────────────────────────────────────
function PaymentToggle({ value, onChange, t }) {
  return (
    <div className="pay-toggle">
      <button
        type="button"
        id="pay-toggle-online"
        className={`pay-toggle__btn${value === 'online' ? ' active' : ''}`}
        onClick={() => onChange('online')}
        aria-pressed={value === 'online'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
          <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
        <span>{t('checkout.payOnline')}</span>
        <span className="pay-toggle__sub">{t('checkout.payOnlineSub')}</span>
      </button>

      <button
        type="button"
        id="pay-toggle-ccp"
        className={`pay-toggle__btn${value === 'ccp' ? ' active' : ''}`}
        onClick={() => onChange('ccp')}
        aria-pressed={value === 'ccp'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 10h16M4 14h16M4 18h16M4 6h16"/>
        </svg>
        <span>{t('checkout.payCcp')}</span>
        <span className="pay-toggle__sub">{t('checkout.payCcpSub')}</span>
      </button>
    </div>
  )
}

// ── Main checkout modal ───────────────────────────────────────
export default function CheckoutModal() {
  const { t } = useTranslation()
  const { items, directItem, dispatch, checkoutOpen, closeCheckout, totalPrice } = useCart()

  const [directQty, setDirectQty] = useState(1)

  useEffect(() => {
    if (checkoutOpen && directItem) setDirectQty(1)
  }, [checkoutOpen, directItem?.id])

  const orderItems = directItem ? [{ ...directItem, quantity: directQty }] : items
  const orderTotal = directItem ? (directItem.price * directQty) : totalPrice
  const currency = orderItems[0]?.currency ?? 'DA'

  const [name,        setName]        = useState('')
  const [phone,       setPhone]       = useState('')
  const [wilaya,      setWilaya]      = useState('')
  const [commune,     setCommune]     = useState('')
  const [payMethod,   setPayMethod]   = useState('online')   // 'online' | 'ccp'
  const [receiptFile, setReceiptFile] = useState(null)
  const [receiptPreview, setReceiptPreview] = useState('')
  const [copiedField, setCopiedField] = useState(null)
  const [errors,      setErrors]      = useState({})
  const [isLoading,   setIsLoading]   = useState(false)
  const [payError,    setPayError]    = useState('')
  const payErrorRef = useRef(null)
  const fileInputRef = useRef(null)

  const selectedWilaya = ALGERIA.find(w => w.name === wilaya)
  const communes = selectedWilaya?.communes ?? []

  const wilayaOptions = ALGERIA.map(w => ({
    value: w.name,
    label: `${w.id < 10 ? `0${w.id}` : w.id}. ${w.name}`
  }))

  const communeOptions = communes.map(c => ({ value: c, label: c }))

  function copyToClipboard(text, field) {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  function validate() {
    const e = {}
    if (!name.trim())                        e.name    = t('checkout.errors.name')
    if (!/^0[5-7]\d{8}$/.test(phone.trim())) e.phone   = t('checkout.errors.phone')
    if (!wilaya)                              e.wilaya  = t('checkout.errors.wilaya')
    if (!commune)                             e.commune = 'Veuillez choisir votre commune.'
    if (payMethod === 'ccp' && !receiptFile)  e.receipt = t('checkout.errors.receipt')
    return e
  }

  function showError(msg) {
    setPayError(msg)
    setTimeout(() => {
      payErrorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 50)
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setReceiptFile(file)
    setReceiptPreview(URL.createObjectURL(file))
    setErrors(p => ({ ...p, receipt: '' }))
  }

  async function uploadReceiptToSupabase(file) {
    try {
      const ext = file.name.split('.').pop()
      const fileName = `receipts/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('receipts').upload(fileName, file)
      if (error) {
        // If storage bucket doesn't exist, ignore error gracefully
        console.warn('Supabase storage receipt upload warning:', error)
        return null
      }
      const { data } = supabase.storage.from('receipts').getPublicUrl(fileName)
      return data?.publicUrl || null
    } catch {
      return null
    }
  }

  function buildCcpWhatsAppMessage(receiptUrl) {
    const lines = [`🛒 *NOUVELLE COMMANDE — CCP / BARIDIMOB*`, '']
    orderItems.forEach(item => {
      lines.push(
        `• *${item.name}* (${item.brand})` +
        `\n  Qté : ${item.quantity}` +
        `\n  Prix : ${formatPrice(item.price * item.quantity, item.currency)}`
      )
    })
    lines.push('')
    lines.push(`*TOTAL PAYÉ VIA CCP : ${formatPrice(orderTotal, currency)}*`)
    lines.push('')
    lines.push('👤 *Informations client*')
    lines.push(`Nom     : ${name.trim()}`)
    lines.push(`Tél     : ${phone.trim()}`)
    lines.push(`Wilaya  : ${wilaya}`)
    lines.push(`Commune : ${commune}`)
    lines.push('')
    lines.push('📄 *Reçu de virement attached*')
    if (receiptUrl) {
      lines.push(`Lien du reçu : ${receiptUrl}`)
    } else {
      lines.push('_Reçu joint via WhatsApp_')
    }
    lines.push('')
    lines.push('_Envoyé depuis flexsupps.dz_')
    return lines.join('\n')
  }

  async function saveOrder(receiptUrl = null) {
    const orderId = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          const r = Math.random() * 16 | 0
          const v = c === 'x' ? r : (r & 0x3 | 0x8)
          return v.toString(16)
        })

    const payload = {
      id: orderId,
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      wilaya,
      commune,
      items: orderItems.map(i => ({
        id: i.id, name: i.name, brand: i.brand,
        price: i.price, quantity: i.quantity, currency: i.currency,
      })),
      total_price: orderTotal,
      currency,
      status: payMethod === 'online' ? 'pending' : 'ccp_pending',
      payment_method: payMethod === 'online' ? 'chargily' : 'ccp_baridimob',
    }

    const { error } = await supabase.from('orders').insert(payload)

    if (error) {
      console.warn('First insert attempt warning:', error)
      // Fallback if payment_method column is not yet in Supabase table
      delete payload.payment_method
      const { error: fallbackError } = await supabase.from('orders').insert(payload)
      if (fallbackError) {
        console.error('Order insert error:', fallbackError)
        return null
      }
    }
    return orderId
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setPayError('')
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setIsLoading(true)

    try {
      if (payMethod === 'online') {
        const orderId = await saveOrder()
        let res, json
        try {
          res = await fetch('/api/chargily/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId }),
          })
          json = await res.json()
        } catch {
          showError('Impossible de joindre le service de paiement. Vérifiez votre connexion.')
          setIsLoading(false)
          return
        }

        if (!res.ok || !json.checkout_url) {
          showError(json.error || 'Erreur lors de la création du paiement. Réessayez.')
          setIsLoading(false)
          return
        }

        if (!directItem) dispatch({ type: 'CLEAR' })
        closeCheckout()
        resetForm()
        window.location.href = json.checkout_url
      } else {
        // ── CCP / BaridiMob Flow ──
        let receiptUrl = null
        if (receiptFile) {
          receiptUrl = await uploadReceiptToSupabase(receiptFile)
        }
        await saveOrder(receiptUrl)

        window.open(
          `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildCcpWhatsAppMessage(receiptUrl))}`,
          '_blank',
          'noopener,noreferrer'
        )

        if (!directItem) dispatch({ type: 'CLEAR' })
        closeCheckout()
        resetForm()
      }
    } catch (err) {
      console.error('[checkout] Error:', err)
      showError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  function resetForm() {
    setName(''); setPhone(''); setWilaya(''); setCommune('')
    setReceiptFile(null); setReceiptPreview('')
    setErrors({}); setPayError('')
  }

  function handleClose() {
    closeCheckout()
    setErrors({})
    setPayError('')
  }

  return (
    <>
      <div className={`checkout-backdrop${checkoutOpen ? ' open' : ''}`} onClick={handleClose} aria-hidden="true" />

      <div className={`checkout-modal${checkoutOpen ? ' open' : ''}`} role="dialog" aria-modal="true">

        {/* Header */}
        <div className="checkout-modal__header">
          <h2 className="checkout-modal__title">{t('checkout.title')}</h2>
          <button type="button" className="checkout-modal__close" onClick={handleClose} aria-label="Close checkout">✕</button>
        </div>

        {/* Order summary */}
        <div className="checkout-summary">
          <p className="checkout-summary__eyebrow">{t('checkout.summary')}</p>

          {directItem ? (
            <div className="checkout-direct-product">
              <img className="checkout-direct-product__img" src={directItem.image} alt={directItem.name} loading="lazy" />
              <div className="checkout-direct-product__info">
                <span className="checkout-direct-product__brand">{directItem.brand}</span>
                <span className="checkout-direct-product__name">{directItem.name}</span>
                {(directItem.flavor || directItem.size) && (
                  <span className="checkout-direct-product__variant">
                    {[directItem.flavor, directItem.size].filter(Boolean).join(' · ')}
                  </span>
                )}
                <span className="checkout-direct-product__unit-price">
                  {formatPrice(directItem.price, directItem.currency)} / unité
                </span>
                <div className="checkout-direct-qty">
                  <button type="button" className="checkout-direct-qty__btn" onClick={() => setDirectQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="checkout-direct-qty__num">{directQty}</span>
                  <button type="button" className="checkout-direct-qty__btn" onClick={() => setDirectQty(q => q + 1)}>+</button>
                </div>
              </div>
            </div>
          ) : (
            orderItems.map(item => (
              <div key={item.id} className="checkout-summary__item">
                <span className="checkout-summary__name">{item.name}</span>
                <span className="checkout-summary__qty">× {item.quantity}</span>
                <span className="checkout-summary__price">{formatPrice(item.price * item.quantity, item.currency)}</span>
              </div>
            ))
          )}

          <div className="checkout-summary__total">
            <span className="checkout-summary__total-label">Total</span>
            <span className="checkout-summary__total-amount">{formatPrice(orderTotal, currency)}</span>
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

          {/* Wilaya */}
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

          {/* Commune */}
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

          {/* Payment Method Selector */}
          <div className="checkout-field">
            <label>Mode de paiement</label>
            <PaymentToggle value={payMethod} onChange={m => { setPayMethod(m); setPayError('') }} t={t} />
          </div>

          {/* CCP / BaridiMob Details Box */}
          {payMethod === 'ccp' && (
            <div className="ccp-info-card">
              <div className="ccp-info-card__header">
                <span className="ccp-info-card__icon">📌</span>
                <p className="ccp-info-card__title">{t('checkout.ccpDetailsTitle')}</p>
              </div>

              {/* CCP Account */}
              <div className="ccp-detail-item">
                <div className="ccp-detail-item__info">
                  <span className="ccp-detail-item__label">{t('checkout.ccpAccountLabel')}</span>
                  <span className="ccp-detail-item__val">
                    <strong>{CCP_ACCOUNT}</strong> {t('checkout.ccpKeyLabel')} <strong>{CCP_KEY}</strong>
                  </span>
                  <span className="ccp-detail-item__sub">{CCP_NAME}</span>
                </div>
                <button
                  type="button"
                  className="ccp-copy-btn"
                  onClick={() => copyToClipboard(`${CCP_ACCOUNT} ${CCP_KEY}`, 'ccp')}
                >
                  {copiedField === 'ccp' ? t('checkout.copied') : t('checkout.copy')}
                </button>
              </div>

              {/* BaridiMob RIP */}
              <div className="ccp-detail-item">
                <div className="ccp-detail-item__info">
                  <span className="ccp-detail-item__label">{t('checkout.baridiMobLabel')}</span>
                  <span className="ccp-detail-item__val ccp-detail-item__val--mono">{BARIDIMOB_RIP}</span>
                </div>
                <button
                  type="button"
                  className="ccp-copy-btn"
                  onClick={() => copyToClipboard(BARIDIMOB_RIP, 'rip')}
                >
                  {copiedField === 'rip' ? t('checkout.copied') : t('checkout.copy')}
                </button>
              </div>

              {/* Upload Section */}
              <div className="ccp-upload-zone">
                <label className="ccp-upload-label">{t('checkout.uploadReceiptLabel')}</label>
                <div
                  className={`ccp-dropzone${errors.receipt ? ' error' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  {receiptPreview ? (
                    <div className="ccp-preview">
                      <img src={receiptPreview} alt="Receipt preview" />
                      <span className="ccp-preview__change">Changer de photo</span>
                    </div>
                  ) : (
                    <div className="ccp-dropzone__placeholder">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <p>{t('checkout.uploadReceiptBtn')}</p>
                    </div>
                  )}
                </div>
                {errors.receipt && <span className="checkout-field__error">{errors.receipt}</span>}
              </div>
            </div>
          )}

          {/* Payment error */}
          {payError && (
            <div className="checkout-pay-error" role="alert" ref={payErrorRef}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {payError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            id="checkout-submit-btn"
            className={`checkout-submit${payMethod === 'ccp' ? ' checkout-submit--ccp' : ''}`}
            disabled={orderItems.length === 0 || isLoading}
          >
            {isLoading ? (
              <span className="checkout-spinner" aria-hidden="true" />
            ) : payMethod === 'online' ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                Payer en ligne ({formatPrice(orderTotal, currency)})
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Envoyer le reçu via WhatsApp
              </>
            )}
          </button>

          <p className="checkout-note">{t('checkout.note')}</p>
        </form>
      </div>
    </>
  )
}
