import { cn } from '../../lib/utils'

export function StripedPattern({ className, ...props }) {
  return (
    <svg
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full',
        className
      )}
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
