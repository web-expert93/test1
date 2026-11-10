import { Check, Heart, Plus, ShoppingBag, Star, Truck } from 'lucide-react'
import { price, productName, type Language, type Product } from '../data/products'

export function ProductImage({ image, alt, className = '', eager = false }: { image: string; alt: string; className?: string; eager?: boolean }) {
  return <picture className={className}><source type="image/avif" srcSet={`/images/${image}-320.avif 320w, /images/${image}-640.avif 640w`} sizes="(max-width: 640px) 170px, 260px" /><img src={`/images/${image}-640.webp`} srcSet={`/images/${image}-320.webp 320w, /images/${image}-640.webp 640w`} sizes="(max-width: 640px) 170px, 260px" alt={alt} loading={eager ? 'eager' : 'lazy'} width="640" height="800" decoding="async" /></picture>
}

type Props = { product: Product; lang: Language; wished: boolean; onWish: (id: string) => void; onAdd: (p: Product) => void; onOpen: (p: Product) => void; compact?: boolean; rank?: number; addedId?: string }
export function ProductCard({ product: p, lang, wished, onWish, onAdd, onOpen, compact, rank, addedId }: Props) {
  const name = productName(p, lang)
  const discount = p.original ? Math.round((1 - p.price / p.original) * 100) : 0
  return <article className={`product-card ${compact ? 'compact' : ''}`}>
    <div className="product-visual">
      <a href={`#product-${p.id}`} onClick={event => { event.preventDefault(); onOpen(p) }} aria-label={`${name}, ${price(p.price, lang)}${p.original ? `, ${lang === 'en' ? 'was' : 'আগে'} ${price(p.original, lang)}` : ''}`} className="product-link"><ProductImage image={p.image} alt={name} /></a>
      <div className="product-badges">{rank ? <span className="badge rank">#{rank}</span> : discount ? <span className="badge sale">−{discount}% <span className="sr-only">{lang === 'en' ? 'discount' : 'ছাড়'}</span></span> : <span className="badge dark">NEW</span>}<span className="badge cod">COD</span></div>
      <button className={`wish-button icon-button ${wished ? 'is-wished' : ''}`} onClick={() => onWish(p.id)} aria-label={`${wished ? 'Remove' : 'Save'} ${p.name} ${wished ? 'from' : 'to'} wishlist`} aria-pressed={wished}><Heart size={19} /></button>
      <button className={`card-add ${addedId === p.id ? 'is-added' : ''}`} onClick={() => onAdd(p)} aria-label={`${lang === 'en' ? 'Add' : 'যোগ করুন'} ${name} ${lang === 'en' ? 'to cart' : ''}`}>{addedId === p.id ? <Check size={18} /> : <><ShoppingBag className="desktop-add-icon" size={17} /><Plus className="mobile-add-icon" size={20} /></>}<span>{addedId === p.id ? (lang === 'en' ? 'Added' : 'যোগ হয়েছে') : (lang === 'en' ? 'Add to cart' : 'কার্টে যোগ করুন')}</span></button>
    </div>
    <div className="product-copy"><span className="brand">{p.brand}</span><h3><a href={`#product-${p.id}`} onClick={e => { e.preventDefault(); onOpen(p) }}>{name}</a></h3><div className="product-rating"><Star size={13} fill="currentColor" /><span>{p.rating}</span><span className="muted">({p.reviews}) · {lang === 'en' ? 'Demo' : 'ডেমো'}</span></div><div className="price-row"><strong className={discount ? 'sale-price' : ''}>{price(p.price, lang)}</strong>{p.original && <del>{price(p.original, lang)}</del>}</div>{compact ? <div className="stock-demo"><div><span style={{ width: `${68 - productsIndex(p.id) * 7}%` }} /></div><small>{lang === 'en' ? 'Sold' : 'বিক্রি'} {68 - productsIndex(p.id) * 7}% · {lang === 'en' ? 'Demo' : 'ডেমো'}</small></div> : <p className={`product-meta ${p.stock <= 3 ? 'low-stock' : ''}`}>{p.stock <= 3 ? (lang === 'en' ? 'Only 3 left · demo stock' : 'আর ৩টি · ডেমো স্টক') : <><Truck size={13} />{lang === 'en' ? 'COD available' : 'ক্যাশ অন ডেলিভারি'}</>}</p>}</div>
  </article>
}
function productsIndex(id: string) { return ['headphones', 'earbuds', 'serum', 'knitwear'].indexOf(id) + 1 }
