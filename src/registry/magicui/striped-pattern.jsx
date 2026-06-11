export function StripedPattern({ className, ...props }) {
  return (
    <svg
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        inset: 0,
        height: '100%',
        width: '100%',
      }}
      className={className}
      {...props}
    >
      <defs>
        <pattern
          id="striped-pattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
        >
          <rect width="20" height="40" fill="currentColor" fillOpacity="0.08" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#striped-pattern)" />
    </svg>
  )
}
