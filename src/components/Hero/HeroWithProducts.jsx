import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import * as THREE from 'three'
import './HeroWithProducts.css'
import { slides, shoeMarkup } from '../../data/siteData'
import CartIcon from '../Cart/CartIcon'

gsap.registerPlugin(CustomEase)
CustomEase.create('heroEase', '0.22, 1, 0.36, 1')

// Escapes HTML special chars to prevent XSS when injecting into innerHTML
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function isWebGLSupported() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')))
  } catch {
    return false
  }
}

function parseRadialGradient(bgStr) {
  let centerX = 0.5
  let centerY = 0.5
  const centerMatch = bgStr.match(/circle\s+at\s+([\d\.]+)%\s+([\d\.]+)%/)
  if (centerMatch) {
    centerX = parseFloat(centerMatch[1]) / 100
    centerY = 1.0 - parseFloat(centerMatch[2]) / 100
  }

  const colors = []
  const offsets = []
  const colorStopRegex = /(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})\s+([\d\.]+)%/g
  let match
  while ((match = colorStopRegex.exec(bgStr)) !== null) {
    colors.push(new THREE.Color(match[1]))
    offsets.push(parseFloat(match[2]) / 100)
  }

  while (colors.length < 4) {
    colors.push(colors[colors.length - 1] || new THREE.Color('#000000'))
    offsets.push(1.0)
  }

  return {
    center: new THREE.Vector2(centerX, centerY),
    colors: colors.slice(0, 4),
    offsets: offsets.slice(0, 4)
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
  uniform float uTime;
  uniform float uProgress;
  uniform float uGlitch;
  uniform vec2 uResolution;
  
  uniform vec2 uPrevCenter;
  uniform vec3 uPrevC0;
  uniform vec3 uPrevC1;
  uniform vec3 uPrevC2;
  uniform vec3 uPrevC3;
  uniform vec4 uPrevOffsets;

  uniform vec2 uNextCenter;
  uniform vec3 uNextC0;
  uniform vec3 uNextC1;
  uniform vec3 uNextC2;
  uniform vec3 uNextC3;
  uniform vec4 uNextOffsets;

  varying vec2 vUv;

  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0) )
    + i.x + vec3(0.0, i1.x, 1.0) );
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0 ;
    vec3 h = abs(x) - 0.5 ;
    vec3 a0 = x - floor(x + 0.5);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  vec3 getGradient(vec2 uv, vec2 center, vec3 c0, vec3 c1, vec3 c2, vec3 c3, vec4 offsets) {
    // Ambient animation: slowly breathe the center position
    vec2 animCenter = center + vec2(
      sin(uTime * 0.22) * 0.03,
      cos(uTime * 0.18) * 0.02
    );
    vec2 aspectUV = (uv - animCenter) * vec2(uResolution.x / uResolution.y, 1.0);
    float dist = length(aspectUV);
    float scaledDist = dist * 0.75;
    
    if (scaledDist < offsets.y) {
      return mix(c0, c1, (scaledDist - offsets.x) / (offsets.y - offsets.x));
    } else if (scaledDist < offsets.z) {
      return mix(c1, c2, (scaledDist - offsets.y) / (offsets.z - offsets.y));
    } else {
      return mix(c2, c3, clamp((scaledDist - offsets.z) / (offsets.w - offsets.z), 0.0, 1.0));
    }
  }

  void main() {
    vec2 uv = vUv;
    
    if (uGlitch > 0.0) {
      float rows = 28.0;
      float rowId = floor(uv.y * rows);
      float randomShift = fract(sin(rowId * 123.456 + floor(uTime * 32.0)) * 43758.5453);
      if (randomShift > 0.85 - uGlitch * 0.12) {
        uv.x += (randomShift - 0.5) * 0.045 * uGlitch;
      }
    }

    float freq = 2.8;
    float warpStrength = sin(uProgress * 3.14159265);
    float amp = 0.35 * warpStrength;
    
    float t = uTime * 0.15;
    // Subtle ambient drift on the static gradient
    float ambientDrift = 0.018;
    float staticAmp = 0.025 + ambientDrift * (0.5 + 0.5 * sin(uTime * 0.3));
    
    float nX = snoise(uv * freq + vec2(t, uProgress * 1.5));
    float nY = snoise(uv * freq + vec2(uProgress * 1.5, t + 8.0));
    
    vec2 distUVPrev = uv + vec2(nX, nY) * (amp + staticAmp);
    vec2 distUVNext = uv - vec2(nX, nY) * (amp + staticAmp);
    
    float rShift = 0.012 * uGlitch;
    float bShift = -0.012 * uGlitch;

    vec2 rPrev = distUVPrev + vec2(rShift, 0.0);
    vec2 gPrev = distUVPrev;
    vec2 bPrev = distUVPrev + vec2(bShift, 0.0);

    float rPrevCol = getGradient(rPrev, uPrevCenter, uPrevC0, uPrevC1, uPrevC2, uPrevC3, uPrevOffsets).r;
    float gPrevCol = getGradient(gPrev, uPrevCenter, uPrevC0, uPrevC1, uPrevC2, uPrevC3, uPrevOffsets).g;
    float bPrevCol = getGradient(bPrev, uPrevCenter, uPrevC0, uPrevC1, uPrevC2, uPrevC3, uPrevOffsets).b;
    vec3 colorPrev = vec3(rPrevCol, gPrevCol, bPrevCol);

    vec2 rNext = distUVNext + vec2(rShift, 0.0);
    vec2 gNext = distUVNext;
    vec2 bNext = distUVNext + vec2(bShift, 0.0);

    float rNextCol = getGradient(rNext, uNextCenter, uNextC0, uNextC1, uNextC2, uNextC3, uNextOffsets).r;
    float gNextCol = getGradient(gNext, uNextCenter, uNextC0, uNextC1, uNextC2, uNextC3, uNextOffsets).g;
    float bNextCol = getGradient(bNext, uNextCenter, uNextC0, uNextC1, uNextC2, uNextC3, uNextOffsets).b;
    vec3 colorNext = vec3(rNextCol, gNextCol, bNextCol);

    float blendNoise = snoise(uv * 3.0 + vec2(0.0, uProgress * 2.0)) * 0.12;
    float mixFactor = clamp(uProgress + blendNoise * warpStrength, 0.0, 1.0);
    
    vec3 color = mix(colorPrev, colorNext, mixFactor);
    
    float bottomFade = smoothstep(0.35, 0.0, uv.y);
    color = mix(color, vec3(1.0, 1.0, 1.0), bottomFade * 0.95);
    
    gl_FragColor = vec4(color, 1.0);
  }
