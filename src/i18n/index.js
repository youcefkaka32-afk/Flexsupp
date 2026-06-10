import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import fr from './locales/fr.json'
import ar from './locales/ar.json'

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  ar: { translation: ar },
}

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('locale') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

// apply dir for Arabic
function applyDir(lng) {
  const dir = lng === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.setAttribute('dir', dir)
}

applyDir(i18n.language)

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('locale', lng)
  applyDir(lng)
})

export default i18n
