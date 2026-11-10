export type Language = 'en' | 'bn'
export type Category = 'Electronics' | 'Fashion' | 'Home' | 'Beauty' | 'Lifestyle'
export type Product = {
  id: string; brand: string; name: string; bn: string; category: Category;
  price: number; original?: number; image: string; rating: string; reviews: string;
  badge?: string; variants?: string[]; stock: number;
}

// Entire catalogue, prices, ratings, stock and sales are demonstration fixtures.
export const products: Product[] = [
  { id: 'headphones', brand: 'NOVA SOUND', name: 'Studio Wireless Headphones', bn: 'স্টুডিও ওয়্যারলেস হেডফোন', category: 'Electronics', price: 3450, original: 4900, image: 'headphones', rating: '4.8', reviews: '1.2k', stock: 12 },
  { id: 'knitwear', brand: 'THE EVERYDAY EDIT', name: 'Essential Cable-knit Sweater', bn: 'কেবল নিট সোয়েটার', category: 'Fashion', price: 1790, original: 2490, image: 'knitwear', rating: '4.9', reviews: '248', variants: ['S', 'M', 'L', 'XL'], stock: 8 },
  { id: 'serum', brand: 'BOTANICA', name: 'Daily Glow Botanical Serum', bn: 'ডেইলি গ্লো বোটানিক্যাল সিরাম', category: 'Beauty', price: 890, original: 1250, image: 'serum', rating: '4.7', reviews: '326', stock: 3 },
  { id: 'ceramics', brand: 'SLOW LIVING', name: 'Everyday Stoneware Collection', bn: 'এভরিডে স্টোনওয়্যার কালেকশন', category: 'Home', price: 1250, image: 'ceramics', rating: '4.8', reviews: '182', badge: 'NEW', stock: 16 },
  { id: 'earbuds', brand: 'NOVA SOUND', name: 'Air Mini Wireless Earbuds', bn: 'এয়ার মিনি ওয়্যারলেস ইয়ারবাড', category: 'Electronics', price: 1490, original: 2290, image: 'earbuds', rating: '4.6', reviews: '864', stock: 18 },
  { id: 'bag', brand: 'FIELD & FORM', name: 'The Everyday Carry Backpack', bn: 'এভরিডে ব্যাকপ্যাক', category: 'Lifestyle', price: 2290, original: 2990, image: 'bag', rating: '4.8', reviews: '192', stock: 9 },
  { id: 'watch', brand: 'HOUR & HAND', name: 'Minimal Classic Leather Watch', bn: 'ক্লাসিক লেদার ঘড়ি', category: 'Lifestyle', price: 2790, image: 'watch', rating: '4.9', reviews: '204', stock: 6 },
  { id: 'panjabi', brand: 'NOVA HERITAGE', name: 'Festive Cotton Panjabi', bn: 'উৎসবের কটন পাঞ্জাবি', category: 'Fashion', price: 1990, original: 2790, image: 'panjabi', rating: '4.8', reviews: '376', variants: ['S', 'M', 'L', 'XL'], stock: 10 },
  { id: 'phone', brand: 'NOVA TECH', name: 'Everyday Smartphone · 128 GB', bn: 'এভরিডে স্মার্টফোন · ১২৮ জিবি', category: 'Electronics', price: 24990, original: 28990, image: 'phone', rating: '4.7', reviews: '512', stock: 7 },
]

export const categoryNames: Record<Category, string> = {
  Electronics: 'ইলেকট্রনিক্স', Fashion: 'ফ্যাশন', Home: 'ঘর ও জীবন', Beauty: 'বিউটি', Lifestyle: 'লাইফস্টাইল',
}
export const productName = (product: Product, lang: Language) => lang === 'bn' ? product.bn : product.name
export const price = (value: number, lang: Language = 'en') => `৳${new Intl.NumberFormat(lang === 'bn' ? 'bn-BD' : 'en-IN').format(value)}`
export function searchProducts(query: string, category = 'All') {
  const normalized = query.trim().toLocaleLowerCase()
  return products.filter(p => (category === 'All' || p.category === category) && `${p.name} ${p.bn} ${p.brand} ${p.category}`.toLocaleLowerCase().includes(normalized))
}
