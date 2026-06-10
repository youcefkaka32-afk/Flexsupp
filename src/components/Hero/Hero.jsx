import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import * as THREE from 'three'
import './Hero.css'
import { slides } from '../../data/siteData'
import CartIcon from '../Cart/CartIcon'
import TextAnimate from '../../registry/magicui/text-animate'

gsap.registerPlugin(CustomEase)
CustomEase.create('heroEase', '0.22, 1, 0.36, 1')

function isWebGLSupported() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')))
  } catch {
    return false
  }
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform float uProgress;
  uniform float uGlitch;
  uniform float uImageScale;
  uniform vec2 uResolution;
  uniform sampler2D uPrevTex;
  uniform sampler2D uNextTex;
  uniform vec2 uPrevTexSize;
  uniform vec2 uNextTexSize;
  varying vec2 vUv;

  vec3 permute(vec3 x){ return mod(((x * 34.0) + 1.0) * x, 289.0); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 a0 = x - floor(x + 0.5);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  vec2 coverUv(vec2 uv, vec2 texSize, vec2 resolution) {
    float texRatio = texSize.x / texSize.y;
    float resRatio = resolution.x / resolution.y;
    vec2 scale = resRatio > texRatio ? vec2(resRatio / texRatio, 1.0) : vec2(1.0, texRatio / resRatio);
    return (uv - 0.5) * scale + 0.5;
  }

  vec4 sampleLayer(sampler2D tex, vec2 texSize, vec2 uv, float direction, float glitch) {
    float row = floor(uv.y * 28.0);
    float rowNoise = fract(sin(row * 123.456 + floor(uTime * 32.0)) * 43758.5453);
    float rowShift = 0.0;
    if (glitch > 0.0 && rowNoise > 0.85 - glitch * 0.12) {
      rowShift = (rowNoise - 0.5) * 0.045 * glitch * direction;
    }
    float wave = snoise(vec2(uv.y * 6.0, uTime * 0.8)) * 0.004 * glitch * direction;
    vec2 sampleUv = coverUv(uv, texSize, uResolution);
    sampleUv = (sampleUv - 0.5) * uImageScale + 0.5;
    sampleUv.x += rowShift + wave;
    return texture2D(tex, sampleUv);
  }

  void main() {
    vec2 uv = vUv;
    float progress = smoothstep(0.0, 1.0, uProgress);
    float transitionWarp = sin(progress * 3.14159265);
    float drift = transitionWarp * 0.012;
    vec2 noiseOffset = vec2(
      snoise(uv * 2.8 + vec2(uTime * 0.15, progress * 1.5)),
      snoise(uv * 2.8 + vec2(progress * 1.5, uTime * 0.15 + 8.0))
    ) * (0.07 * transitionWarp);

    vec4 prevColor = sampleLayer(uPrevTex, uPrevTexSize, uv + noiseOffset, 1.0, uGlitch);
    vec4 nextColor = sampleLayer(uNextTex, uNextTexSize, uv - noiseOffset, -1.0, uGlitch);
    float transition = clamp(progress + snoise(uv * 3.0 + vec2(0.0, progress * 2.0)) * 0.10 * transitionWarp, 0.0, 1.0);
    vec3 color = mix(prevColor.rgb, nextColor.rgb, transition);

    color += vec3(0.03, 0.03, 0.04) * transitionWarp;
    color += vec3(drift);
    color.r += snoise(uv * 4.0 + uTime * 0.45) * 0.015 * transitionWarp;
    color.g += snoise(uv * 4.3 + uTime * 0.4 + 2.0) * 0.010 * transitionWarp;
    color.b += snoise(uv * 4.6 + uTime * 0.35 + 4.0) * 0.015 * transitionWarp;

    gl_FragColor = vec4(color, 1.0);
  }
`

export default function Hero() {
  const heroRef = useRef(null)
  const glCanvasRef = useRef(null)
  const bgARef = useRef(null)
  const bgBRef = useRef(null)
  const grainRef = useRef(null)
  const glitchRef = useRef(null)
  const vhsRef = useRef(null)
  const prevBtnRef = useRef(null)
  const nextBtnRef = useRef(null)
  const cursorRef = useRef(null)

  const navigate = useNavigate()
  const state = useRef({
    currentIndex: 0,
    activeBackground: null,
    inactiveBackground: null,
    autoplay: null,
    paused: false,
    transitioning: false,
    lastNoiseTime: 0,
    glitchPower: 0,
    cursorTarget: { x: 0, y: 0 },
    cursorPos: { x: 0, y: 0 },
    isGLActive: false,
    glRenderer: null,
    glMaterial: null,
    floatTl: null,
    textureCache: new Map(),
  })

  const getSlideImageScale = (slide) => {
    const desktop = typeof window !== 'undefined' && window.innerWidth > 520
    const isMobile = window.innerWidth <= 768
    
    // If mobile and slide has mobile image, zoom out more for better framing
    if (isMobile && slide.imageMobile) {
      return 1.15  // Slightly zoomed out on mobile
    }
    
    return desktop ? (slide === slides[0] ? 1.15 : 0.88) : 1.0
  }

  const handleHeroClick = (event) => {
    if (event.target.closest('a, button, input, textarea, select')) return
    window.location.href = 'https://www.instagram.com/flex_supps_/'
  }

  const applyBackground = (slide, layer) => {
    layer.className = 'bg-layer is-active'
    if (slide.backdrop) layer.classList.add(slide.backdrop)
    
    // Use mobile image if available and on mobile device
    const isMobile = window.innerWidth <= 768
    const imageToUse = isMobile && slide.imageMobile ? slide.imageMobile : slide.image
    
    layer.style.backgroundImage = `
      linear-gradient(90deg, rgba(5, 8, 14, 0.86) 0%, rgba(5, 8, 14, 0.48) 40%, rgba(5, 8, 14, 0.12) 66%, rgba(5, 8, 14, 0.44) 100%),
      linear-gradient(to top, rgba(0, 0, 0, 0.28) 0%, transparent 32%),
      url("${imageToUse}")
    `
    layer.style.backgroundPosition = 'center center, center center, center center'
    const desktop = (typeof window !== 'undefined' && window.innerWidth > 520)
    
    // Zoom out mobile hero image for better framing
    let imgSize
    if (!desktop && slide.imageMobile) {
      imgSize = '105%'  // Slightly zoomed out mobile images
    } else if (!desktop) {
      imgSize = 'cover'  // Regular mobile size for slides without mobile variant
    } else {
      imgSize = slide === slides[0] ? '85% 85%' : '115% 115%'  // Desktop sizing
    }
    
    layer.style.backgroundSize = `cover, cover, ${imgSize}`
    layer.style.backgroundRepeat = 'no-repeat'
  }

  const syncNav = (slide) => {
    document.querySelectorAll('.center-nav a').forEach((link) => {
      link.classList.toggle('active', link.dataset.nav === slide.nav)
    })
  }

  const spawnGlitchScanlines = () => {
    const go = glitchRef.current
    go.innerHTML = ''
    const lines = 10 + Math.floor(Math.random() * 6)
    for (let i = 0; i < lines; i++) {
      const line = document.createElement('div')
      line.className = 'scanline'
      line.style.top = `${Math.random() * 100}%`
      line.style.height = `${8 + Math.random() * 20}px`
      line.style.opacity = `${0.22 + Math.random() * 0.62}`
      line.style.transform = `translateX(${(Math.random() - 0.5) * 180}px)`
      line.style.background = `linear-gradient(90deg,rgba(255,255,255,.02),rgba(255,255,255,${0.04 + Math.random() * 0.12}),rgba(255,255,255,.02))`
      go.appendChild(line)
      gsap.to(line, {
        opacity: 0,
        x: (Math.random() - 0.5) * 180,
        duration: 0.12 + Math.random() * 0.12,
        delay: Math.random() * 0.08,
        ease: 'power2.out',
        onComplete: () => line.remove(),
      })
    }
  }

  const loadTexture = (src) => new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader()
    loader.load(
      src,
      (texture) => {
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.generateMipmaps = true
        texture.encoding = THREE.sRGBEncoding
        resolve(texture)
      },
      undefined,
      reject,
    )
  })

  const triggerGLTransition = (prevSlide, nextSlide) => {
    const { glMaterial } = state.current
    if (!glMaterial) return false
    const prev = state.current.textureCache.get(prevSlide.image)
    const next = state.current.textureCache.get(nextSlide.image)
    if (!prev || !next) return false

    const u = glMaterial.uniforms
    u.uPrevTex.value = prev
    u.uPrevTexSize.value.set(prev.image.width, prev.image.height)
    u.uNextTex.value = next
    u.uNextTexSize.value.set(next.image.width, next.image.height)
    u.uImageScale.value = getSlideImageScale(nextSlide)
    u.uProgress.value = 0
    gsap.killTweensOf(u.uProgress)
    gsap.to(u.uProgress, { value: 1, duration: 0.75, ease: 'power2.out' })
    u.uGlitch.value = 1
    gsap.killTweensOf(u.uGlitch)
    gsap.to(u.uGlitch, { value: 0, duration: 1.2, ease: 'power2.out' })
    return true
  }

  const scheduleAutoplay = useCallback(() => {
    const s = state.current
    clearTimeout(s.autoplay)
    if (s.paused || s.transitioning) return
    s.autoplay = setTimeout(() => {
      glitchTo((s.currentIndex + 1) % slides.length)
    }, 5600)
  }, []) // eslint-disable-line

  const renderSlide = useCallback((index, immediate = false, skipEntry = false) => {
    const s = state.current
    const slide = slides[index]
    const oldSlide = slides[s.currentIndex]
    s.currentIndex = index
    syncNav(slide)
    if (heroRef.current) {
      heroRef.current.classList.toggle('is-main-slide', index === 0)
    }

    if (immediate) {
      if (s.isGLActive && s.glMaterial) {
        const u = s.glMaterial.uniforms
        const tex = s.textureCache.get(slide.image)
        if (tex) {
          u.uPrevTex.value = tex
          u.uPrevTexSize.value.set(tex.image.width, tex.image.height)
          u.uNextTex.value = tex
          u.uNextTexSize.value.set(tex.image.width, tex.image.height)
          u.uImageScale.value = getSlideImageScale(slide)
          u.uProgress.value = 1
          u.uGlitch.value = 0
        }
      } else {
        applyBackground(slide, s.activeBackground)
        s.activeBackground.classList.add('is-active')
        s.inactiveBackground.classList.remove('is-active')
        gsap.set(bgBRef.current, { opacity: 0, scale: 1 })
        gsap.set(bgARef.current, { opacity: 1, scale: 1 })
      }
      return
    }

    if (s.isGLActive && !triggerGLTransition(oldSlide, slide)) {
      applyBackground(slide, s.inactiveBackground)
      // update GL image scale for transition target
      if (s.glMaterial) {
        s.glMaterial.uniforms.uImageScale.value = getSlideImageScale(slide)
      }
      gsap.killTweensOf([s.activeBackground, s.inactiveBackground])
      gsap.set(s.inactiveBackground, { opacity: 0, scale: 1.15 })
      s.inactiveBackground.classList.add('is-active')
      gsap.to(s.inactiveBackground, { opacity: 1, scale: 1, duration: 1.6, ease: 'power2.out' })
      gsap.to(s.activeBackground, { opacity: 0, scale: 0.92, duration: 1.6, ease: 'power2.out', onComplete: () => { s.activeBackground.classList.remove('is-active') } })
      ;[s.activeBackground, s.inactiveBackground] = [s.inactiveBackground, s.activeBackground]
    } else if (!s.isGLActive) {
      applyBackground(slide, s.inactiveBackground)
      // apply CSS background sizing per slide when GL is not active
      if (s.inactiveBackground) {
        const desktop = typeof window !== 'undefined' && window.innerWidth > 520
        const imgSize = desktop ? (slide === slides[0] ? '85% 85%' : '115% 115%') : 'cover'
        s.inactiveBackground.style.backgroundSize = `cover, cover, ${imgSize}`
      }
      gsap.killTweensOf([s.activeBackground, s.inactiveBackground])
      gsap.set(s.inactiveBackground, { opacity: 0, scale: 1.15 })
      s.inactiveBackground.classList.add('is-active')
      gsap.to(s.inactiveBackground, { opacity: 1, scale: 1, duration: 1.6, ease: 'power2.out' })
      gsap.to(s.activeBackground, { opacity: 0, scale: 0.92, duration: 1.6, ease: 'power2.out', onComplete: () => { s.activeBackground.classList.remove('is-active') } })
      ;[s.activeBackground, s.inactiveBackground] = [s.inactiveBackground, s.activeBackground]
    }

  }, [])

  const glitchTo = useCallback((nextIndex) => {
    const s = state.current
    if (s.transitioning || nextIndex === s.currentIndex) return
    s.transitioning = true
    s.paused = true
    clearTimeout(s.autoplay)

    const nextSlide = slides[nextIndex]
    s.glitchPower = 0.9
    spawnGlitchScanlines()
    heroRef.current.classList.add('is-glitching')

    const tl = gsap.timeline()
    tl.to(vhsRef.current, { opacity: 0.35, duration: 0.12, ease: 'none' }, 0.35)
    tl.to(vhsRef.current, { opacity: 0, duration: 0.55, ease: 'power2.out' }, 0.47)
    tl.call(() => { renderSlide(nextIndex, false, true) }, null, 0.35)
    tl.call(() => {
      s.glitchPower = 0
      heroRef.current.classList.remove('is-glitching')
      s.transitioning = false
      s.paused = false
      scheduleAutoplay()
    }, null, 2.20)
  }, [renderSlide, scheduleAutoplay]) // eslint-disable-line

  useEffect(() => {
    const s = state.current
    s.activeBackground = bgARef.current
    s.inactiveBackground = bgBRef.current
    s.cursorTarget.x = window.innerWidth / 2
    s.cursorTarget.y = window.innerHeight / 2
    s.cursorPos.x = s.cursorTarget.x
    s.cursorPos.y = s.cursorTarget.y

    const grain = grainRef.current
    const ctx = grain.getContext('2d', { willReadFrequently: true })
    const nW = 256
    const nH = 256
    grain.width = nW
    grain.height = nH
    grain.style.width = '100%'
    grain.style.height = '100%'
    const imgData = ctx.createImageData(nW, nH)
    const data = imgData.data
    let rafGrain

    function drawGrain(ts) {
      if (ts - s.lastNoiseTime < 40 && s.glitchPower < 0.5) {
        rafGrain = requestAnimationFrame(drawGrain)
        return
      }
      s.lastNoiseTime = ts
      const base = s.glitchPower > 0 ? Math.floor(100 + s.glitchPower * 90) : 22
      const jitter = 40 + s.glitchPower * 120
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.floor(jitter + Math.random() * (120 + s.glitchPower * 120))
        data[i] = v
        data[i + 1] = v
        data[i + 2] = v
        data[i + 3] = base
      }
      ctx.putImageData(imgData, 0, 0)
      rafGrain = requestAnimationFrame(drawGrain)
    }
    rafGrain = requestAnimationFrame(drawGrain)

    let cancelled = false
    let rafGL = 0
    let onResize = null

    ;(async () => {
      try {
        // Check if mobile device
        const isMobile = window.innerWidth <= 768
        
        // Load textures - use mobile image if available and on mobile device
        const textureEntries = await Promise.all(slides.map(async (slide) => {
          const imageToUse = isMobile && slide.imageMobile ? slide.imageMobile : slide.image
          return [slide.image, await loadTexture(imageToUse)]
        }))
      if (cancelled) {
        textureEntries.forEach(([, texture]) => texture.dispose())
        return
      }
        textureEntries.forEach(([src, texture]) => {
          s.textureCache.set(src, texture)
        })

        if (!isWebGLSupported()) return

        const canvas = glCanvasRef.current
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(window.innerWidth, window.innerHeight)
        s.glRenderer = renderer
        s.isGLActive = true

      const scene = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
      const firstSlide = slides[0]
      const firstTex = s.textureCache.get(firstSlide.image)
      const mat = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 1 },
          uGlitch: { value: 0 },
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uImageScale: { value: getSlideImageScale(firstSlide) },
          uPrevTex: { value: firstTex },
          uNextTex: { value: firstTex },
          uPrevTexSize: { value: new THREE.Vector2(firstTex.image.width, firstTex.image.height) },
          uNextTexSize: { value: new THREE.Vector2(firstTex.image.width, firstTex.image.height) },
        },
        depthWrite: false,
        depthTest: false,
      })
      s.glMaterial = mat
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat))

        bgARef.current.style.display = 'none'
        bgBRef.current.style.display = 'none'
        renderSlide(s.currentIndex, true, true)

        const clock = new THREE.Clock()
        function animateGL() {
          rafGL = requestAnimationFrame(animateGL)
          mat.uniforms.uTime.value = clock.getElapsedTime()
          renderer.render(scene, camera)
        }
        animateGL()

        onResize = () => {
          renderer.setSize(window.innerWidth, window.innerHeight)
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
          mat.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
          mat.uniforms.uImageScale.value = getSlideImageScale(slides[s.currentIndex])
        }
        window.addEventListener('resize', onResize)
      } catch (err) {
        console.warn('Hero texture setup failed, falling back to CSS backgrounds.', err)
      }
    })()

    return () => {
      cancelled = true
      cancelAnimationFrame(rafGrain)
      cancelAnimationFrame(rafGL)
      if (onResize) window.removeEventListener('resize', onResize)
    }
  }, [renderSlide])

  useEffect(() => {
    const s = state.current
    renderSlide(0, true)

    const cursorPos = s.cursorPos
    const cursorTarget = s.cursorTarget
    let rafCursor

    function animateCursor() {
      cursorPos.x += (cursorTarget.x - cursorPos.x) * 0.15
      cursorPos.y += (cursorTarget.y - cursorPos.y) * 0.15
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.x}px,${cursorPos.y}px) translate(-50%,-50%)`
      }
      rafCursor = requestAnimationFrame(animateCursor)
    }
    animateCursor()

    const hero = heroRef.current
    const onMouseMove = (e) => {
      const rect = hero.getBoundingClientRect()
      const over = e.clientY >= rect.top && e.clientY <= rect.bottom && e.clientX >= rect.left && e.clientX <= rect.right
      if (cursorRef.current) cursorRef.current.style.display = over ? 'block' : 'none'
      cursorTarget.x = e.clientX
      cursorTarget.y = e.clientY
    }
    const onEnter = () => { s.paused = true; clearTimeout(s.autoplay); if (cursorRef.current) cursorRef.current.style.display = 'block' }
    const onLeave = () => {
      s.paused = false
      scheduleAutoplay()
      if (cursorRef.current) cursorRef.current.style.display = 'none'
    }

    window.addEventListener('mousemove', onMouseMove)
    hero.addEventListener('mouseenter', onEnter)
    hero.addEventListener('mouseleave', onLeave)

    hero.querySelectorAll('a,button').forEach((el) => {
      el.addEventListener('mouseenter', () => cursorRef.current?.classList.add('hovering'))
      el.addEventListener('mouseleave', () => cursorRef.current?.classList.remove('hovering'))
    })

    const onKey = (e) => {
      if (e.key === 'ArrowRight') glitchTo((s.currentIndex + 1) % slides.length)
      if (e.key === 'ArrowLeft') glitchTo((s.currentIndex - 1 + slides.length) % slides.length)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('blur', () => { s.paused = true; clearTimeout(s.autoplay) })
    window.addEventListener('focus', () => { s.paused = false; scheduleAutoplay() })

    const navs = [
      { container: document.querySelector('.ghost-nav.left'), btn: prevBtnRef.current, symbol: document.querySelector('.ghost-nav.left .arrow-symbol') },
      { container: document.querySelector('.ghost-nav.right'), btn: nextBtnRef.current, symbol: document.querySelector('.ghost-nav.right .arrow-symbol') },
    ]
    navs.forEach(({ container, btn, symbol }) => {
      if (!container || !btn || !symbol) return
      btn.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect()
        const dX = e.clientX - (rect.left + rect.width / 2)
        const dY = e.clientY - (rect.top + rect.height / 2)
        gsap.to(container, { x: dX * 0.15, y: dY * 0.15, scale: 2.2, borderColor: 'rgba(255,255,255,.45)', backgroundColor: 'rgba(255,255,255,.04)', duration: 0.3, ease: 'power2.out' })
        gsap.to(symbol, { x: dX * 0.32, y: dY * 0.32, scale: 1.15, duration: 0.3, ease: 'power2.out' })
      })
      btn.addEventListener('mouseleave', () => {
        gsap.to(container, { x: 0, y: 0, scale: 1, borderColor: 'rgba(255,255,255,.14)', backgroundColor: 'rgba(255,255,255,0)', duration: 0.8, ease: 'elastic.out(1.1,.6)' })
        gsap.to(symbol, { x: 0, y: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1.1,.6)' })
      })
    })

    scheduleAutoplay()
    return () => {
      cancelAnimationFrame(rafCursor)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('keydown', onKey)
      hero.removeEventListener('mouseenter', onEnter)
      hero.removeEventListener('mouseleave', onLeave)
    }
  }, [renderSlide, glitchTo, scheduleAutoplay])

  return (
    <main className="hero" id="hero" ref={heroRef} onClick={handleHeroClick}>
      <canvas id="hero-gl-canvas" className="bg-gl-canvas" ref={glCanvasRef} />
      <div className="bg-layer is-active" id="bgA" ref={bgARef} />
      <div className="bg-layer" id="bgB" ref={bgBRef} />
      <div className="bg-veil" />
      <canvas className="grain" id="grain" ref={grainRef} />
      <div className="glitch-overlay" id="glitchOverlay" ref={glitchRef} aria-hidden="true" />
      <div className="crt-overlay" aria-hidden="true" />
      <div className="vhs-flash-overlay" id="vhsFlash" ref={vhsRef} aria-hidden="true" />

      <svg className="fx-defs" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
        <filter id="liquidDisplacement" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
          <feDisplacementMap id="liquidMap" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="chromaticGlitch" x="-20%" y="-20%" width="140%" height="140%">
          <feOffset in="SourceGraphic" dx="-4" dy="0" result="redShift">
            <animate attributeName="dx" values="-4;0;-3;0" dur="0.18s" repeatCount="indefinite" />
          </feOffset>
          <feColorMatrix in="redShift" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="red" />
          <feOffset in="SourceGraphic" dx="4" dy="0" result="blueShift">
            <animate attributeName="dx" values="4;0;3;0" dur="0.16s" repeatCount="indefinite" />
          </feOffset>
          <feColorMatrix in="blueShift" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 0" result="blue" />
          <feMerge>
            <feMergeNode in="red" />
            <feMergeNode in="blue" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </svg>

      <header className="nav">
        <div className="logo">FLEX SUPPS</div>
        <nav className="center-nav" aria-label="Primary">
          <a href="#" data-nav="accueil">ACCUEIL</a>
          <a href="/shop" data-nav="boutique">BOUTIQUE</a>
          <a href="#" data-nav="apropos">A PROPOS</a>
        </nav>
        <div className="right-nav">
          <a href="#">LOGIN / REGISTER</a>
          <button className="icon-link" type="button" aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </button>
          <CartIcon />
        </div>
      </header>

      <div className="ghost-nav left">
        <button type="button" id="prevBtn" ref={prevBtnRef} aria-label="Previous slide" onClick={() => { const s = state.current; glitchTo((s.currentIndex - 1 + slides.length) % slides.length) }}>
          <span className="arrow-symbol">←</span>
        </button>
      </div>
      <div className="ghost-nav right">
        <button type="button" id="nextBtn" ref={nextBtnRef} aria-label="Next slide" onClick={() => { const s = state.current; glitchTo((s.currentIndex + 1) % slides.length) }}>
          <span className="arrow-symbol">→</span>
        </button>
      </div>

      <section className="stage" id="stage" aria-live="polite">
        <div className="title-stage">
          <div className="title-layer front">
            <TextAnimate by="character" once stagger={0.03} className="hero-animated-title">
              {slides[0]?.title}
            </TextAnimate>
          </div>
        </div>
      </section>

      <div className="cursor" id="cursor" ref={cursorRef} />
    </main>
  )
}
