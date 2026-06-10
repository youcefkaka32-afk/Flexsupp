/**
 * useScrollReveal — wraps GSAP + ScrollTrigger for clean scroll animations.
 *
 * Usage:
 *   const sectionRef = useScrollReveal(options)
 *   <section ref={sectionRef}>...</section>
 *
 * Or with a selector:
 *   useScrollReveal({ selector: '.my-card', stagger: 0.1 }, sectionRef)
 */
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * @param {Object} opts
 * @param {string}  [opts.selector]      - CSS selector for child elements (default: the ref el itself)
 * @param {string}  [opts.from]          - preset: 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'scale' | 'fade'
 * @param {number}  [opts.stagger]       - stagger delay between items (default 0.08)
 * @param {number}  [opts.duration]      - animation duration (default 0.9)
 * @param {number}  [opts.delay]         - base delay (default 0)
 * @param {string}  [opts.ease]          - gsap ease (default 'power3.out')
 * @param {string}  [opts.start]         - ScrollTrigger start (default 'top 85%')
 * @param {boolean} [opts.once]          - only animate once (default true)
 * @param {Object}  [opts.vars]          - override fromVars completely
 * @param {React.RefObject} [externalRef] - pass your own ref instead
 */
export function useScrollReveal(opts = {}, externalRef = null) {
  const internalRef = useRef(null)
  const ref = externalRef ?? internalRef

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const {
      selector    = null,
      from        = 'fadeUp',
      stagger     = 0.08,
      duration    = 0.9,
      delay       = 0,
      ease        = 'power3.out',
      start       = 'top 85%',
      once        = true,
      vars        = null,
    } = opts

    const targets = selector ? el.querySelectorAll(selector) : [el]
    if (!targets.length) return

    // Preset from-vars
    const presets = {
      fadeUp:    { opacity: 0, y: 56, scale: 0.98 },
      fadeLeft:  { opacity: 0, x: 60 },
      fadeRight: { opacity: 0, x: -60 },
      scale:     { opacity: 0, scale: 0.88, y: 20 },
      fade:      { opacity: 0 },
    }

    const fromVars = vars ?? presets[from] ?? presets.fadeUp

    // Set initial state
    gsap.set(targets, fromVars)

    const toVars = {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration,
      ease,
      delay,
      stagger,
      scrollTrigger: {
        trigger: el,
        start,
        once,
      },
    }

    const ctx = gsap.context(() => {
      gsap.to(targets, toVars)
    }, el)

    return () => ctx.revert()
  }, [])

  return ref
}

/**
 * Shorthand hooks for common patterns
 */
export function useFadeUp(opts, externalRef) {
  return useScrollReveal({ from: 'fadeUp', ...opts }, externalRef)
}

export function useStaggerReveal(selector, opts = {}) {
  return useScrollReveal({ selector, from: 'fadeUp', stagger: 0.1, ...opts })
}
