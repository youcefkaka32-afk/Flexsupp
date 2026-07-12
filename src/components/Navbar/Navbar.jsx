import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import './Navbar.css'
import { MenuToggleIcon } from '../ui/menu-toggle-icon'
import LanguageSwitcher from './LanguageSwitcher'
import { useTheme } from '../../context/ThemeContext'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hidden, setHidden]         = useState(false)
  const [atTop, setAtTop]           = useState(true)
  const lastY = useRef(0)
  const location = useLocation()
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    setAtTop(y < 10)
    // hide when scrolling down past 80px, show immediately on scroll up
    if (y > 80) {
      if (y > lastY.current + 4) setHidden(true)   // scrolling down
      else if (y < lastY.current - 4) setHidden(false) // scrolling up
    } else {
      setHidden(false)
    }
    lastY.current = y
  })

  const navLinks = [
    { path: '/',      label: t('nav.home')  },
    { path: '/shop',  label: t('nav.shop')  },
    { path: '/about', label: t('nav.about') },
  ]

  const navClass = 'global-navbar'

  const handleLinkClick = () => {
    setMobileOpen(false)
  }

  return (
    <>
      <motion.nav
        className={navClass}
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y:       hidden ? '-100%' : 0,
          opacity: hidden ? 0       : 1,
        }}
        transition={{
          y:       { duration: hidden ? 0.35 : 0.42, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: hidden ? 0.25 : 0.38, ease: 'easeInOut' },
        }}
      >
        <div className="global-navbar__shell">
          <div className="global-navbar__logo-wrap">
            <Link to="/" className="global-navbar__logo">
              <img src="/flexlgo.png" alt="FLEX SUPPS Logo" className="navbar-logo-img" />
            </Link>
            <button
              type="button"
              className="mobile-menu-button"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((s) => !s)}
            >
              <MenuToggleIcon open={mobileOpen} width={22} height={22}
                stroke="#fff" />
            </button>
          </div>

          <div className="global-navbar__left">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link${location.pathname === link.path ? ' active' : ''}`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    className="nav-link__indicator"
                    layoutId="navbar-indicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="global-navbar__right">
            <LanguageSwitcher />
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? (
                /* Sun icon */
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                /* Moon icon */
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <>
          <div 
            className="mobile-menu-backdrop" 
            onClick={() => setMobileOpen(false)}
          />
          <motion.div 
            className="mobile-menu-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="mobile-menu-header">
              <h2 className="font-display">MENU</h2>
              <button
                type="button"
                className="mobile-menu-close"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <nav className="mobile-menu-nav">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`mobile-menu-link font-display${location.pathname === link.path ? ' active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mobile-menu-footer">
              <LanguageSwitcher />
            </div>
          </motion.div>
        </>
      )}
    </>
  )
}
