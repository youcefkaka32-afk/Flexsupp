/**
 * Formats a numeric price + currency code into a display string.
 * formatPrice(8500, 'DA') → '8 500 DA'
 */
export function formatPrice(amount: number | null | undefined, currency = 'DA'): string | null {
  if (amount == null) return null
  return `${Number(amount).toLocaleString('fr-DZ')} ${currency}`
}

/**
 * Groups a products array by category id.
 * Returns { [categoryId]: Product[] }
 */
export function groupByCategory<T extends { category: string }>(
  products: T[] = []
): Record<string, T[]> {
  return products.reduce<Record<string, T[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {})
}

/**
 * Computes a discount percentage string from two prices.
 * calcDiscount(8500, 9800) → '-13%'
 * Returns null when no old price is provided.
 */
export function calcDiscount(price: number, oldPrice: number | null | undefined): string | null {
  if (oldPrice == null || oldPrice <= 0) return null
  return `-${Math.round((1 - price / oldPrice) * 100)}%`
}

/**
 * Simple `cn` utility to merge class names.
 * Accepts strings, falsy values, and arrays.
 */
export function cn(...inputs: Array<any>): string {
  return inputs
    .flat()
    .filter(Boolean)
    .map((i) => String(i))
    .join(' ')
}
