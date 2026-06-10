import { useState, useEffect } from 'react'

// ── Types ────────────────────────────────────────────────────

export interface Brand {
  name: string
  href: string
  logo: string
}

export interface Flavor {
  name: string
  color: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  href: string
}

export interface Product {
  id: string
  name: string
  brand: string
  category: string
  tags: string[]
  description: string
  flavors: Flavor[]
  sizes: string[]
  price: number
  oldPrice: number | null
  currency: string
  inStock: boolean
  badge: string | null
  featured: boolean
  image: string
  imageHover: string
  href: string
}

export interface StoreData {
  brands: Brand[]
  categories: Category[]
  products: Product[]
}

export interface UseStoreDataResult {
  data: StoreData | null
  loading: boolean
  error: string | null
}

// ── Hook ─────────────────────────────────────────────────────

/**
 * Fetches store data from /data/products.json (served from /public).
 * Returns { data, loading, error }.
 *
 * To update products, categories or brands, edit:
 *   public/data/products.json
 */
export function useStoreData(): UseStoreDataResult {
  const [data, setData]       = useState<StoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const FLAVOR_COLOR_MAP: Record<string, string> = {
    'Chocolat': '#3d1c02',
    'Vanille': '#f5e6c8',
    'Fraise': '#e8a0a0',
    'Cookies & Cream': '#d0c0b2',
    'Chocolat Noir': '#2b1308',
    'Caramel Salé': '#d6a45c',
    'Citron': '#f4e34e',
    'Pastèque': '#f49da6',
    'Mangue': '#f4ab21',
    'Fruit de la Passion': '#f3be4e',
    'Orange': '#f17b0f',
    'Cerise': '#8c1d25',
    'Cerise Explosive': '#a12a2d',
    'Tropical': '#f6c866',
    'Fraise Kiwi': '#ffd7d0',
    'Non aromatisé': '#8f8f8f',
    'Ananas': '#fbe38a',
    'Citron Vert': '#b8d85a',
    'Raisin': '#7d3d7b',
    'Banane': '#d6c04a',
  }

  const normalizeFlavor = (item: string | Flavor): Flavor => {
    if (typeof item === 'string') {
      return {
        name: item,
        color: FLAVOR_COLOR_MAP[item] ?? '#777777',
      }
    }
    return item
  }

  useEffect(() => {
    fetch('/data/products.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load products.json (${res.status})`)
        return res.json() as Promise<StoreData>
      })
      .then((json) => {
        const converted = {
          ...json,
          products: json.products.map((product) => ({
            ...product,
            flavors: product.flavors?.map(normalizeFlavor) ?? [],
          })),
        }
        setData(converted)
        setLoading(false)
      })
      .catch((err: Error) => {
        console.error('[useStoreData]', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { data, loading, error }
}
