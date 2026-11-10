import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Banknote,
  Camera,
  Check,
  ChevronDown,
  Copy,
  Headphones,
  HeartHandshake,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
  Wallet,
  X,
} from 'lucide-react'
import { storeConfig } from '../data/config'
import { Logo } from './Logo'
import './editorial.css'

const copy = {
  en: {
    whyEyebrow: 'THE NOVA DIFFERENCE',
    whyTitle: 'Shopping, the way it should be.',
    reasons: [
      ['Nationwide delivery', 'Thoughtful delivery options to all 64 districts.'],
      ['Cash on delivery', 'Pay when your order reaches your doorstep.'],
      ['bKash & Nagad', 'Convenient local payment options at checkout.'],
      ['Authentic, easy returns', 'Example policy: 7-day returns on eligible items.'],
    ],
    stats: ['Happy customers', 'Districts reached', 'Customer rating', 'Orders delivered'],
    testimonialsEyebrow: 'KIND WORDS',
    testimonialsTitle: 'Loved across Bangladesh.',
    demoAggregate: 'Demo rating · not verified',
    reviews: [
      { name: 'Nusrat Jahan', city: 'Dhaka', product: 'Wireless headphones', quote: 'The sound is lovely, and the delivery was right on time. I use them every day on my commute.' },
      { name: 'আরিফ হাসান', city: 'চট্টগ্রাম', product: 'Daily care serum', quote: 'প্যাকেজিং সুন্দর ছিল, আর অর্ডারটাও সহজে হাতে পেয়েছি। পণ্যটি আমার খুব পছন্দ হয়েছে।' },
      { name: 'Farhana Rahman', city: 'Sylhet', product: 'Wireless headphones', quote: 'A smooth experience from browsing to delivery. The headphones feel comfortable even after hours.' },
    ],
    purchaseDemo: 'Sample review · demo content',
    newsletterEyebrow: 'JOIN THE NOVA CLUB',
    newsletterTitle: 'Get ৳200 off your first order.',
    newsletterText: 'Be first to hear about new arrivals, thoughtful picks and member-only offers.',
    phone: 'Phone', email: 'Email', phonePlaceholder: '1XXXXXXXXX', emailPlaceholder: 'you@example.com',
    subscribe: 'Subscribe', consent: 'By subscribing, you agree to receive updates. Demo form only — no SMS or email will be sent.',
    invalidPhone: 'Enter a valid Bangladesh mobile number (01XXXXXXXXX or +8801XXXXXXXXX).',
    invalidEmail: 'Enter a valid email address.',
    success: 'Thanks! This demo did not send an SMS or email.',
    coupon: 'Your demo code', copyCode: 'Copy code', copied: 'Copied',
    shop: 'Shop', help: 'Help & support', company: 'Company', contact: 'Contact',
    allProducts: 'All products', delivery: 'Delivery information', returns: 'Returns & refunds', faq: 'Frequently asked questions',
    about: 'About Nova Mart', careers: 'Careers', privacy: 'Privacy policy', terms: 'Terms of service',
    appTitle: 'Shop on the go', comingSoon: 'Coming soon', payments: 'Payment methods', deliveryPartners: 'Delivery partners',
    demoLabel: 'Demo store · sample information', copyright: 'All rights reserved.',
    chatTitle: 'How can we help?', chatHint: 'These support channels are not connected in this demo.',
    messenger: 'Messenger', whatsapp: 'WhatsApp', call: 'Call us', close: 'Close support options',
    chatInfoTitle: 'Support channel not connected', chatInfoBody: 'This is a demo store. No Messenger, WhatsApp, or phone call will be started. Please use the contact details shown in the footer as sample information only.',
    privacyBody: 'This is sample privacy information for a demo store. No personal data is collected or processed by these example policies.',
    termsBody: 'These are example terms for a demo store and do not constitute a real purchase agreement.',
    deliveryBody: 'Example delivery information only: Dhaka delivery in 24–48 hours and nationwide delivery in 3–5 days. Availability and fees are not live.',
    returnsBody: 'Example policy only: eligible items may be returned within 7 days. This demo does not process real orders or returns.',
    faqBody: 'This demo storefront has no live help center or order service. Contact details are example information.',
    companyBody: 'Nova Mart is a fictional demo storefront created to demonstrate a shopping experience.',
    contactBody: 'Contact information shown here is sample data and is not monitored.',
    socialBody: 'Social channels are not connected in this demo.',
  },
  bn: {
    whyEyebrow: 'নোভা কেন আলাদা',
    whyTitle: 'কেনাকাটা হোক আরও সহজ।',
    reasons: [
      ['সারা দেশে ডেলিভারি', '৬৪টি জেলায় সুবিধাজনক ডেলিভারি বিকল্প।'],
      ['ক্যাশ অন ডেলিভারি', 'পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন।'],
      ['বিকাশ ও নগদ', 'চেকআউটে সহজ স্থানীয় পেমেন্ট বিকল্প।'],
      ['অরিজিনাল, সহজ রিটার্ন', 'উদাহরণ নীতি: যোগ্য পণ্যে ৭ দিনের রিটার্ন।'],
    ],
    stats: ['সন্তুষ্ট ক্রেতা', 'জেলায় সেবা', 'ক্রেতাদের রেটিং', 'ডেলিভারি অর্ডার'],
    testimonialsEyebrow: 'ক্রেতাদের কথা',
    testimonialsTitle: 'বাংলাদেশজুড়ে প্রিয়।',
    demoAggregate: 'ডেমো রেটিং · যাচাইকৃত নয়',
    reviews: [
      { name: 'নুসরাত জাহান', city: 'ঢাকা', product: 'ওয়্যারলেস হেডফোন', quote: 'সাউন্ড দারুণ, আর ডেলিভারিও ঠিক সময়ে পেয়েছি। যাতায়াতের সময় প্রতিদিন ব্যবহার করি।' },
      { name: 'আরিফ হাসান', city: 'চট্টগ্রাম', product: 'ডেইলি কেয়ার সিরাম', quote: 'প্যাকেজিং সুন্দর ছিল, আর অর্ডারটাও সহজে হাতে পেয়েছি। পণ্যটি আমার খুব পছন্দ হয়েছে।' },
      { name: 'ফারহানা রহমান', city: 'সিলেট', product: 'ওয়্যারলেস হেডফোন', quote: 'ব্রাউজ করা থেকে ডেলিভারি পর্যন্ত পুরো অভিজ্ঞতাই সহজ ছিল। অনেকক্ষণ পরলেও আরামদায়ক।' },
    ],
    purchaseDemo: 'নমুনা রিভিউ · ডেমো কনটেন্ট',
    newsletterEyebrow: 'নোভা ক্লাবে যোগ দিন',
    newsletterTitle: 'প্রথম অর্ডারে ৳২০০ ছাড়।',
    newsletterText: 'নতুন পণ্য, পছন্দের কালেকশন ও বিশেষ অফারের খবর সবার আগে পান।',
    phone: 'ফোন', email: 'ইমেইল', phonePlaceholder: '1XXXXXXXXX', emailPlaceholder: 'you@example.com',
    subscribe: 'সাবস্ক্রাইব', consent: 'সাবস্ক্রাইব করলে আপডেট পাওয়ার সম্মতি দিচ্ছেন। এটি ডেমো ফর্ম — কোনো SMS বা ইমেইল পাঠানো হবে না।',
    invalidPhone: 'বাংলাদেশের সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX বা +8801XXXXXXXXX)।',
    invalidEmail: 'সঠিক ইমেইল ঠিকানা দিন।',
    success: 'ধন্যবাদ! এই ডেমো থেকে কোনো SMS বা ইমেইল পাঠানো হয়নি।',
    coupon: 'আপনার ডেমো কোড', copyCode: 'কোড কপি', copied: 'কপি হয়েছে',
    shop: 'কেনাকাটা', help: 'সহায়তা', company: 'কোম্পানি', contact: 'যোগাযোগ',
    allProducts: 'সব পণ্য', delivery: 'ডেলিভারি তথ্য', returns: 'রিটার্ন ও রিফান্ড', faq: 'সাধারণ জিজ্ঞাসা',
    about: 'নোভা মার্ট সম্পর্কে', careers: 'ক্যারিয়ার', privacy: 'প্রাইভেসি পলিসি', terms: 'ব্যবহারের শর্ত',
    appTitle: 'যেকোনো জায়গায় কেনাকাটা', comingSoon: 'শীঘ্রই আসছে', payments: 'পেমেন্ট মাধ্যম', deliveryPartners: 'ডেলিভারি পার্টনার',
    demoLabel: 'ডেমো স্টোর · নমুনা তথ্য', copyright: 'সর্বস্বত্ব সংরক্ষিত।',
    chatTitle: 'কীভাবে সাহায্য করতে পারি?', chatHint: 'এই ডেমোতে সাপোর্ট চ্যানেলগুলো সংযুক্ত নয়।',
    messenger: 'মেসেঞ্জার', whatsapp: 'হোয়াটসঅ্যাপ', call: 'ফোন করুন', close: 'সাপোর্ট অপশন বন্ধ করুন',
    chatInfoTitle: 'সাপোর্ট চ্যানেল সংযুক্ত নয়', chatInfoBody: 'এটি একটি ডেমো স্টোর। কোনো মেসেঞ্জার, হোয়াটসঅ্যাপ বা ফোন কল চালু হবে না। ফুটারের যোগাযোগের তথ্য শুধুই নমুনা।',
    privacyBody: 'এটি ডেমো স্টোরের নমুনা প্রাইভেসি তথ্য। এই উদাহরণ নীতির মাধ্যমে কোনো ব্যক্তিগত তথ্য সংগ্রহ বা প্রক্রিয়া করা হয় না।',
    termsBody: 'এগুলো ডেমো স্টোরের উদাহরণ শর্ত, কোনো বাস্তব ক্রয় চুক্তি নয়।',
    deliveryBody: 'শুধু উদাহরণ: ঢাকায় ২৪–৪৮ ঘণ্টা এবং সারা দেশে ৩–৫ দিনে ডেলিভারি। সুবিধা ও খরচ সরাসরি নয়।',
    returnsBody: 'শুধু উদাহরণ নীতি: যোগ্য পণ্য ৭ দিনের মধ্যে ফেরত দেওয়া যেতে পারে। এই ডেমোতে বাস্তব অর্ডার বা রিটার্ন হয় না।',
    faqBody: 'এই ডেমো স্টোরে সরাসরি সহায়তা বা অর্ডার সেবা নেই। যোগাযোগের তথ্য নমুনা।',
    companyBody: 'নোভা মার্ট একটি কাল্পনিক ডেমো স্টোর, কেনাকাটার অভিজ্ঞতা দেখানোর জন্য তৈরি।',
    contactBody: 'এখানে দেওয়া যোগাযোগের তথ্য নমুনা এবং এখানে বার্তা পর্যবেক্ষণ করা হয় না।',
    socialBody: 'এই ডেমোতে সোশ্যাল চ্যানেল সংযুক্ত নয়।',
  },
} as const

