import React from 'react'

export function ScrollVelocityContainer({ children, className = '' }) {
  return (
    <div className={`scroll-velocity-container ${className}`.trim()}>
      {children}
    </div>
  )
}

export function ScrollVelocityRow({ children, baseVelocity = 20, direction = 1, className = '' }) {
  // Map baseVelocity to animation duration (lower velocity -> longer duration)
  // Duration in seconds. We use a simple inverse mapping scaled for visible slowdown.
  const duration = Math.round(200 / Math.max(1, baseVelocity))
  const dirClass = direction >= 0 ? 'sv-row-left' : 'sv-row-right'

  return (
    <div className={`sv-row ${dirClass} ${className}`.trim()}>
      <div className="sv-track" style={{ animationDuration: `${duration}s` }}>
        <div className="sv-inner">{children}</div>
        <div className="sv-inner" aria-hidden="true">{children}</div>
      </div>
    </div>
  )
}

export default ScrollVelocityContainer
