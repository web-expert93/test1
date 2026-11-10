import { products } from './products.ts'
export type CartLine = { id: string; variant: string; quantity: number }
export function updateCart(cart: CartLine[], id: string, variant: string, delta: number): CartLine[] {
  const product = products.find(p => p.id === id)
  if (!product || (product.variants ? !product.variants.includes(variant) : variant !== '')) return cart
  const existing = cart.find(p => p.id === id && p.variant === variant)
  const otherQuantity = cart.filter(p => p.id === id && p.variant !== variant).reduce((n, p) => n + p.quantity, 0)
  const quantity = Math.max(0, Math.min(product.stock - otherQuantity, (existing?.quantity ?? 0) + delta))
  if (!existing) return quantity ? [...cart, { id, variant, quantity }] : cart
  return cart.map(p => p === existing ? { ...p, quantity } : p).filter(p => p.quantity > 0)
}
export const cartTotal = (cart: CartLine[]) => cart.reduce((total, line) => total + (products.find(p => p.id === line.id)?.price ?? 0) * line.quantity, 0)
export function restoreCart(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return []
  return value.reduce<CartLine[]>((cart, line) => {
    if (!line || typeof line.id !== 'string' || typeof line.variant !== 'string' || !Number.isSafeInteger(line.quantity) || line.quantity < 1) return cart
    return updateCart(cart, line.id, line.variant, line.quantity)
  }, [])
}