const reasonIcons = [Truck, Banknote, Wallet, ShieldCheck]
const statValues = [500000, 64, 4.8, 10000]
const statDisplays = ['5 lakh+', '64', '4.8★', '10,000+']

export function EditorialSections({ lang, onCategory, onInfo }: { lang: 'en' | 'bn'; onCategory: (category: string) => void; onInfo: (title: string, body: string) => void }) {
  const t = copy[lang]
  const [activeReview, setActiveReview] = useState(0)
  const [emailMode, setEmailMode] = useState(false)
  const [contactValue, setContactValue] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const [statsProgress, setStatsProgress] = useState(0)
  const statsRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = statsRef.current
    if (!node) return
    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStatsVisible(true)
        observer.disconnect()
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setStatsProgress(1)
        } else {
          const started = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - started) / 900, 1)
            setStatsProgress(progress)
            if (progress < 1) frame = window.requestAnimationFrame(tick)
          }
          frame = window.requestAnimationFrame(tick)
        }
      }
    }, { threshold: 0.25 })
    observer.observe(node)
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const revealChat = () => {
      if (window.scrollY > window.innerHeight * 0.3) setChatOpen(true)
    }
    const timer = window.setTimeout(() => setChatOpen(true), 8000)
    window.addEventListener('scroll', revealChat, { passive: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', revealChat)
    }
  }, [])

  const moveReviews = (direction: -1 | 1) => {
    const next = (activeReview + direction + t.reviews.length) % t.reviews.length
    setActiveReview(next)
    trackRef.current?.children[next]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }

  const submitNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalized = contactValue.trim()
    const valid = emailMode
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
      : /^(?:\+?8801|01)[3-9]\d{8}$/.test(normalized.replace(/[\s-]/g, ''))
    if (!valid) {
      setFormMessage(emailMode ? t.invalidEmail : t.invalidPhone)
      setSubmitted(false)
      return
    }
    setFormMessage(t.success)
    setSubmitted(true)
  }

  const copyCoupon = async () => {
    try {
      await navigator.clipboard.writeText('NOVA200')
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
      setFormMessage(lang === 'en' ? 'Copy is unavailable in this browser.' : 'এই ব্রাউজারে কপি করা যাচ্ছে না।')
    }
  }

  const infoLinks = [
    { title: t.delivery, body: t.deliveryBody },
    { title: t.returns, body: t.returnsBody },
    { title: t.faq, body: t.faqBody },
    { title: t.about, body: t.companyBody },
    { title: t.careers, body: t.companyBody },
    { title: t.privacy, body: t.privacyBody },
    { title: t.terms, body: t.termsBody },
  ]
  const openInfo = (title: string, body: string) => onInfo(title, body)
  const statLabel = (index: number) => {
    if (!statsVisible || statsProgress === 0) return '0'
    if (statsProgress >= 1) return statDisplays[index]
    if (index === 0) return `${Math.round(statValues[index] * statsProgress).toLocaleString()}+`
    if (index === 1) return `${Math.round(statValues[index] * statsProgress)}`
    if (index === 2) return `${(statValues[index] * statsProgress).toFixed(1)}★`
    return `${Math.round(statValues[index] * statsProgress).toLocaleString()}+`
  }

  return (
    <>
      <section className="section editorial-why" aria-labelledby="editorial-why-title">
        <div className="container">
          <div className="editorial-heading">
            <p className="eyebrow">{t.whyEyebrow}</p>
            <h2 id="editorial-why-title">{t.whyTitle}</h2>
          </div>
          <div className="editorial-reasons">
            {t.reasons.map(([title, body], index) => {
              const Icon = reasonIcons[index]
              return <article className="editorial-reason" key={title}>
                <span className="editorial-reason-icon"><Icon size={25} strokeWidth={1.5} aria-hidden="true" /></span>
                <div><h3>{title}</h3><p>{body}</p></div>
              </article>
            })}
          </div>
          <div className="editorial-stats" ref={statsRef} aria-label={lang === 'en' ? 'Demo store statistics' : 'ডেমো স্টোরের পরিসংখ্যান'}>
            {statValues.map((_, index) => <div className="editorial-stat" key={t.stats[index]}>
              <strong>{statLabel(index)}</strong>
              <span>{t.stats[index]}<small> · demo</small></span>
            </div>)}
            <span className="sr-only">{lang === 'en' ? 'All figures are fictional demo statistics, not verified.' : 'সব সংখ্যাই কাল্পনিক ডেমো পরিসংখ্যান, যাচাইকৃত নয়।'}</span>
          </div>
          <p className="editorial-demo-note">{lang === 'en' ? 'Fictional demo statistics · not verified' : 'কাল্পনিক ডেমো পরিসংখ্যান · যাচাইকৃত নয়'}</p>
        </div>
      </section>

      <section className="section editorial-testimonials" aria-labelledby="editorial-reviews-title">
        <div className="container">
          <div className="editorial-testimonials-head">
            <div className="editorial-heading">
              <p className="eyebrow">{t.testimonialsEyebrow}</p>
              <h2 id="editorial-reviews-title">{t.testimonialsTitle}</h2>
            </div>
            <div className="editorial-review-summary" aria-label={lang === 'en' ? 'Fictional demo rating, not verified' : 'কাল্পনিক ডেমো রেটিং, যাচাইকৃত নয়'}>
              <span className="editorial-summary-stars" aria-hidden="true">★★★★★</span>
              <strong>4.8</strong><span>/ 12,480</span><small>{t.demoAggregate}</small>
            </div>
          </div>
          <div className="editorial-review-controls">
            <span>{t.purchaseDemo}</span>
            <div>
              <button type="button" className="editorial-arrow" aria-label={lang === 'en' ? 'Previous testimonial' : 'আগের মতামত'} onClick={() => moveReviews(-1)}><ArrowLeft size={18} strokeWidth={1.5} /></button>
              <button type="button" className="editorial-arrow" aria-label={lang === 'en' ? 'Next testimonial' : 'পরের মতামত'} onClick={() => moveReviews(1)}><ArrowRight size={18} strokeWidth={1.5} /></button>
            </div>
          </div>
          <div className="editorial-review-track" ref={trackRef} onScroll={(event) => {
            const item = event.currentTarget.firstElementChild
            if (!item) return
            const index = Math.round(event.currentTarget.scrollLeft / (item as HTMLElement).offsetWidth)
            setActiveReview(Math.min(index, t.reviews.length - 1))
          }}>
            {t.reviews.map((review, index) => <article className="editorial-review-card" key={review.name}>
              <div className="editorial-review-top">
                <span className="editorial-review-stars" aria-label="5 out of 5 demo stars">★★★★★</span>
                <span className="editorial-demo-pill">{t.purchaseDemo}</span>
              </div>
              <blockquote lang={index === 1 || (lang === 'bn' && index === 0) ? 'bn' : 'en'}>“{review.quote}”</blockquote>
              <div className="editorial-review-product">
                <img src={index === 1 ? '/images/serum-320.webp' : '/images/headphones-320.webp'} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} />
                <span>{review.product}</span>
              </div>
              <div className="editorial-review-author">
                <span className="editorial-avatar" aria-hidden="true">{review.name.slice(0, 1)}</span>
                <span><strong>{review.name}</strong><small><MapPin size={12} aria-hidden="true" /> {review.city} · {t.purchaseDemo}</small></span>
              </div>
            </article>)}
          </div>
          <div className="editorial-review-dots" aria-label={lang === 'en' ? `Testimonial ${activeReview + 1} of ${t.reviews.length}` : `মতামত ${activeReview + 1} / ${t.reviews.length}`}>
            {t.reviews.map((review, index) => <button key={review.name} type="button" aria-label={`${index + 1}`} aria-current={activeReview === index} onClick={() => { setActiveReview(index); trackRef.current?.children[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' }) }} />)}
          </div>
          <p className="editorial-demo-note">{lang === 'en' ? 'All testimonials, names, purchases and ratings above are fictional demo content.' : 'উপরের সব মতামত, নাম, কেনাকাটা ও রেটিং কাল্পনিক ডেমো কনটেন্ট।'}</p>
        </div>
      </section>

      <section className="editorial-newsletter" aria-labelledby="editorial-newsletter-title">
        <div className="editorial-newsletter-inner">
          <p className="eyebrow">{t.newsletterEyebrow}</p>
          <h2 id="editorial-newsletter-title">{t.newsletterTitle}</h2>
          <p className="editorial-newsletter-text">{t.newsletterText}</p>
          {!submitted ? <>
            <div className="editorial-form-tabs" role="tablist" aria-label={lang === 'en' ? 'Choose signup method' : 'সাইন আপের মাধ্যম বেছে নিন'}>
              <button type="button" role="tab" aria-selected={!emailMode} onClick={() => { setEmailMode(false); setFormMessage('') }}>{t.phone}</button>
              <button type="button" role="tab" aria-selected={emailMode} onClick={() => { setEmailMode(true); setFormMessage('') }}>{t.email}</button>
            </div>
            <form className="editorial-newsletter-form" onSubmit={submitNewsletter} noValidate>
              <label className="sr-only" htmlFor="editorial-contact">{emailMode ? t.email : t.phone}</label>
              <div className="editorial-input-wrap">
                {!emailMode && <span aria-hidden="true">+880</span>}
                <input id="editorial-contact" type={emailMode ? 'email' : 'tel'} autoComplete={emailMode ? 'email' : 'tel-national'} inputMode={emailMode ? 'email' : 'tel'} value={contactValue} onChange={(event) => { setContactValue(event.target.value); setFormMessage('') }} placeholder={emailMode ? t.emailPlaceholder : t.phonePlaceholder} aria-describedby="editorial-form-message" aria-invalid={Boolean(formMessage && !submitted)} />
              </div>
              <button className="button" type="submit">{t.subscribe}<ArrowRight size={17} aria-hidden="true" /></button>
            </form>
            <p className="editorial-form-message" id="editorial-form-message" role="status">{formMessage}</p>
            <p className="editorial-consent">{t.consent}</p>
          </> : <div className="editorial-success" role="status">
            <Check size={22} aria-hidden="true" />
            <span>{formMessage}</span>
            <div><small>{t.coupon}</small><strong>NOVA200</strong><button type="button" onClick={copyCoupon} aria-label={t.copyCode}>{copied ? <Check size={17} /> : <Copy size={17} />}{copied ? t.copied : t.copyCode}</button></div>
          </div>}
        </div>
      </section>

      <footer className="editorial-footer">
        <div className="container">
          <div className="editorial-footer-main">
            <div className="editorial-footer-brand">
              <Logo footer />
              <p>{lang === 'en' ? 'A little more joy in every delivery.' : 'প্রতিটি ডেলিভারিতে একটু বেশি আনন্দ।'}</p>
              <div className="editorial-socials" aria-label={lang === 'en' ? 'Demo social channels' : 'ডেমো সোশ্যাল চ্যানেল'}>
                <button type="button" aria-label="Instagram" onClick={() => openInfo(t.contact, t.socialBody)}><Camera size={17} strokeWidth={1.5} /></button>
                <button type="button" aria-label="Facebook" onClick={() => openInfo(t.contact, t.socialBody)}><span aria-hidden="true">f</span></button>
                <button type="button" aria-label="Support" onClick={() => openInfo(t.contact, t.contactBody)}><MessageCircle size={17} strokeWidth={1.5} /></button>
              </div>
              <div className="editorial-app-badges"><strong>{t.appTitle}</strong><span>{t.comingSoon} · {lang === 'en' ? 'demo' : 'ডেমো'}</span></div>
            </div>
            <FooterColumn title={t.shop} links={[{ label: t.allProducts, action: () => onCategory('all') }, { label: t.reasons[0][0], action: () => onCategory('delivery') }, { label: lang === 'en' ? 'New arrivals' : 'নতুন পণ্য', action: () => onCategory('new') }]} />
            <FooterColumn title={t.help} links={infoLinks.slice(0, 3).map((item) => ({ label: item.title, action: () => openInfo(item.title, item.body) }))} />
            <FooterColumn title={t.company} links={infoLinks.slice(3).map((item) => ({ label: item.title, action: () => openInfo(item.title, item.body) }))} />
            <div className="editorial-footer-contact">
              <h3>{t.contact}</h3>
              <a href={`tel:${storeConfig.hotline.replace(/[^+\d]/g, '')}`} onClick={(event) => { event.preventDefault(); openInfo(t.contact, t.contactBody) }}><Phone size={15} />{storeConfig.hotline}</a>
              <a href={`mailto:${storeConfig.email}`} onClick={(event) => { event.preventDefault(); openInfo(t.contact, t.contactBody) }}><Mail size={15} />{storeConfig.email}</a>
              <span><MapPin size={15} />{storeConfig.address}</span>
              <small>{storeConfig.hours}</small>
              <small>{lang === 'en' ? `Example: free delivery over ৳${storeConfig.deliveryThreshold.toLocaleString()}` : `উদাহরণ: ৳${storeConfig.deliveryThreshold.toLocaleString()}-এর বেশি অর্ডারে ফ্রি ডেলিভারি`}</small>
            </div>
          </div>
          <div className="editorial-footer-details">
            <div><strong>{t.payments}</strong><div className="editorial-chip-row"><span>bKash</span><span>Nagad</span><span>Rocket</span><span>Visa</span><span>Mastercard</span><span>AmEx</span><span>Cash on delivery</span></div><small>{lang === 'en' ? 'Text-only examples · no official logos' : 'শুধু লেখার উদাহরণ · কোনো অফিসিয়াল লোগো নয়'}</small></div>
            <div><strong>{t.deliveryPartners}</strong><div className="editorial-chip-row"><span>Courier partner A</span><span>Courier partner B</span></div><small>{lang === 'en' ? 'Example names · no partnerships implied' : 'উদাহরণ নাম · কোনো অংশীদারত্ব বোঝায় না'}</small></div>
            <div className="editorial-demo-mark"><BadgeCheck size={15} />{t.demoLabel}</div>
          </div>
          <div className="editorial-footer-bottom"><span>© 2026 Nova Mart · {t.copyright}</span><span>{lang === 'en' ? 'All store details, benefits and policies are examples.' : 'স্টোরের সব তথ্য, সুবিধা ও নীতি উদাহরণমাত্র।'}</span></div>
        </div>
      </footer>

      <div className={`editorial-chat ${chatOpen ? 'is-open' : ''}`}>
        {chatOpen && <div className="editorial-chat-panel" role="dialog" aria-label={t.chatTitle}>
          <div className="editorial-chat-panel-head"><span><strong>{t.chatTitle}</strong><small>{t.chatHint}</small></span><button type="button" aria-label={t.close} onClick={() => setChatOpen(false)}><X size={18} /></button></div>
          <button type="button" onClick={() => openInfo(t.chatInfoTitle, t.chatInfoBody)}><MessageCircle size={17} />{t.messenger}<ChevronDown size={14} /></button>
          <button type="button" onClick={() => openInfo(t.chatInfoTitle, t.chatInfoBody)}><HeartHandshake size={17} />{t.whatsapp}<ChevronDown size={14} /></button>
          <button type="button" onClick={() => openInfo(t.chatInfoTitle, t.chatInfoBody)}><Headphones size={17} />{t.call}<ChevronDown size={14} /></button>
        </div>}
        <button type="button" className="editorial-chat-trigger" aria-label={chatOpen ? t.close : t.chatTitle} aria-expanded={chatOpen} onClick={() => setChatOpen((open) => !open)}>{chatOpen ? <X size={23} /> : <MessageCircle size={23} />}</button>
      </div>
    </>
  )
}

function FooterColumn({ title, links }: { title: string; links: { label: string; action: () => void }[] }) {
  return <details className="editorial-footer-column">
    <summary><h3>{title}</h3><ChevronDown size={17} aria-hidden="true" /></summary>
    <ul>{links.map((link) => <li key={link.label}><button type="button" onClick={link.action}>{link.label}</button></li>)}</ul>
  </details>
}
