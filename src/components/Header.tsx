import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowRight, ChevronDown, ChevronLeft, Headphones, Heart, Home, Menu,
  PackageCheck, ScanBarcode, Search, ShoppingBag, Sparkles, UserRound, X,
} from 'lucide-react'
import { Logo, NovaStar } from './Logo'
import { storeConfig as config } from '../data/config'
import './header.css'

type HeaderProps = {
  lang: 'en' | 'bn'
  onLanguage: () => void
  wishlistCount: number
  cartCount: number
  subtotal: string
  onSearch: (query: string) => void
  onCart: () => void
  onWishlist: () => void
  onAccount: () => void
  onCategory: (category: string) => void
  onInfo: (title: string, body: string) => void
  added: boolean
}

type Copy = {
  categories: string[]
  search: string
  account: string
  wishlist: string
  cart: string
  track: string
  shop: string
  signIn: string
}

const copy: Record<'en' | 'bn', Copy> = {
  en: {
    categories: ['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Lifestyle', 'Deals', 'New Arrivals'],
    search: 'Search products, brands and more', account: 'Account', wishlist: 'Wishlist', cart: 'Cart',
    track: 'Track order', shop: 'Shop all', signIn: 'Welcome to NOVA MART',
  },
  bn: {
    categories: ['ইলেকট্রনিক্স', 'ফ্যাশন', 'হোম ও লিভিং', 'বিউটি', 'লাইফস্টাইল', 'অফার', 'নতুন কালেকশন'],
    search: 'পণ্য, ব্র্যান্ড ও আরও খুঁজুন', account: 'অ্যাকাউন্ট', wishlist: 'পছন্দের তালিকা', cart: 'কার্ট',
    track: 'অর্ডার ট্র্যাক', shop: 'সব পণ্য দেখুন', signIn: 'NOVA MART-এ স্বাগতম',
  },
}

const hotline = String(config.hotline ?? '09612-000000')
const deliveryAmount = typeof config.deliveryThreshold === 'number'
  ? config.deliveryThreshold.toLocaleString('en-US')
  : String(config.deliveryThreshold ?? '2,000')
const deliveryThreshold = `৳${deliveryAmount}`
const deliveryDistricts = Number(config.districts ?? 64).toLocaleString('en-US')

const promos = [
  { en: `Free delivery over ${deliveryThreshold} · ${deliveryDistricts} districts (demo delivery)`, bn: `৳${Number(config.deliveryThreshold ?? 2000).toLocaleString('bn-BD')}-এর বেশি অর্ডারে ফ্রি ডেলিভারি · ${Number(config.districts ?? 64).toLocaleString('bn-BD')} জেলা (ডেমো)` },
  { en: 'Pay with bKash · Nagad · Cash on delivery', bn: 'বিকাশ · নগদ · ক্যাশ অন ডেলিভারি' },
  { en: '11.11 Mega Sale · Demo promotion', bn: '১১.১১ মেগা সেল · ডেমো অফার' },
]

const menuItems: Record<string, string[][]> = {
  Electronics: [['Phones & Tablets', 'Laptops', 'Audio', 'Cameras'], ['TV & Home Cinema', 'Wearables', 'Gaming', 'Accessories'], ['Small Appliances', 'Large Appliances', 'Smart Home', 'Office Tech'], ['Top picks', 'Best sellers', 'Just arrived', 'All electronics']],
  Fashion: [['Women', 'Men', 'Kids', 'Traditional wear'], ['Clothing', 'Shoes', 'Bags', 'Jewellery'], ['Ethnic wear', 'Everyday essentials', 'Occasion wear', 'Accessories'], ['New season', 'Editor’s picks', 'Best sellers', 'All fashion']],
  'Home & Living': [['Furniture', 'Bedding', 'Bath', 'Lighting'], ['Kitchen & Dining', 'Storage', 'Home décor', 'Appliances'], ['Living room', 'Bedroom', 'Workspace', 'Outdoor'], ['Refresh your home', 'Small spaces', 'Gift ideas', 'All home']],
  Beauty: [['Skincare', 'Makeup', 'Haircare', 'Fragrance'], ['Bath & body', 'Men’s grooming', 'Tools & devices', 'Wellness'], ['Clean beauty', 'Daily essentials', 'Sun care', 'Gift sets'], ['New & noteworthy', 'Beauty edits', 'Best sellers', 'All beauty']],
  Lifestyle: [['Sports & outdoors', 'Books & stationery', 'Travel', 'Toys & games'], ['Fitness', 'Hobbies', 'Pet supplies', 'Automotive'], ['Everyday carry', 'Outdoor living', 'Creative corner', 'Wellness'], ['Made for you', 'Staff favourites', 'Gift guide', 'All lifestyle']],
  Deals: [['Today’s deals', 'Flash offers', 'Bundle savings', 'Under ৳500'], ['Electronics offers', 'Fashion offers', 'Home offers', 'Beauty offers'], ['Limited time', 'Clearance', 'Popular picks', 'Value packs'], ['Offer details', 'Shop all deals', 'Top rated', 'More to explore']],
  'New Arrivals': [['Just in: electronics', 'Just in: fashion', 'Just in: home', 'Just in: beauty'], ['This week', 'Trending now', 'Fresh finds', 'New brands'], ['Designer edit', 'Everyday upgrades', 'Seasonal picks', 'Staff picks'], ['Discover more', 'Coming soon', 'Latest offers', 'Shop all new']],
}