`

export default function HeroWithProducts() {
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
  const titleFrontRef = useRef(null)
  const titleBackRef = useRef(null)
  const shoeStageRef = useRef(null)
  const shoeFloatRef = useRef(null)
  const shoeBaseRef = useRef(null)
  const shoeTiltRef = useRef(null)
  const shoeMountRef = useRef(null)
  const infoSubRef = useRef(null)
  const infoKickerRef = useRef(null)
  const voirPlusRef = useRef(null)
  const dotsRef = useRef(null)

  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
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
    tilt: { x: 0, y: 0, ry: 0, rx: 0, scale: 1 },
    setTiltX: null,
    setTiltY: null,
    setTiltRX: null,
    setTiltRY: null,
  })

  const applyBackground = (slide, layer) => {
    if (!layer) return
    layer.className = 'bg-layer is-active'
    if (slide.backdrop) layer.classList.add(slide.backdrop)
    if (slide.backgroundOverlay) {
      layer.style.background = slide.backgroundOverlay + ', ' + slide.background
    } else {
      layer.style.background = slide.background
    }
  }

  const syncNav = (slide) => {
    document.querySelectorAll('.center-nav a').forEach((link) => {
      link.classList.toggle('active', link.dataset.nav === slide.nav)
    })
  }

  const syncCTA = (slide) => {
    if (!infoSubRef.current || !voirPlusRef.current || !infoKickerRef.current) return
    const key = slide.title.toLowerCase()
    
    infoKickerRef.current.textContent = t(`hero.slides.${key}.kicker`, slide.kicker)
    
    if (slide.infoSubHtml) {
      // infoSubHtml is internal-only markup from siteData.js — not user-controlled input
      infoSubRef.current.innerHTML = slide.infoSubHtml
    } else {
      infoSubRef.current.textContent = t(`hero.slides.${key}.subtitle`, slide.subtitle)
    }
    
    voirPlusRef.current.textContent = t(`hero.slides.${key}.cta`, slide.cta)
    voirPlusRef.current.href = slide.ctaHref
    voirPlusRef.current.classList.toggle('prominent', !!slide.ctaProminent)
  }

  const titleSpec = (slide) => {
    const letters = slide.title.split('')
    const visibleFront = slide.titleSplit?.front || []
    const visibleBack = slide.titleSplit?.back || []
    const outlines = slide.titleSplit?.outlines || []
    return letters.map((letter, index) => {
      const frontVisible = visibleFront.includes(index)
      const backVisible = visibleBack.includes(index)
      const outline = outlines.includes(index)
      return { letter, frontVisible, backVisible, outline }
    })
  }

  const buildTitleLayerHtml = (slide, layer) => {
    const isFront = layer === 'front'
    const isAr = i18n.language === 'ar'
    
    if (isAr) {
      if (!isFront) return '' // Do not render back/outline layers for cursive Arabic text
      const key = slide.title.toLowerCase()
      const translatedTitle = t(`hero.slides.${key}.title`, slide.title)
      return `<span class="letter solid" data-idx="0">${escHtml(translatedTitle)}</span>`
    }
    
    const spec = titleSpec(slide)
    return spec
      .map((item, index) => {
        const visible = isFront ? item.frontVisible : item.backVisible
        const visibilityClass = visible ? '' : 'hidden'
        const outlineClass = item.outline ? 'outline' : 'solid'
        return `<span class="letter ${outlineClass} ${visibilityClass}" data-idx="${index}">${escHtml(item.letter)}</span>`
      })
      .join('')
  }

  const applyTitle = (slide) => {
    if (!titleFrontRef.current || !titleBackRef.current) return
    const alignLeft = slide.titleStyle?.align === 'left'
    const styleStr = `top:${slide.titleStyle?.top || '58%'}; left:${slide.titleStyle?.left || '50%'}; width:${slide.titleStyle?.width || 'auto'}; justify-content:${alignLeft ? 'flex-start' : 'center'}; transform:${alignLeft ? 'translate(0, -50%)' : 'translate(-50%, -50%)'};`
    
    titleFrontRef.current.setAttribute('style', styleStr)
    titleBackRef.current.setAttribute('style', styleStr)
    
    // Add long-title class if character length is greater than 8
    const isLong = slide.title.length > 8
    titleFrontRef.current.className = `title-layer front${isLong ? ' long-title' : ''}`
    titleBackRef.current.className = `title-layer back${isLong ? ' long-title' : ''}`
    
    titleFrontRef.current.innerHTML = buildTitleLayerHtml(slide, 'front')
    titleBackRef.current.innerHTML = buildTitleLayerHtml(slide, 'back')
  }

  const applyShoe = (slide) => {
    if (!shoeStageRef.current || !shoeBaseRef.current || !shoeMountRef.current) return
    shoeStageRef.current.style.left = slide.shoeStyle?.left || '50%'
    shoeStageRef.current.style.top = slide.shoeStyle?.top || '50%'
    shoeStageRef.current.style.width = slide.shoeStyle?.width || '400px'
    shoeStageRef.current.style.height = slide.shoeStyle?.height || '400px'
    
    // On mobile, optimize product image scale
    const isMobile = window.innerWidth <= 768
    const isSmallMobile = window.innerWidth <= 520
    const baseScale = parseFloat(slide.shoeStyle?.scale || '1.0')
    
    // Slightly smaller mobile scale for Creatine (extra) and Protein (superfly) to prevent cramping
    const isSmallerOnMobile = slide.shoe === 'extra' || slide.shoe === 'superfly'
    const mobileReduction = isSmallerOnMobile 
      ? (isSmallMobile ? 0.70 : 0.76)
      : (isSmallMobile ? 0.85 : 0.90)
    
    const mobileScale = isMobile ? baseScale * mobileReduction : baseScale
    shoeBaseRef.current.style.transform = `rotate(${slide.shoeStyle?.baseRotate || '0deg'}) scale(${mobileScale})`

    
    const shoe = shoeMarkup[slide.shoe] || shoeMarkup.superfly
    shoeMountRef.current.innerHTML = `
      <img class="shoe-svg" src="${shoe.src}" alt="${shoe.alt}" style="${shoe.style || ''}" draggable="false" loading="eager" />
    `
  }

  const animateEntry = () => {
    const s = state.current
    const activeSlide = slides[s.currentIndex]
    if (!titleFrontRef.current || !titleBackRef.current || !infoKickerRef.current || !infoSubRef.current || !voirPlusRef.current || !shoeStageRef.current) return

    const frontLetters = Array.from(titleFrontRef.current.querySelectorAll('.letter'))
    const backLetters = Array.from(titleBackRef.current.querySelectorAll('.letter'))
    const allLetters = [...frontLetters, ...backLetters]

    const alignLeft = activeSlide.titleStyle?.align === 'left'
    const xPct = alignLeft ? 0 : -50
    const yPct = -50

    gsap.killTweensOf([allLetters, infoKickerRef.current, infoSubRef.current, voirPlusRef.current, shoeStageRef.current, titleFrontRef.current, titleBackRef.current])
    gsap.set([infoKickerRef.current, infoSubRef.current, voirPlusRef.current], { opacity: 0, y: 18 })
    gsap.set([titleBackRef.current, titleFrontRef.current], { x: 0, y: 0, xPercent: xPct, yPercent: yPct })
    
    if (activeSlide.shoe === 'superfly') {
      gsap.set(shoeStageRef.current, { opacity: 0, scale: 1.05, y: 600, x: 0, xPercent: -50, yPercent: -50 })
    } else {
      gsap.set(shoeStageRef.current, { opacity: 0, scale: 0.88, y: -72, x: -160, xPercent: -50, yPercent: -50 })
    }

    const entryTl = gsap.timeline()
    if (activeSlide.shoe === 'superfly') {
      entryTl.to(shoeStageRef.current, {
        opacity: 1,
        x: 0,
        y: 0,
        xPercent: -50,
        yPercent: -50,
        scale: 1,
        duration: 1.0,
        ease: 'power4.out',
      }, 0)
    } else {
      entryTl.to(shoeStageRef.current, {
        opacity: 1,
        x: 0,
        y: 0,
        xPercent: -50,
        yPercent: -50,
        scale: 1,
        duration: 0.78,
        ease: 'power3.out',
      }, 0)
    }

    const isAr = i18n.language === 'ar'
    const length = isAr ? 1 : activeSlide.title.length
    const duration = 0.7
    const ease = 'power3.out'
    const delayStart = activeSlide.shoe === 'superfly' ? 0.08 : 0.1

    for (let i = 0; i < length; i++) {
      const fl = frontLetters[i]
      const bl = backLetters[i]
      if (!fl || (!bl && !isAr)) continue

      const isFVisible = !fl.classList.contains('hidden')
      const isBVisible = !bl.classList.contains('hidden')
      const delay = delayStart + i * 0.035
      const opacityTargets = []

      if (isFVisible) opacityTargets.push(fl)
      if (isBVisible) opacityTargets.push(bl)
      if (!isBVisible) gsap.set(bl, { opacity: 0 })

      if (activeSlide.shoe === 'superfly') {
        if (isFVisible) gsap.set(fl, { opacity: 0, y: -200, x: 0 })
        else gsap.set(fl, { y: -200, x: 0 })
        if (bl) gsap.set(bl, { opacity: 0, y: -200, x: 0 })
      } else {
        if (isFVisible) gsap.set(fl, { opacity: 0, y: 0, x: -150 })
        else gsap.set(fl, { y: 0, x: -150 })
        if (bl) gsap.set(bl, { opacity: 0, y: 0, x: -150 })
      }

      const targets = bl ? [fl, bl] : [fl]
      entryTl.to(targets, { y: 0, x: 0, duration: duration, ease: ease }, delay)
      if (opacityTargets.length > 0) {
        entryTl.to(opacityTargets, { opacity: 1, duration: duration, ease: ease }, delay)
      }
    }

    entryTl.to([infoKickerRef.current, infoSubRef.current], {
      opacity: 1,
      y: 0,
      duration: 0.32,
      stagger: 0.1,
      ease: 'power2.out',
    }, 0.34)

    entryTl.to(voirPlusRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.42,
      ease: 'power2.out',
      letterSpacing: '0.22em',
    }, 0.44)

    gsap.set(voirPlusRef.current, { letterSpacing: activeSlide.ctaProminent ? '0.16em' : '0.22em' })
  }

  const spawnGlitchScanlines = () => {
    if (!glitchRef.current) return
    glitchRef.current.innerHTML = ''
    const lines = 10 + Math.floor(Math.random() * 6)
    for (let i = 0; i < lines; i++) {
      const line = document.createElement('div')
      line.className = 'scanline'
      line.style.top = `${Math.random() * 100}%`
      line.style.height = `${8 + Math.random() * 20}px`
      line.style.opacity = `${0.22 + Math.random() * 0.62}`
      line.style.transform = `translateX(${(Math.random() - 0.5) * 180}px)`
      line.style.background = `linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,${0.04 + Math.random() * 0.12}), rgba(255,255,255,0.02))`
      glitchRef.current.appendChild(line)
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

  const triggerGLTransition = (prevSlide, nextSlide) => {
    const s = state.current
    if (!s.isGLActive || !s.glMaterial) return

    const prevGrad = parseRadialGradient(prevSlide.background)
    const nextGrad = parseRadialGradient(nextSlide.background)

    s.glMaterial.uniforms.uPrevCenter.value.copy(prevGrad.center)
    s.glMaterial.uniforms.uPrevC0.value.copy(prevGrad.colors[0])
    s.glMaterial.uniforms.uPrevC1.value.copy(prevGrad.colors[1])
    s.glMaterial.uniforms.uPrevC2.value.copy(prevGrad.colors[2])
    s.glMaterial.uniforms.uPrevC3.value.copy(prevGrad.colors[3])
    s.glMaterial.uniforms.uPrevOffsets.value.set(...prevGrad.offsets)

    s.glMaterial.uniforms.uNextCenter.value.copy(nextGrad.center)
    s.glMaterial.uniforms.uNextC0.value.copy(nextGrad.colors[0])
    s.glMaterial.uniforms.uNextC1.value.copy(nextGrad.colors[1])
    s.glMaterial.uniforms.uNextC2.value.copy(nextGrad.colors[2])
    s.glMaterial.uniforms.uNextC3.value.copy(nextGrad.colors[3])
    s.glMaterial.uniforms.uNextOffsets.value.set(...nextGrad.offsets)

    s.glMaterial.uniforms.uProgress.value = 0.0
    gsap.killTweensOf(s.glMaterial.uniforms.uProgress)
    gsap.to(s.glMaterial.uniforms.uProgress, {
      value: 1.0,
      duration: 0.6,
      ease: 'power2.out'
    })

    s.glMaterial.uniforms.uGlitch.value = 1.0
    gsap.killTweensOf(s.glMaterial.uniforms.uGlitch)
    gsap.to(s.glMaterial.uniforms.uGlitch, {
      value: 0.0,
      duration: 1.2,
      ease: 'power2.out'
    })
  }

  const renderSlide = useCallback((index, immediate = false, skipEntry = false) => {
    const s = state.current
    const slide = slides[index]
    const oldSlide = slides[s.currentIndex]
    s.currentIndex = index

    applyTitle(slide)
    applyShoe(slide)
    syncNav(slide)
    syncCTA(slide)

    // Sync slide indicator dots
    if (dotsRef.current) {
      dotsRef.current.querySelectorAll('.slide-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index)
      })
    }

    if (immediate) {
      if (s.isGLActive && s.glMaterial) {
        const grad = parseRadialGradient(slide.background)
        s.glMaterial.uniforms.uPrevCenter.value.copy(grad.center)
        s.glMaterial.uniforms.uPrevC0.value.copy(grad.colors[0])
        s.glMaterial.uniforms.uPrevC1.value.copy(grad.colors[1])
        s.glMaterial.uniforms.uPrevC2.value.copy(grad.colors[2])
        s.glMaterial.uniforms.uPrevC3.value.copy(grad.colors[3])
        s.glMaterial.uniforms.uPrevOffsets.value.set(...grad.offsets)

        s.glMaterial.uniforms.uNextCenter.value.copy(grad.center)
        s.glMaterial.uniforms.uNextC0.value.copy(grad.colors[0])
        s.glMaterial.uniforms.uNextC1.value.copy(grad.colors[1])
        s.glMaterial.uniforms.uNextC2.value.copy(grad.colors[2])
        s.glMaterial.uniforms.uNextC3.value.copy(grad.colors[3])
        s.glMaterial.uniforms.uNextOffsets.value.set(...grad.offsets)

        s.glMaterial.uniforms.uProgress.value = 1.0
      } else {
        applyBackground(slide, s.activeBackground)
        s.activeBackground.classList.add('is-active')
        s.inactiveBackground.classList.remove('is-active')
        gsap.set(bgBRef.current, { opacity: 0 })
        gsap.set(bgARef.current, { opacity: 1 })
      }
      if (!skipEntry) animateEntry()
      return
    }

    if (s.isGLActive) {
      triggerGLTransition(oldSlide, slide)
    } else {
      applyBackground(slide, s.inactiveBackground)
      gsap.killTweensOf([s.activeBackground, s.inactiveBackground])
      gsap.set(s.inactiveBackground, { opacity: 0 })
      s.inactiveBackground.classList.add('is-active')
      gsap.to(s.inactiveBackground, { opacity: 1, duration: 1.6, ease: 'power2.out' })
      gsap.to(s.activeBackground, {
        opacity: 0,
        duration: 1.6,
        ease: 'power2.out',
        onComplete: () => { s.activeBackground.classList.remove('is-active') },
      })
      ;[s.activeBackground, s.inactiveBackground] = [s.inactiveBackground, s.activeBackground]
    }

    if (!skipEntry) {
      requestAnimationFrame(() => {
        animateEntry()
      })
    }
  }, []) // eslint-disable-line

  const scheduleAutoplay = useCallback(() => {
    const s = state.current
    clearTimeout(s.autoplay)
    if (s.paused || s.transitioning) return
    s.autoplay = setTimeout(() => {
      glitchTo((s.currentIndex + 1) % slides.length)
    }, 5600)
  }, []) // eslint-disable-line

  const glitchTo = useCallback((nextIndex) => {
    const s = state.current
    if (s.transitioning || nextIndex === s.currentIndex) return
    s.transitioning = true
    s.paused = true
    clearTimeout(s.autoplay)

    const isForward = nextIndex > s.currentIndex || (s.currentIndex === slides.length - 1 && nextIndex === 0)
    
    // Choose direction: left, right, up, down
    // We choose vertical 50% of the time, and horizontal 50% of the time
    const isVertical = Math.random() > 0.5
    let direction = 'left'
    if (isVertical) {
      direction = isForward ? 'up' : 'down'
    } else {
      direction = isForward ? 'left' : 'right'
    }

    let exitX = 0, exitY = 0, exitSkew = 0, exitSc = 0.55
    let entryX = 0, entryY = 0, entrySkew = 0
    let letterExitX = 0, letterExitY = 0
    let letterEntryX = 0, letterEntryY = 0
    let letterEntrySkew = 0

    if (direction === 'left') {
      exitX = -1600
      exitSkew = -28
      entryX = 1800
      entrySkew = 22
      letterExitX = -220
      letterEntryX = -180
      letterEntrySkew = 10
    } else if (direction === 'right') {
      exitX = 1600
      exitSkew = 28
      entryX = -1800
      entrySkew = -22
      letterExitX = 220
      letterEntryX = 180
      letterEntrySkew = -10
    } else if (direction === 'up') {
      exitY = -1200
      exitSkew = 0
      entryY = 1400
      entrySkew = 0
      letterExitY = -180
      letterEntryY = 150
      letterEntrySkew = 0
    } else if (direction === 'down') {
      exitY = 1200
      exitSkew = 0
      entryY = -1400
      entrySkew = 0
      letterExitY = 180
      letterEntryY = -150
      letterEntrySkew = 0
    }

    const activeSlide = slides[s.currentIndex]
    const alignLeft = activeSlide.titleStyle?.align === 'left'
    const xPct = alignLeft ? 0 : -50
    const yPct = -50

    s.glitchPower = 0.9
    spawnGlitchScanlines()
    heroRef.current.classList.add('is-glitching')

    // Hard CRT-like shake on titles
    gsap.to(titleFrontRef.current, {
      x: 14,
      skewX: 4,
      xPercent: xPct,
      yPercent: yPct,
      duration: 0.04,
      yoyo: true,
      repeat: 4,
      ease: 'none',
      onComplete: () => gsap.set(titleFrontRef.current, { x: 0, skewX: 0, xPercent: xPct, yPercent: yPct }),
    })
    gsap.to(titleBackRef.current, {
      x: -10,
      skewX: -4,
      xPercent: xPct,
      yPercent: yPct,
      duration: 0.04,
      yoyo: true,
      repeat: 4,
      ease: 'none',
      onComplete: () => gsap.set(titleBackRef.current, { x: 0, skewX: 0, xPercent: xPct, yPercent: yPct }),
    })

    // Slingshot leaving bottle off-screen
    if (shoeStageRef.current) {
      gsap.to(shoeStageRef.current, {
        x: exitX,
        y: exitY,
        scaleX: exitSc,
        scaleY: direction === 'up' || direction === 'down' ? exitSc : 1,
        skewX: exitSkew,
        opacity: 0,
        duration: 0.45,
        ease: 'power4.in',
      })
    }

    // Leaving letters scatter
    const leavingLetters = [
      ...titleBackRef.current.querySelectorAll('.letter:not(.hidden)'),
      ...titleFrontRef.current.querySelectorAll('.letter:not(.hidden)'),
    ]
    leavingLetters.sort((a, b) => parseInt(a.getAttribute('data-idx')) - parseInt(b.getAttribute('data-idx')))

    gsap.to(leavingLetters, {
      x: letterExitX,
      y: letterExitY,
      opacity: 0,
      duration: 0.30,
      stagger: 0.02,
      ease: 'power3.in',
    })

    const tl = gsap.timeline()
    tl.to(vhsRef.current, { opacity: 0.35, duration: 0.12, ease: 'none' }, 0.35)
    tl.to(vhsRef.current, { opacity: 0, duration: 0.55, ease: 'power2.out' }, 0.47)
    
    // Switch slide content at peak of flash
    tl.call(() => { 
      renderSlide(nextIndex, false, true) 
    }, null, 0.35)

    // New bottle crashes in with elastic settle
    tl.call(() => {
      if (!shoeStageRef.current) return
      gsap.killTweensOf(shoeStageRef.current)
      
      gsap.set(shoeStageRef.current, {
        x: entryX,
        y: entryY,
        scaleX: direction === 'up' || direction === 'down' ? 0.6 : 0.6,
        scaleY: direction === 'up' || direction === 'down' ? 0.6 : 1,
        skewX: entrySkew,
        opacity: 1,
        xPercent: -50,
        yPercent: -50,
      })

      gsap.to(shoeStageRef.current, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        opacity: 1,
        xPercent: -50,
        yPercent: -50,
        duration: 1.30,
        ease: 'back.out(1.8)',
      })
    }, null, 0.45)

    // Slam new letters in with rapid stagger
    tl.call(() => {
      if (!titleFrontRef.current || !titleBackRef.current) return
      const frontLetters = Array.from(titleFrontRef.current.querySelectorAll('.letter'))
      const backLetters = Array.from(titleBackRef.current.querySelectorAll('.letter'))
      const isAr = i18n.language === 'ar'
      const nextSlide = slides[nextIndex]
      const length = isAr ? 1 : nextSlide.title.length
      
      const allNewLetters = [...frontLetters, ...backLetters]
      gsap.killTweensOf(allNewLetters)

      for (let i = 0; i < length; i++) {
        const fl = frontLetters[i]
        const bl = backLetters[i]
        if (!fl || (!bl && !isAr)) continue

        const isFVisible = !fl.classList.contains('hidden')
        const isBVisible = bl ? !bl.classList.contains('hidden') : false

        const targets = bl ? [fl, bl] : [fl]
        const visibleTargets = []
        if (isFVisible) visibleTargets.push(fl)
        if (bl && isBVisible) visibleTargets.push(bl)

        const delay = i * 0.035

        gsap.set(targets, { 
          x: letterEntryX, 
          y: letterEntryY, 
          skewX: letterEntrySkew 
        })
        gsap.set(visibleTargets, { opacity: 0 })

        gsap.to(targets, {
          x: 0,
          y: 0,
          skewX: 0,
          duration: 0.90,
          ease: 'power3.out',
          delay: delay,
        })

        if (visibleTargets.length > 0) {
          gsap.to(visibleTargets, {
            opacity: 1,
            duration: 0.90,
            ease: 'power3.out',
            delay: delay,
          })
        }
      }

      // Info block rises in
      if (infoKickerRef.current && infoSubRef.current && voirPlusRef.current) {
        gsap.set([infoKickerRef.current, infoSubRef.current, voirPlusRef.current], { opacity: 0, y: 18 })
        gsap.to([infoKickerRef.current, infoSubRef.current], {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.16,
          delay: 0.25,
          ease: 'power2.out',
        })
        gsap.to(voirPlusRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          delay: 0.45,
          ease: 'power2.out',
        })
      }
    }, null, 0.55)

    tl.call(() => {
      s.glitchPower = 0
      heroRef.current.classList.remove('is-glitching')
      s.transitioning = false
      s.paused = false
      scheduleAutoplay()
    }, null, 2.20)
  }, [renderSlide, scheduleAutoplay])

  useEffect(() => {
    const s = state.current
    s.activeBackground = bgARef.current
    s.inactiveBackground = bgBRef.current
    s.cursorTarget.x = window.innerWidth / 2
    s.cursorTarget.y = window.innerHeight / 2
    s.cursorPos.x = s.cursorTarget.x
    s.cursorPos.y = s.cursorTarget.y

    const isMobileDevice = () => window.innerWidth <= 768 || window.matchMedia('(hover: none) and (pointer: coarse)').matches
    const isMobile = isMobileDevice()

    let rafGrain
    if (!isMobile && grainRef.current) {
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
    } else {
      if (grainRef.current) grainRef.current.style.display = 'none'
    }

    let cancelled = false
    let rafGL = 0
    let onResize = null

    if (!isMobile) {
      ;(async () => {
        try {
          if (!isWebGLSupported()) return

          const canvas = glCanvasRef.current
          const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
          })
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
          renderer.setSize(window.innerWidth, window.innerHeight)
          s.glRenderer = renderer
          s.isGLActive = true

          if (bgARef.current) bgARef.current.style.display = 'none'
          if (bgBRef.current) bgBRef.current.style.display = 'none'

          const scene = new THREE.Scene()
          const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

          const slide = slides[s.currentIndex]
          const initialGrad = parseRadialGradient(slide.background)

          const mat = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
              uTime: { value: 0 },
              uProgress: { value: 1.0 },
              uGlitch: { value: 0.0 },
              uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
              
              uPrevCenter: { value: initialGrad.center },
              uPrevC0: { value: initialGrad.colors[0] },
              uPrevC1: { value: initialGrad.colors[1] },
              uPrevC2: { value: initialGrad.colors[2] },
              uPrevC3: { value: initialGrad.colors[3] },
              uPrevOffsets: { value: new THREE.Vector4(...initialGrad.offsets) },

              uNextCenter: { value: initialGrad.center },
              uNextC0: { value: initialGrad.colors[0] },
              uNextC1: { value: initialGrad.colors[1] },
              uNextC2: { value: initialGrad.colors[2] },
              uNextC3: { value: initialGrad.colors[3] },
              uNextOffsets: { value: new THREE.Vector4(...initialGrad.offsets) }
            },
            depthWrite: false,
            depthTest: false,
          })
          s.glMaterial = mat
          scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat))

          canvas.classList.add('is-ready')
          renderSlide(s.currentIndex, true, true)

          const clock = new THREE.Clock()
          function animateGL() {
            if (cancelled) return
            rafGL = requestAnimationFrame(animateGL)
            mat.uniforms.uTime.value = clock.getElapsedTime()
            renderer.render(scene, camera)
          }
          animateGL()

          onResize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            mat.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
          }
          window.addEventListener('resize', onResize)
        } catch (err) {
          console.warn('Hero shader background initialization failed. Falling back to CSS backgrounds.', err)
        }
      })()
    } else {
      if (glCanvasRef.current) glCanvasRef.current.style.display = 'none'
      renderSlide(s.currentIndex, true, true)
    }

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

    const isTouchDevice = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (cursorRef.current && isTouchDevice()) {
      cursorRef.current.style.display = 'none'
    }

    function animateCursor() {
      cursorPos.x += (cursorTarget.x - cursorPos.x) * 0.15
      cursorPos.y += (cursorTarget.y - cursorPos.y) * 0.15
      if (cursorRef.current && !isTouchDevice()) {
        cursorRef.current.style.transform = `translate(${cursorPos.x}px,${cursorPos.y}px) translate(-50%,-50%)`
      }
      rafCursor = requestAnimationFrame(animateCursor)
    }
    animateCursor()

    const hero = heroRef.current
    const onMouseMove = (e) => {
      if (isTouchDevice()) return
      const rect = hero.getBoundingClientRect()
      const over = e.clientY >= rect.top && e.clientY <= rect.bottom && e.clientX >= rect.left && e.clientX <= rect.right
      if (cursorRef.current) cursorRef.current.style.display = over ? 'block' : 'none'
      cursorTarget.x = e.clientX
      cursorTarget.y = e.clientY
    }
    const onEnter = () => {
      s.paused = true
      clearTimeout(s.autoplay)
      if (cursorRef.current && !isTouchDevice()) cursorRef.current.style.display = 'block'
    }
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

    // Nav hover triggers magnet effect (matches Testhero.html)
    const navs = [
      { container: document.querySelector('.ghost-nav.left'), btn: prevBtnRef.current, symbol: document.querySelector('.ghost-nav.left .arrow-symbol') },
      { container: document.querySelector('.ghost-nav.right'), btn: nextBtnRef.current, symbol: document.querySelector('.ghost-nav.right .arrow-symbol') },
    ]
    navs.forEach(({ container, btn, symbol }) => {
      if (!container || !btn || !symbol) return
      const resetNav = () => {
        gsap.to(container, { x: 0, y: 0, scale: 1, borderColor: 'rgba(255,255,255,.14)', backgroundColor: 'rgba(255,255,255,0)', duration: 0.8, ease: 'elastic.out(1.1,.6)' })
        gsap.to(symbol, { x: 0, y: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1.1,.6)' })
      }
      btn.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect()
        const dX = e.clientX - (rect.left + rect.width / 2)
        const dY = e.clientY - (rect.top + rect.height / 2)
        gsap.to(container, { x: dX * 0.15, y: dY * 0.15, scale: 2.2, borderColor: 'rgba(255,255,255,.45)', backgroundColor: 'rgba(255,255,255,.04)', duration: 0.3, ease: 'power2.out' })
        gsap.to(symbol, { x: dX * 0.32, y: dY * 0.32, scale: 1.15, duration: 0.3, ease: 'power2.out' })
      })
      btn.addEventListener('mouseleave', resetNav)
      btn.addEventListener('click', resetNav)
    })

    // Float timeline
    if (shoeFloatRef.current) {
      if (s.floatTl) s.floatTl.kill()
      s.floatTl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } })
      s.floatTl.to(shoeFloatRef.current, { y: -20, rotationZ: 1.5, duration: 3.2 }, 0)
    }

    // Tilt handlers
    const applyTilt = () => {
      if (!shoeTiltRef.current) return
      const t = s.tilt
      shoeTiltRef.current.style.transform = `translate3d(${t.x}px, ${t.y}px, 0px) rotateY(${t.ry}deg) rotateX(${t.rx}deg) scale(${t.scale})`
    }

    s.setTiltX = gsap.quickTo(s.tilt, 'x', { duration: 0.6, ease: 'power2.out', onUpdate: applyTilt })
    s.setTiltY = gsap.quickTo(s.tilt, 'y', { duration: 0.6, ease: 'power2.out', onUpdate: applyTilt })
    s.setTiltRY = gsap.quickTo(s.tilt, 'ry', { duration: 0.7, ease: 'power2.out', onUpdate: applyTilt })
    s.setTiltRX = gsap.quickTo(s.tilt, 'rx', { duration: 0.7, ease: 'power2.out', onUpdate: applyTilt })

    const onHeroMove = (e) => {
      if (isTouchDevice()) return
      const rect = hero.getBoundingClientRect()
      const dX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
      const dY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
      s.setTiltX(dX * 18)
      s.setTiltY(dY * 10)
      s.setTiltRY(dX * 8)
      s.setTiltRX(-dY * 6)
    }

    const onHeroLeave = () => {
      s.setTiltX(0)
      s.setTiltY(0)
      s.setTiltRY(0)
      s.setTiltRX(0)
    }

    hero.addEventListener('mousemove', onHeroMove)
    hero.addEventListener('mouseleave', onHeroLeave)

    scheduleAutoplay()
    return () => {
      cancelAnimationFrame(rafCursor)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('keydown', onKey)
      hero.removeEventListener('mouseenter', onEnter)
      hero.removeEventListener('mouseleave', onLeave)
      hero.removeEventListener('mousemove', onHeroMove)
      hero.removeEventListener('mouseleave', onHeroLeave)
      if (s.floatTl) s.floatTl.kill()
    }
  }, [renderSlide, glitchTo, scheduleAutoplay])

  const handleHeroClick = (event) => {
    if (event.target.closest('a, button, input, textarea, select')) return
    const currentSlide = state.current.currentIndex
    if (currentSlide === 0) {
      navigate('/shop?category=whey')
    } else if (currentSlide === 1) {
      navigate('/shop?category=bcaa')
    } else if (currentSlide === 2) {
      navigate('/shop?category=whey')
    } else if (currentSlide === 3) {
      navigate('/shop?category=creatine')
    }
  }

  return (
    <main className="hero hero-with-products" id="hero" ref={heroRef} onClick={handleHeroClick}>
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
          <a href="#" data-nav="accueil">{t('nav.home').toUpperCase()}</a>
          <a href="/shop" data-nav="boutique">{t('nav.shop').toUpperCase()}</a>
          <a href="#" data-nav="apropos">{t('nav.about').toUpperCase()}</a>
        </nav>
        <div className="right-nav">
          <a href="#">{t('hero.login').toUpperCase()}</a>
          <CartIcon />
        </div>
      </header>

      <div className="ghost-nav left">
        <button type="button" id="prevBtn" ref={prevBtnRef} aria-label="Previous slide" onClick={() => glitchTo((state.current.currentIndex - 1 + slides.length) % slides.length)}>
          <span className="arrow-symbol">←</span>
        </button>
      </div>
      <div className="ghost-nav right">
        <button type="button" id="nextBtn" ref={nextBtnRef} aria-label="Next slide" onClick={() => glitchTo((state.current.currentIndex + 1) % slides.length)}>
          <span className="arrow-symbol">→</span>
        </button>
      </div>

      <section className="stage" id="stage" aria-live="polite">
        <div className="title-stage">
          <div className="title-layer back" ref={titleBackRef} />
          <div className="title-layer front" ref={titleFrontRef} />
        </div>

        <div className="shoe-stage" ref={shoeStageRef}>
          <div className="shoe-shadow" />
          <div className="shoe-float" ref={shoeFloatRef}>
            <div className="shoe-base" ref={shoeBaseRef}>
              <div className="shoe-tilt" ref={shoeTiltRef}>
                <div id="shoeSvgMount" className="shoe-media-mount" ref={shoeMountRef} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        <div className="info-block">
          <div className="info-line kicker" ref={infoKickerRef}>HIGH QUALITY</div>
          <div className="info-line sub" ref={infoSubRef}>Premium Whey Formula</div>
          <a className="voir-plus info-line" ref={voirPlusRef} href="#">voir plus</a>
        </div>
      </section>

      {/* Slide indicator dots */}
      <div className="slide-dots" ref={dotsRef} role="tablist" aria-label="Slide indicators">
        {slides.map((slide, i) => (
          <button
            key={i}
            type="button"
            className={`slide-dot${i === 0 ? ' active' : ''}`}
            data-index={i}
            role="tab"
            aria-label={`Go to ${slide.title}`}
            onClick={() => glitchTo(i)}
          />
        ))}
      </div>

      <div className="cursor" id="cursor" ref={cursorRef} />
    </main>
  )
}
