/**
 * ShinyButton — MagicUI Registry Component
 * A button with an animated shine sweep on hover using a CSS-only approach.
 * Can be used as a wrapper component OR the shine effect is applied globally
 * to .btn via global.css.
 */
import { cn } from '../../lib/utils'

export function ShinyButton({ children, className = '', as: Tag = 'button', ...props }) {
  return (
    <Tag className={cn('shiny-btn', className)} {...props}>
      {children}
    </Tag>
  )
}