const menuItemsBn: Record<string, string[][]> = {
  Electronics: [['ফোন ও ট্যাবলেট', 'ল্যাপটপ', 'অডিও', 'ক্যামেরা'], ['টিভি', 'স্মার্টওয়াচ', 'গেমিং', 'অ্যাক্সেসরিজ'], ['ছোট যন্ত্রপাতি', 'বড় যন্ত্রপাতি', 'স্মার্ট হোম', 'অফিস টেক'], ['জনপ্রিয় পছন্দ', 'বেস্ট সেলার', 'নতুন এসেছে', 'সব ইলেকট্রনিক্স']],
  Fashion: [['নারী', 'পুরুষ', 'শিশু', 'ঐতিহ্যবাহী পোশাক'], ['পোশাক', 'জুতা', 'ব্যাগ', 'গয়না'], ['এথনিক পোশাক', 'দৈনন্দিন পোশাক', 'অনুষ্ঠানের পোশাক', 'অ্যাক্সেসরিজ'], ['নতুন কালেকশন', 'সম্পাদকের পছন্দ', 'বেস্ট সেলার', 'সব ফ্যাশন']],
  'Home & Living': [['আসবাব', 'বিছানার চাদর', 'বাথ', 'লাইটিং'], ['রান্নাঘর ও খাবার', 'স্টোরেজ', 'ঘর সাজানো', 'যন্ত্রপাতি'], ['বসার ঘর', 'শোবার ঘর', 'কর্মক্ষেত্র', 'আউটডোর'], ['ঘর সাজান', 'ছোট জায়গা', 'উপহারের আইডিয়া', 'সব হোম']],
  Beauty: [['ত্বকের যত্ন', 'মেকআপ', 'চুলের যত্ন', 'সুগন্ধি'], ['বাথ ও বডি', 'পুরুষদের গ্রুমিং', 'টুলস', 'ওয়েলনেস'], ['ক্লিন বিউটি', 'দৈনন্দিন পণ্য', 'সান কেয়ার', 'গিফট সেট'], ['নতুন পণ্য', 'বিউটি এডিট', 'বেস্ট সেলার', 'সব বিউটি']],
  Lifestyle: [['স্পোর্টস ও আউটডোর', 'বই ও স্টেশনারি', 'ভ্রমণ', 'খেলনা'], ['ফিটনেস', 'শখ', 'পোষা প্রাণীর পণ্য', 'অটোমোটিভ'], ['দৈনন্দিন অনুষঙ্গ', 'আউটডোর লিভিং', 'ক্রিয়েটিভ কর্নার', 'ওয়েলনেস'], ['আপনার পছন্দ', 'জনপ্রিয় পণ্য', 'গিফট গাইড', 'সব লাইফস্টাইল']],
  Deals: [['আজকের অফার', 'ফ্ল্যাশ অফার', 'বান্ডেল সেভিংস', '৳৫০০-এর নিচে'], ['ইলেকট্রনিক্স অফার', 'ফ্যাশন অফার', 'হোম অফার', 'বিউটি অফার'], ['সীমিত সময়', 'ক্লিয়ারেন্স', 'জনপ্রিয় পণ্য', 'ভ্যালু প্যাক'], ['অফারের বিস্তারিত', 'সব অফার', 'টপ রেটেড', 'আরও দেখুন']],
  'New Arrivals': [['নতুন ইলেকট্রনিক্স', 'নতুন ফ্যাশন', 'নতুন হোম', 'নতুন বিউটি'], ['এই সপ্তাহে', 'ট্রেন্ডিং', 'নতুন খোঁজ', 'নতুন ব্র্যান্ড'], ['ডিজাইনার এডিট', 'দৈনন্দিন আপগ্রেড', 'মৌসুমি পছন্দ', 'জনপ্রিয় পছন্দ'], ['আরও আবিষ্কার করুন', 'শিগগিরই আসছে', 'সর্বশেষ অফার', 'সব নতুন পণ্য']],
}

