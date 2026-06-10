import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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
  showInCatalog: boolean
  showInNew: boolean
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

export function useStoreData(): UseStoreDataResult {
  const [data, setData] = useState<StoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    async function fetchAll() {
      try {
        const [
          { data: products, error: pErr },
          { data: categories, error: cErr },
          { data: brands, error: bErr },
        ] = await Promise.all([
          supabase.from('products').select('*').order('created_at', { ascending: true }),
          supabase.from('categories').select('*'),
          supabase.from('brands').select('*').order('name'),
        ])

        if (pErr) throw pErr
        if (cErr) throw cErr
        if (bErr) throw bErr

        // Map DB snake_case to camelCase and normalize flavors
        const mappedProducts = (products || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          category: p.category,
          tags: p.tags || [],
          description: p.description || '',
          flavors: (p.flavors || []).map((f: any) => {
            if (typeof f === 'string') return { name: f, color: FLAVOR_COLOR_MAP[f] ?? '#777777' }
            return f
          }),
          sizes: p.sizes || [],
          price: p.price,
          oldPrice: p.old_price ?? null,
          currency: p.currency || 'DA',
          inStock: p.in_stock,
          badge: p.badge ?? null,
          featured: p.featured || false,
          showInCatalog: p.show_in_catalog !== false, // default true
          showInNew: p.show_in_new === true
            // fallback: if show_in_new column doesn't exist in DB yet, use badge
            || (p.show_in_new == null && p.badge === 'NOUVEAU'),
          image: p.image || '',
          imageHover: p.image_hover || '',
          href: p.href || '#',
        }))

        setData({
          products: mappedProducts,
          categories: categories || [],
          brands: (brands || []).map((b: any) => ({
            name: b.name,
            href: b.href || '#',
            logo: b.logo || '',
          })),
        })
        setLoading(false)
      } catch (err: any) {
        // Fallback to products.json if Supabase fails
        console.warn('[useStoreData] Supabase failed, falling back to products.json', err)
        fetch('/data/products.json')
          .then((r) => r.json())
          .then((json) => {
            const normalizeFlavor = (item: string | Flavor): Flavor => {
              if (typeof item === 'string') {
                return { name: item, color: FLAVOR_COLOR_MAP[item] ?? '#777777' }
              }
              return item
            }
            setData({
              ...json,
              products: json.products.map((p: any) => ({
                ...p,
                flavors: (p.flavors ?? []).map(normalizeFlavor),
              })),
            })
            setLoading(false)
          })
          .catch((e: Error) => {
            setError(e.message)
            setLoading(false)
          })
      }
    }
    fetchAll()
  }, [])

  return { data, loading, error }
}
