# Mobile Hero Image Implementation

## Overview
Implemented mobile-specific hero image (`HEROIMAGEMOBILE.jpg`) for the home page Hero component to provide an optimized viewing experience on mobile devices.

---

## Changes Made

### 1. **Site Data Configuration** (`src/data/siteData.js`)

Added mobile image constant and `imageMobile` property to the first slide:

```javascript
const heroMainImage = '/images/HEROMAINIMAGElol.png'
const heroMainImageMobile = '/HEROIMAGEMOBILE.jpg'  // NEW

export const slides = [
  {
    nav: 'accueil',
    title: '',
    subtitle: 'DECOUVRE LA LIGNE PHARE',
    cta: 'VOIR PLUS',
    ctaHref: '/shop',
    ctaProminent: true,
    goal: 'muscle',
    image: heroMainImage,
    imageMobile: heroMainImageMobile,  // NEW - Mobile variant
    // ... rest of slide config
  },
  // ... other slides
]
```

**Note**: Only the first slide has a mobile image variant. Other slides will continue using their desktop images on mobile.

---

### 2. **Hero Component Updates** (`src/components/Hero/Hero.jsx`)

#### A. Updated CSS Background Fallback Function

Modified `applyBackground()` to detect mobile devices and use the mobile image:

```javascript
const applyBackground = (slide, layer) => {
  // ... existing code ...
  
  // Use mobile image if available and on mobile device
  const isMobile = window.innerWidth <= 768
  const imageToUse = isMobile && slide.imageMobile ? slide.imageMobile : slide.image
  
  layer.style.backgroundImage = `
    linear-gradient(...),
    linear-gradient(...),
    url("${imageToUse}")  // Uses mobile image when appropriate
  `
  // ... rest of function
}
```

#### B. Updated WebGL Texture Loading

Modified the texture preloading to use mobile images when on mobile devices:

```javascript
;(async () => {
  try {
    // Check if mobile device
    const isMobile = window.innerWidth <= 768
    
    // Load textures - use mobile image if available and on mobile device
    const textureEntries = await Promise.all(slides.map(async (slide) => {
      const imageToUse = isMobile && slide.imageMobile ? slide.imageMobile : slide.image
      return [slide.image, await loadTexture(imageToUse)]
    }))
    
    // ... rest of texture loading
  }
})()
```

---

## How It Works

### Detection Logic
- **Breakpoint**: `window.innerWidth <= 768px`
- If on mobile AND slide has `imageMobile` property → use mobile image
- Otherwise → use default desktop `image`

### Image Fallback
1. **Primary**: WebGL shader with loaded textures
2. **Fallback**: CSS background-image (for browsers without WebGL)
3. Both methods now support mobile image variants

---

## Benefits

### 1. **Performance**
- Mobile-optimized images are typically:
  - Smaller file size
  - Better aspect ratio for portrait/mobile screens
  - Faster loading on mobile networks

### 2. **Visual Quality**
- Better composition for smaller screens
- Key elements properly positioned for mobile viewports
- Improved readability of overlaid text

### 3. **Responsive Design**
- Seamless image switching based on device width
- No duplicate image loading
- Works with both WebGL and CSS fallback rendering

---

## File Locations

- **Desktop Hero Image**: `/images/HEROMAINIMAGElol.png`
- **Mobile Hero Image**: `/HEROIMAGEMOBILE.jpg` (root public folder)
- **Configuration**: `src/data/siteData.js`
- **Component Logic**: `src/components/Hero/Hero.jsx`

---

## Adding Mobile Images to Other Slides

To add mobile variants to other slides in the carousel:

1. Add your mobile image to the project (preferably in `/images/`)
2. Define a constant in `siteData.js`:
   ```javascript
   const c4ImageMobile = '/images/c4_mobile.jpg'
   ```
3. Add `imageMobile` property to the slide:
   ```javascript
   {
     title: 'C4 SPORT',
     image: c4Image,
     imageMobile: c4ImageMobile,  // Add this line
     // ... rest of config
   }
   ```

The Hero component will automatically detect and use it on mobile devices!

---

## Testing Recommendations

1. **Desktop**: Verify desktop image loads at widths > 768px
2. **Mobile**: Verify mobile image loads at widths ≤ 768px
3. **Resize**: Test browser resize to ensure correct image switches
4. **WebGL Off**: Test with WebGL disabled (CSS fallback should work)
5. **Network**: Check mobile image file size is optimized

---

## Notes

- Mobile detection happens at page load for texture preloading
- CSS fallback checks viewport width dynamically
- Mobile image is optional - slides without `imageMobile` will use desktop image
- Breakpoint can be adjusted if needed (currently 768px)

---

**Status**: ✅ Complete and ready for testing