const searchTerms: Record<'en' | 'bn', string[]> = {
  en: ['Search products, brands and more', 'Try “wireless headphones”', 'Discover something new'],
  bn: ['পণ্য, ব্র্যান্ড ও আরও খুঁজুন', '“ওয়্যারলেস হেডফোন” খুঁজুন', 'নতুন কিছু আবিষ্কার করুন'],
}

export function Header({ lang, onLanguage, wishlistCount, cartCount, subtotal, onSearch, onCart, onWishlist, onAccount, onCategory, onInfo, added }: HeaderProps) {
  const text = copy[lang]
  const [promoIndex, setPromoIndex] = useState(0)
  const [promoPaused, setPromoPaused] = useState(false)
  const [mobilePromoVisible, setMobilePromoVisible] = useState(() => {
    try { return sessionStorage.getItem('nova-announcement-dismissed') !== '1' } catch { return true }
  })
  const [searchHint, setSearchHint] = useState(0)
  const [query, setQuery] = useState('')
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [menuCategory, setMenuCategory] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [bottomActive, setBottomActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)
  const menuTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const headerRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDialogElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const previousScroll = useRef(0)

  const closeMenu = useCallback(() => setMenuCategory(null), [])
  const dismissPromo = () => {
    setMobilePromoVisible(false)
    try { sessionStorage.setItem('nova-announcement-dismissed', '1') } catch { /* storage may be unavailable */ }
  }
  const showInfo = (title: string, body: string) => onInfo(title, body)

  useEffect(() => {
    if (promoPaused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => setPromoIndex((index) => (index + 1) % promos.length), 5000)
    return () => window.clearInterval(timer)
  }, [promoPaused])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return
    const timer = window.setInterval(() => setSearchHint((index) => (index + 1) % searchTerms[lang].length), 3000)
    return () => window.clearInterval(timer)
  }, [lang])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 120)
      if (y <= 120) setHeaderVisible(true)
      else if (y < previousScroll.current - 4) setHeaderVisible(true)
      else if (y > previousScroll.current + 4) setHeaderVisible(false)
      previousScroll.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuCategory) return
    const focusables = () => menuRef.current?.querySelectorAll<HTMLElement>('button, a[href]')
    const first = focusables()?.[0]
    first?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
        headerRef.current?.querySelector<HTMLElement>(`[data-category="${CSS.escape(menuCategory)}"]`)?.focus()
      } else if (event.key === 'Tab') {
        const items = focusables()
        if (!items?.length) return
        const firstItem = items[0]
        const lastItem = items[items.length - 1]
        if (event.shiftKey && document.activeElement === firstItem) { event.preventDefault(); lastItem.focus() }
        else if (!event.shiftKey && document.activeElement === lastItem) { event.preventDefault(); firstItem.focus() }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuCategory, closeMenu])

  useEffect(() => {
    const dialog = drawerRef.current
    if (!dialog) return
    if (mobileOpen && !dialog.open) dialog.showModal()
    if (!mobileOpen && dialog.open) dialog.close()
  }, [mobileOpen])

  const openMenu = (category: string) => {
    if (menuTimer.current) clearTimeout(menuTimer.current)
    setMenuCategory(category)
  }
  const delayedClose = () => {
    if (menuTimer.current) clearTimeout(menuTimer.current)
    menuTimer.current = setTimeout(closeMenu, 120)
  }
  const selectCategory = (category: string) => {
    onCategory(category)
    setBottomActive(category === 'Deals' ? 'deals' : 'categories')
    closeMenu()
    setMobileOpen(false)
    setExpandedCategory(null)
  }
  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = query.trim()
    if (!value) { searchRef.current?.focus(); return }
    onSearch(value)
    setMobileSearchOpen(false)
  }
  const toggleDrawer = () => setMobileOpen((open) => !open)

  const searchForm = (className: string) => (
    <form className={`nova-search ${className}`} onSubmit={submitSearch} role="search">
      <button type="submit" aria-label={lang === 'bn' ? 'খুঁজুন' : 'Search'} className="nova-search-submit"><Search size={21} strokeWidth={1.5} /></button>
      <input
        ref={searchRef}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={searchTerms[lang][searchHint]}
        aria-label={text.search}
      />
      <button type="button" className="nova-scan" aria-label={lang === 'bn' ? 'বারকোড স্ক্যানার ডেমো' : 'Barcode scanner demo'} onClick={() => showInfo(lang === 'bn' ? 'বারকোড স্ক্যানার' : 'Barcode scanner', lang === 'bn' ? 'এই ডেমোতে বারকোড স্ক্যান উপলভ্য নয়।' : 'Barcode scanning is not available in this demo.')}>
        <ScanBarcode className="nova-scan-icon" />
      </button>
    </form>
  )

  const counter = (amount: number) => amount > 0 ? <span className="nova-count">{amount > 99 ? '99+' : amount}</span> : null
  const menuLinks = menuItems[menuCategory ?? ''] ?? menuItems.Electronics
  const menuLinksBn = menuItemsBn[menuCategory ?? ''] ?? menuItemsBn.Electronics

  return (
    <>
      <header ref={headerRef} className={`nova-header${scrolled ? ' is-scrolled' : ''}${headerVisible ? '' : ' is-hidden'}`}>
        {mobilePromoVisible && <div className="nova-announcement" onMouseEnter={() => setPromoPaused(true)} onMouseLeave={() => setPromoPaused(false)} onFocus={() => setPromoPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPromoPaused(false) }}>
          <div className="container nova-announcement-inner">
            <button type="button" className="nova-hotline" onClick={() => showInfo(lang === 'bn' ? 'হটলাইন (ডেমো)' : 'Demo hotline', lang === 'bn' ? `সহায়তার জন্য ${hotline} নম্বরে কল করুন (ডেমো)।` : `Call ${hotline} for assistance (demo).`)}><Headphones size={15} /> <span>{lang === 'bn' ? 'ডেমো হটলাইন' : 'Demo hotline'} · {hotline}</span></button>
            <div className="nova-promo" aria-live="polite">{promos[promoIndex][lang]}</div>
            <div className="nova-announce-actions">
              <button type="button" className="nova-language" onClick={onLanguage} aria-label={lang === 'en' ? 'বাংলায় দেখুন' : 'Switch to English'}>{lang === 'en' ? <><strong>EN</strong><span>|</span>বাংলা</> : <>EN<span>|</span><strong>বাংলা</strong></>}</button>
              <button type="button" className="nova-track" onClick={() => showInfo(text.track, lang === 'bn' ? 'অর্ডার ট্র্যাকিং এই ডেমোতে উপলভ্য নয়।' : 'Order tracking is not available in this demo.')}>{text.track}<ArrowRight size={14} /></button>
              <button type="button" className="nova-promo-dismiss" onClick={dismissPromo} aria-label={lang === 'bn' ? 'ঘোষণা বন্ধ করুন' : 'Dismiss announcement'}><X size={16} /></button>
            </div>
          </div>
        </div>}

        <div className="container nova-main-row">
          <button type="button" className="nova-mobile-menu icon-action" aria-label={lang === 'bn' ? 'মেনু খুলুন' : 'Open menu'} onClick={toggleDrawer}><Menu /></button>
          <div className="nova-brand"><Logo /><span className="nova-compact-logo"><NovaStar /><b>NOVA <em>MART</em></b></span></div>
          {searchForm('nova-search-desktop')}
          <button type="button" className="nova-tablet-search icon-action" aria-label={lang === 'bn' ? 'সার্চ খুলুন' : 'Open search'} onClick={() => { setMobileSearchOpen((open) => !open); window.setTimeout(() => searchRef.current?.focus(), 0) }}><Search /></button>
          <div className="nova-actions">
            <button type="button" className="nova-action account-action" onClick={onAccount}><span className="action-icon"><UserRound /></span><span className="action-label">{text.account}</span></button>
            <button type="button" className="nova-action wishlist-action" onClick={onWishlist}><span className="action-icon">{counter(wishlistCount)}<Heart /></span><span className="action-label">{text.wishlist}</span></button>
            <button type="button" className="nova-action cart-action" onClick={onCart}><span className="action-icon">{counter(cartCount)}<ShoppingBag /></span><span className="action-copy"><span className="action-label">{text.cart}</span><small>{subtotal}</small></span></button>
          </div>
        </div>
        {mobileSearchOpen && <div className="container nova-tablet-searchbar">{searchForm('')}</div>}
        <div className="nova-secondary-row">
          <div className="container nova-secondary-inner">
            <nav className="nova-nav" aria-label={lang === 'bn' ? 'পণ্যের বিভাগ' : 'Product categories'}>
              {text.categories.map((label, index) => {
                const category = copy.en.categories[index]
                return <button key={category} type="button" data-category={category} className={`nova-nav-item${menuCategory === category ? ' active' : ''}${index > 4 ? ' nova-nav-featured' : ''}`} aria-expanded={menuCategory === category} onMouseEnter={() => openMenu(category)} onMouseLeave={delayedClose} onFocus={() => openMenu(category)} onClick={() => openMenu(category)}>{label}{index < 5 && <ChevronDown size={13} />}</button>
              })}
            </nav>
            <div className="nova-service"><PackageCheck size={16} /><span>{lang === 'bn' ? `সারা দেশে ডেলিভারি · ${deliveryThreshold}-এর বেশি ফ্রি` : `Nationwide delivery · Free over ${deliveryThreshold}`}</span><span className="service-divider" /><span>{lang === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on delivery'}</span></div>
          </div>
        </div>
        {menuCategory && <>
          <button className="nova-menu-backdrop" type="button" aria-label={lang === 'bn' ? 'মেনু বন্ধ করুন' : 'Close category menu'} onClick={closeMenu} />
          <div ref={menuRef} className="nova-mega-menu" role="dialog" aria-modal="true" aria-label={`${lang === 'bn' ? 'বিভাগ' : 'Category'}: ${lang === 'bn' ? text.categories[copy.en.categories.indexOf(menuCategory)] : menuCategory}`} onMouseEnter={() => { if (menuTimer.current) clearTimeout(menuTimer.current) }} onMouseLeave={delayedClose}>
            <div className="container nova-mega-inner">
              <div className="nova-mega-columns">
                {menuLinks.map((column, columnIndex) => <div className="nova-mega-column" key={`${menuCategory}-${columnIndex}`}>
                  {column.map((item, itemIndex) => <button type="button" key={item} className={itemIndex === 0 ? 'mega-heading' : ''} onClick={() => selectCategory(menuCategory)}>{lang === 'bn' ? menuLinksBn[columnIndex][itemIndex] : item}</button>)}
                </div>)}
              </div>
              <button type="button" className="nova-editorial" onClick={() => selectCategory(menuCategory)}>
                <img src="/images/knitwear-640.webp" alt="" />
                <span className="editorial-shade" />
                <span className="editorial-copy"><span className="eyebrow">{lang === 'bn' ? 'NOVA EDIT' : 'THE NOVA EDIT'}</span><strong>{lang === 'bn' ? 'নিজস্ব স্টাইল আবিষ্কার করুন' : 'Find your own kind of wonderful'}</strong><span>{lang === 'bn' ? 'আমাদের নির্বাচিত কালেকশন দেখুন' : 'Explore the curated collection'} <ArrowRight size={15} /></span></span>
              </button>
            </div>
          </div>
        </>}
      </header>

      <dialog ref={drawerRef} className="nova-drawer" aria-label={lang === 'bn' ? 'মেনু' : 'Menu'} onCancel={(event) => { event.preventDefault(); setMobileOpen(false) }} onClose={() => setMobileOpen(false)}>
        <div className="drawer-head"><Logo /><button type="button" className="icon-action" aria-label={lang === 'bn' ? 'মেনু বন্ধ করুন' : 'Close menu'} onClick={() => setMobileOpen(false)}><X /></button></div>
        <button type="button" className="drawer-account" onClick={() => { setMobileOpen(false); onAccount() }}><span className="drawer-avatar"><UserRound /></span><span><b>{text.signIn}</b><small>{lang === 'bn' ? 'অ্যাকাউন্ট ও অর্ডার দেখুন' : 'Sign in for a better experience'}</small></span><ChevronLeft className="drawer-account-arrow" /></button>
        <div className="drawer-language"><span>{lang === 'bn' ? 'ভাষা' : 'Language'}</span><button type="button" onClick={onLanguage}>{lang === 'en' ? 'EN  |  বাংলা' : 'EN  |  বাংলা'}</button></div>
        <nav className="drawer-categories" aria-label={lang === 'bn' ? 'পণ্যের বিভাগ' : 'Product categories'}>
          {text.categories.map((label, index) => {
            const category = copy.en.categories[index]
            const expanded = expandedCategory === category
            return <div className="drawer-category" key={category}>
              <button type="button" className="drawer-category-button" aria-expanded={expanded} onClick={() => setExpandedCategory(expanded ? null : category)}><span className={`drawer-thumb thumb-${index}`}><Sparkles size={17} /></span><span>{label}</span><ChevronDown size={17} /></button>
              {expanded && <div className="drawer-subcategories">{menuItems[category][0].concat(menuItems[category][1]).map((item, itemIndex) => <button type="button" key={item} onClick={() => selectCategory(category)}>{lang === 'bn' ? menuItemsBn[category][Math.floor(itemIndex / 4)][itemIndex % 4] : item}<ChevronLeft size={14} /></button>)}</div>}
            </div>
          })}
        </nav>
        <div className="drawer-bottom"><button type="button" onClick={() => showInfo(lang === 'bn' ? 'ডেমো হটলাইন' : 'Demo hotline', lang === 'bn' ? `${hotline} (ডেমো)` : `${hotline} (demo)`)}><Headphones size={17} />{lang === 'bn' ? `হটলাইন (ডেমো) · ${hotline}` : `Demo hotline · ${hotline}`}</button><p>{lang === 'bn' ? 'বিকাশ · নগদ · ক্যাশ অন ডেলিভারি' : 'Pay with bKash · Nagad · Cash on delivery'}</p></div>
      </dialog>

      <nav className="nova-bottom-nav" aria-label={lang === 'bn' ? 'প্রধান নেভিগেশন' : 'Primary navigation'}>
        <button type="button" className={`bottom-link${bottomActive === 'home' ? ' active' : ''}`} onClick={() => { setBottomActive('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><Home /><span>{lang === 'bn' ? 'হোম' : 'Home'}</span><i /></button>
        <button type="button" className={`bottom-link${bottomActive === 'categories' ? ' active' : ''}`} onClick={() => { setBottomActive('categories'); setMobileOpen(true) }}><Menu /><span>{lang === 'bn' ? 'বিভাগ' : 'Categories'}</span><i /></button>
        <button type="button" className={`bottom-link${bottomActive === 'deals' ? ' active' : ''}`} onClick={() => selectCategory('Deals')}><Sparkles /><span>{lang === 'bn' ? 'অফার' : 'Deals'}</span><i /></button>
        <button type="button" className={`bottom-link${bottomActive === 'cart' ? ' active' : ''}`} onClick={() => { setBottomActive('cart'); onCart() }}><span className="bottom-icon-wrap">{counter(cartCount)}<ShoppingBag /></span><span>{lang === 'bn' ? 'কার্ট' : 'Cart'}</span><i /></button>
        <button type="button" className={`bottom-link${bottomActive === 'account' ? ' active' : ''}`} onClick={() => { setBottomActive('account'); onAccount() }}><UserRound /><span>{lang === 'bn' ? 'অ্যাকাউন্ট' : 'Account'}</span><i /></button>
      </nav>

      {added && <div className="nova-added-toast" role="status"><span className="added-check">✓</span><span>{lang === 'bn' ? 'কার্টে যোগ হয়েছে' : 'Added to cart'}</span><button type="button" onClick={onCart}>{lang === 'bn' ? 'কার্ট দেখুন' : 'View cart'}<ArrowRight size={15} /></button></div>}
    </>
  )
}
