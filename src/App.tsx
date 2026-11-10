import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  CreditCard,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Wallet,
  X,
} from "lucide-react";
import { Header } from "./components/Header";
import { EditorialSections } from "./components/EditorialSections";
import { ProductCard, ProductImage } from "./components/ProductCard";
import { Modal } from "./components/Modal";
import { NovaStar } from "./components/Logo";
import {
  products,
  price,
  productName,
  categoryNames,
  searchProducts,
  type Product,
  type Language,
  type Category,
} from "./data/products";
import { cartTotal, restoreCart, updateCart, type CartLine } from "./data/cart";
import { storeConfig } from "./data/config";
import { english } from "./i18n/en";
import { bengali } from "./i18n/bn";
import "./App.css";

type Panel = "cart" | "wishlist" | "search" | "product" | "info" | null;
const categories: { name: Category; image: string; count: string }[] = [
  { name: "Electronics", image: "headphones", count: "1,240" },
  { name: "Fashion", image: "knitwear", count: "2,180" },
  { name: "Beauty", image: "serum", count: "860" },
  { name: "Home", image: "ceramics", count: "940" },
  { name: "Lifestyle", image: "bag", count: "620" },
];
const subcategories = [
  ["Smartphones", "স্মার্টফোন", "phone", "Electronics"],
  ["Earbuds", "ইয়ারবাড", "earbuds", "Electronics"],
  ["Panjabi", "পাঞ্জাবি", "panjabi", "Fashion"],
  ["Saree", "শাড়ি", "festive", "Fashion"],
  ["Kitchen", "রান্নাঘর", "ceramics", "Home"],
  ["Skincare", "ত্বকচর্চা", "serum", "Beauty"],
  ["Watches", "ঘড়ি", "watch", "Lifestyle"],
  ["Bags", "ব্যাগ", "bag", "Lifestyle"],
];
function saved(key: string): unknown {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null");
  } catch {
    return null;
  }
}
function persist(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Shopping still works when storage is unavailable. */
  }
}
function CampaignImage({
  name,
  alt,
  hero = false,
}: {
  name: string;
  alt: string;
  hero?: boolean;
}) {
  return (
    <picture className="campaign-image">
      {hero && (
        <>
          <source
            media="(max-width:640px)"
            type="image/avif"
            srcSet="/images/hero-mobile-780.avif"
          />
          <source
            media="(max-width:640px)"
            srcSet="/images/hero-mobile-780.webp"
          />
        </>
      )}
      <source
        type="image/avif"
        srcSet={`/images/${name}-780.avif 780w, /images/${name}-1440.avif 1440w${hero ? ", /images/hero-2880.avif 2880w" : ""}`}
        sizes="100vw"
      />
      <img
        src={`/images/${name}-1440.webp`}
        srcSet={`/images/${name}-780.webp 780w, /images/${name}-1440.webp 1440w`}
        sizes="100vw"
        alt={alt}
        width="1440"
        height="640"
        loading={hero ? "eager" : "lazy"}
        fetchPriority={hero ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}
function Countdown({ lang }: { lang: Language }) {
  const [remaining, setRemaining] = useState(2 * 86400 + 14 * 3600 + 33 * 60);
  useEffect(() => {
    const id = setInterval(() => setRemaining((n) => Math.max(0, n - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const values = [
    Math.floor(remaining / 86400),
    Math.floor(remaining / 3600) % 24,
    Math.floor(remaining / 60) % 60,
    remaining % 60,
  ];
  return (
    <>
      <div className="countdown" aria-hidden="true">
        {values.map((n, i) => (
          <div key={i}>
            <strong key={n}>{String(n).padStart(2, "0")}</strong>
            <span>
              {
                (lang === "en"
                  ? ["DAYS", "HRS", "MIN", "SEC"]
                  : ["দিন", "ঘণ্টা", "মিনিট", "সেকেন্ড"])[i]
              }
            </span>
          </div>
        ))}
      </div>
      <span className="sr-only">
        {lang === "en"
          ? "Demonstration countdown, not a real offer deadline."
          : "ডেমো কাউন্টডাউন, প্রকৃত অফারের সময়সীমা নয়।"}
      </span>
    </>
  );
}
function Carousel({
  children,
  className = "",
  label,
  lang,
}: {
  children: ReactNode;
  className?: string;
  label: string;
  lang: Language;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  return (
    <div className={`carousel ${className}`}>
      <div className="carousel-controls">
        <button
          className="icon-button"
          aria-label={`Previous ${label}`}
          onClick={() =>
            ref.current?.scrollBy({
              left: -ref.current.clientWidth,
              behavior: "smooth",
            })
          }
        >
          <ArrowLeft size={19} />
        </button>
        <button
          className="icon-button"
          aria-label={`Next ${label}`}
          onClick={() =>
            ref.current?.scrollBy({
              left: ref.current.clientWidth,
              behavior: "smooth",
            })
          }
        >
          <ArrowRight size={19} />
        </button>
      </div>
      <div
        className="product-track"
        ref={ref}
        onScroll={(e) => {
          const t = e.currentTarget;
          setProgress(
            t.scrollLeft / Math.max(1, t.scrollWidth - t.clientWidth),
          );
        }}
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </div>
      <div className="carousel-progress">
        <span style={{ transform: `translateX(${progress * 200}%)` }} />
      </div>
      <span className="sr-only">
        {lang === "en"
          ? "Scroll horizontally for more products"
          : "আরও পণ্য দেখতে পাশে স্ক্রল করুন"}
      </span>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState<Language>(() =>
    saved("nova-language") === "bn" ? "bn" : "en",
  );
  const [cart, setCart] = useState<CartLine[]>(() =>
    restoreCart(saved("nova-cart")),
  );
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const value = saved("nova-wishlist");
    return Array.isArray(value)
      ? [
          ...new Set(
            value.filter(
              (id) =>
                typeof id === "string" && products.some((p) => p.id === id),
            ),
          ),
        ]
      : [];
  });
  const [tab, setTab] = useState("All");
  const [panel, setPanel] = useState<Panel>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product>(products[0]);
  const [variant, setVariant] = useState("");
  const [addedId, setAddedId] = useState("");
  const [info, setInfo] = useState({ title: "", body: "" });
  const addTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = (key: string, fallback?: string) =>
    lang === "en" ? (english[key] ?? key) : (bengali[key] ?? fallback ?? key);
  const subtotal = cartTotal(cart);
  const cartCount = cart.reduce((n, line) => n + line.quantity, 0);
  useEffect(() => {
    document.documentElement.lang = lang;
    persist("nova-language", lang);
  }, [lang]);
  useEffect(() => persist("nova-cart", cart), [cart]);
  useEffect(() => persist("nova-wishlist", wishlist), [wishlist]);
  useEffect(
    () => () => {
      if (addTimer.current) clearTimeout(addTimer.current);
    },
    [],
  );
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.15 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const onInfo = (title: string, body: string) => {
    setInfo({ title, body });
    setPanel("info");
  };
  const onCategory = (category: string) => {
    setPanel(null);
    if (category === "Deals") {
      document.getElementById("deals")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setTab(
      category === "Home & Living"
        ? "Home"
        : [...Object.keys(categoryNames)].includes(category)
          ? category
          : "All",
    );
    document.getElementById("trending")?.scrollIntoView({ behavior: "smooth" });
  };
  const openProduct = (p: Product) => {
    setSelected(p);
    setVariant("");
    setPanel("product");
  };
  const onWish = (id: string) =>
    setWishlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  const add = (p: Product, chosen = "") => {
    if (p.variants && !chosen) {
      openProduct(p);
      return;
    }
    const quantity = cart
      .filter((line) => line.id === p.id)
      .reduce((n, line) => n + line.quantity, 0);
    if (quantity >= p.stock) {
      onInfo(
        t("Demo stock limit"),
        t("You have added all available demo stock for this item."),
      );
      return;
    }
    setCart((current) => updateCart(current, p.id, chosen, 1));
    setAddedId(p.id);
    if (addTimer.current) clearTimeout(addTimer.current);
    addTimer.current = setTimeout(() => setAddedId(""), 2500);
    if (window.innerWidth >= 1024) setPanel("cart");
    else setPanel(null);
  };
  const card = (p: Product, compact = false, rank?: number) => (
    <ProductCard
      key={p.id}
      product={p}
      lang={lang}
      wished={wishlist.includes(p.id)}
      onWish={onWish}
      onAdd={add}
      onOpen={openProduct}
      compact={compact}
      rank={rank}
      addedId={addedId}
    />
  );
  const filtered = searchProducts("", tab);
  const searchResults = searchProducts(query);
  const title =
    panel === "cart"
      ? t("Your shopping bag")
      : panel === "wishlist"
        ? t("Your wishlist")
        : panel === "search"
          ? t("Find your next favourite")
          : panel === "product"
            ? t("A closer look")
            : info.title;
  return (
    <>
      <a className="skip-link" href="#main">
        {t("Skip to content")}
      </a>
      <div id="home" />
      <Header
        lang={lang}
        onLanguage={() => setLang((l) => (l === "en" ? "bn" : "en"))}
        wishlistCount={wishlist.length}
        cartCount={cartCount}
        subtotal={price(subtotal, lang)}
        onSearch={(q) => {
          setQuery(q);
          setPanel("search");
        }}
        onCart={() => setPanel("cart")}
        onWishlist={() => setPanel("wishlist")}
        onAccount={() =>
          onInfo(
            t("Your NOVA account"),
            t(
              "This is a storefront demo. Your bag and wishlist are saved on this device. Account sign-in and order tracking are not connected to a backend.",
            ),
          )
        }
        onCategory={onCategory}
        onInfo={onInfo}
        added={Boolean(addedId)}
      />
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-campaign">
            <CampaignImage
              name="hero"
              alt={t("Warm, natural-light winter fashion editorial")}
              hero
            />
            <div className="hero-gradient" />
            <div className="hero-copy">
              <span className="eyebrow">
                <span className="campaign-dot" />
                {t("11.11 MEGA SALE · NOV 11–15")}
              </span>
              <h1 id="hero-title">
                {lang === "en" ? (
                  <>
                    Dress for the <br />
                    <em>season,</em> not <br />
                    the price.
                  </>
                ) : (
                  <>
                    ঋতুর সাজে,
                    <br />
                    <em>নিজের মতো।</em>
                    <br />
                    সেরা দামে।
                  </>
                )}
              </h1>
              <p className="hero-bangla" lang="bn">
                শীতের নতুন কালেকশন, সেরা দামে
              </p>
              <p className="hero-description">
                {t("Premium knitwear, jackets & home warmers from ৳790.")}
              </p>
              <div className="hero-actions">
                <button
                  className="button large"
                  onClick={() => onCategory("Fashion")}
                >
                  {t("Shop the Edit")}
                  <ArrowRight size={20} />
                </button>
                <button
                  className="button secondary large"
                  onClick={() => onCategory("Deals")}
                >
                  {t("Explore Deals")}
                </button>
              </div>
              <div className="hero-proof">
                <span>
                  <Star size={14} fill="currentColor" /> 4.8
                </span>
                <span>{t("12,000+ reviews · Demo")}</span>
                <i /> <span>{t("COD available")}</span>
              </div>
              <span className="hero-demo">
                {t("Demo campaign · sample pricing & reviews")}
              </span>
            </div>
            <span className="hero-edition">NOVA / THE WINTER EDIT — 2026</span>
            <a
              href="#categories"
              className="hero-scroll"
              aria-label="Explore categories"
            >
              <ArrowDown size={19} />
            </a>
          </div>
          <div className="trust-strip container">
            {[
              {
                icon: <Truck />,
                title: t("Nationwide delivery"),
                body: t(
                  `${storeConfig.districts} districts · ${storeConfig.nationwideDelivery}*`,
                  "৬৪ জেলা · ৩–৫ দিন*",
                ),
              },
              {
                icon: <Wallet />,
                title: t("Cash on Delivery"),
                body: t("Pay when it arrives"),
              },
              {
                icon: (
                  <span className="trust-payment-marks">
                    <img
                      src="/payments/bkash.svg"
                      alt="bKash"
                      width="48"
                      height="32"
                      loading="lazy"
                    />
                    <img
                      src="/payments/nagad.png"
                      alt="Nagad"
                      width="48"
                      height="32"
                      loading="lazy"
                    />
                  </span>
                ),
                title: "bKash & Nagad",
                body: t("Instant mobile pay"),
              },
              {
                icon: <RotateCcw />,
                title: t(
                  `${storeConfig.returnDays}-day easy returns`,
                  "৭ দিনের সহজ রিটার্ন",
                ),
                body: t("A little extra peace of mind*"),
              },
            ].map((item) => (
              <div className="trust-item" key={item.title}>
                {item.icon}
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="trust-disclaimer container">
            {t(
              "* Example delivery & return policies. This is a demo storefront; no orders or payments are processed.",
            )}
          </p>
        </section>

        <section
          id="categories"
          className="category-section section container reveal"
          aria-labelledby="category-title"
        >
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                {t("A LITTLE OF EVERYTHING. ALL WELL CHOSEN.")}
              </span>
              <h2 id="category-title">
                {t("Shop by Category")}{" "}
                <span className="bangla-label" lang="bn">
                  ক্যাটাগরি
                </span>
              </h2>
            </div>
            <button className="text-link" onClick={() => onCategory("All")}>
              {t("All categories")}
              <ArrowRight size={17} />
            </button>
          </div>
          <div className="category-layout">
            <div className="category-bento">
              {categories.map((c) => (
                <button
                  key={c.name}
                  className={`category-tile category-${c.name.toLowerCase()}`}
                  onClick={() => onCategory(c.name)}
                >
                  <div className="category-tile-copy">
                    <h3>
                      {lang === "bn"
                        ? categoryNames[c.name]
                        : c.name === "Home"
                          ? "Home & Living"
                          : c.name}
                    </h3>
                    <span>
                      {c.count} {t("products · demo")}
                    </span>
                  </div>
                  <ProductImage image={c.image} alt="" />
                  <span className="category-arrow">
                    <ArrowRight size={20} />
                  </span>
                  {c.name === "Electronics" && (
                    <span className="category-editorial">
                      {t("Everyday upgrades.")}
                      <br />
                      {t("Extraordinary possibilities.")}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="subcategory-strip">
              {subcategories.map(([en, bn, image, category]) => (
                <button key={en} onClick={() => onCategory(category)}>
                  <span>
                    {image === "festive" ? (
                      <img
                        src="/images/festive-780.webp"
                        width="72"
                        height="72"
                        alt=""
                        loading="lazy"
                      />
                    ) : (
                      <ProductImage image={image} alt="" />
                    )}
                  </span>
                  <strong>{t(en, bn)}</strong>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section
          id="trending"
          className="trending-section section container reveal"
          aria-labelledby="trending-title"
        >
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                {t("WHAT BANGLADESH IS BUYING · DEMO EDIT")}
              </span>
              <h2 id="trending-title">{t("Trending Now")}</h2>
            </div>
            <div
              className="product-tabs"
              role="tablist"
              aria-label="Trending categories"
            >
              {[
                "All",
                "Electronics",
                "Fashion",
                "Home",
                "Beauty",
                "Lifestyle",
              ].map((name) => (
                <button
                  key={name}
                  role="tab"
                  id={`tab-${name}`}
                  aria-controls="trending-products"
                  aria-selected={tab === name}
                  tabIndex={tab === name ? 0 : -1}
                  onKeyDown={(e) => {
                    if (
                      ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
                    ) {
                      e.preventDefault();
                      const tabs = [
                        "All",
                        "Electronics",
                        "Fashion",
                        "Home",
                        "Beauty",
                        "Lifestyle",
                      ];
                      const index =
                        e.key === "Home"
                          ? 0
                          : e.key === "End"
                            ? tabs.length - 1
                            : (tabs.indexOf(name) +
                                (e.key === "ArrowRight" ? 1 : -1) +
                                tabs.length) %
                              tabs.length;
                      setTab(tabs[index]);
                      document.getElementById(`tab-${tabs[index]}`)?.focus();
                    }
                  }}
                  onClick={() => setTab(name)}
                >
                  {name === "All"
                    ? t("All")
                    : lang === "bn"
                      ? categoryNames[name as Category]
                      : name}
                </button>
              ))}
            </div>
          </div>
          <div
            role="tabpanel"
            id="trending-products"
            aria-labelledby={`tab-${tab}`}
          >
            <Carousel key={tab} label="trending products" lang={lang}>
              {filtered.map((p) => card(p))}
            </Carousel>
          </div>
          <button
            className="button secondary mobile-view-all"
            onClick={() => {
              setQuery("");
              setPanel("search");
            }}
          >
            {t("View all trending")}
            <ArrowRight size={18} />
          </button>
          <p className="demo-note catalogue-note">
            {t(
              "Curated demonstration catalogue. All prices, ratings and availability are illustrative.",
            )}
          </p>
        </section>

        <section
          id="deals"
          className="promotions section container reveal"
          aria-label={t("Seasonal campaigns")}
        >
          <div className="flash-band">
            <div className="flash-copy">
              <NovaStar />
              <span className="eyebrow">{t("GOOD FINDS. GREAT PRICES.")}</span>
              <h2>{t("Flash Sale")}</h2>
              <p>{t("Little luxuries. Less to spend.")}</p>
              <Countdown lang={lang} />
              <p className="demo-note">{t("Demo offers & countdown")}</p>
              <button
                className="text-link"
                onClick={() => {
                  setQuery("");
                  setPanel("search");
                }}
              >
                {t("Shop the offers")}
                <ArrowRight size={17} />
              </button>
            </div>
            <div className="flash-products">
              {[products[0], products[4], products[2], products[1]].map((p) =>
                card(p, true),
              )}
            </div>
          </div>
          <div className="editorial-banners">
            <article className="editorial-banner festive-banner">
              <CampaignImage
                name="festive"
                alt={t("Festive South Asian fashion inspiration")}
              />
              <div className="banner-overlay" />
              <div className="banner-copy">
                <span className="eyebrow">
                  {t("ROOTED IN TRADITION. MADE FOR TODAY.")}
                </span>
                <h2>
                  {t("Celebrate the")}
                  <br />
                  <em>{t("art of dressing.")}</em>
                </h2>
                <p>{t("The Eid & Festive Collection")}</p>
                <button
                  className="button light"
                  onClick={() => onCategory("Fashion")}
                >
                  {t("Shop Festive")}
                  <ArrowRight size={18} />
                </button>
              </div>
            </article>
            <article className="editorial-banner tech-banner">
              <CampaignImage
                name="tech"
                alt={t("Premium headphones in a dark studio")}
              />
              <div className="banner-overlay" />
              <div className="banner-copy">
                <span className="eyebrow">TECH WEEK / NOVA SELECT</span>
                <h2>
                  {t("Turn up")}
                  <br />
                  <em>{t("your everyday.")}</em>
                </h2>
                <p>{t("0% EMI up to 6 months*")}</p>
                <button
                  className="button light"
                  onClick={() => onCategory("Electronics")}
                >
                  {t("Explore Tech")}
                  <ArrowRight size={18} />
                </button>
                <small>
                  {t("* Demo promotion · bKash & cards · terms unconfigured")}
                </small>
              </div>
            </article>
          </div>
        </section>

        <section
          id="bestsellers"
          className="bestsellers reveal"
          aria-labelledby="bestsellers-title"
        >
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  {t("THE ONES YOU COME BACK FOR")}
                </span>
                <h2 id="bestsellers-title">{t("Best Sellers")}</h2>
                <p>
                  {t(
                    "Inspired by everyday favourites. Sample 30-day sales rankings.",
                  )}
                </p>
              </div>
              <button
                className="text-link"
                onClick={() => {
                  setQuery("");
                  setPanel("search");
                }}
              >
                {t("Shop all favourites")}
                <ArrowRight size={17} />
              </button>
            </div>
            <div className="bestseller-layout">
              <article className="feature-product">
                <div className="feature-image">
                  <span className="feature-rank">01</span>
                  <ProductImage
                    image="headphones"
                    alt={productName(products[0], lang)}
                  />
                  <span className="badge feature-badge">
                    {t("#1 BEST SELLER · DEMO")}
                  </span>
                  <button
                    className={`icon-button feature-heart ${wishlist.includes("headphones") ? "is-wished" : ""}`}
                    onClick={() => onWish("headphones")}
                    aria-label="Save featured headphones to wishlist"
                    aria-pressed={wishlist.includes("headphones")}
                  >
                    <Heart size={21} />
                  </button>
                </div>
                <div className="feature-copy">
                  <span className="eyebrow">
                    NOVA SOUND / THE LISTENING EDIT
                  </span>
                  <h3>{productName(products[0], lang)}</h3>
                  <p className="feature-description">
                    {t(
                      "Your world. A little quieter. Rich, immersive sound for the moments that are yours.",
                    )}
                  </p>
                  <div className="feature-price">
                    <strong>{price(products[0].price, lang)}</strong>
                    <span>
                      <Star size={14} fill="currentColor" /> 4.8{" "}
                      <small>{t("(1.2k) · Demo")}</small>
                    </span>
                  </div>
                  <button
                    className="button large"
                    onClick={() => add(products[0])}
                  >
                    <ShoppingBag size={19} />
                    {t("Add to cart")}
                    <ArrowRight size={19} />
                  </button>
                  <p className="demo-note">
                    <Truck size={14} />
                    {t(
                      `Dhaka delivery: ${storeConfig.dhakaDelivery} · example estimate`,
                      "ঢাকায় ডেলিভারি: ২৪–৪৮ ঘণ্টা · নমুনা সময়",
                    )}
                  </p>
                </div>
              </article>
              <div className="bestseller-grid">
                {products.slice(1, 7).map((p, i) => card(p, false, i + 2))}
              </div>
            </div>
            <button
              className="button secondary mobile-view-all"
              onClick={() => {
                setQuery("");
                setPanel("search");
              }}
            >
              {t("See all best sellers")}
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
        <EditorialSections
          lang={lang}
          onCategory={onCategory}
          onInfo={onInfo}
        />
      </main>
      <div className="sr-only" role="status" aria-live="polite">
        {addedId ? t("Product added to your shopping bag.") : ""}
      </div>
      {panel && (
        <Modal
          key={panel}
          title={title}
          onClose={() => setPanel(null)}
          drawer={panel === "cart" || panel === "wishlist"}
        >
          {panel === "cart" && (
            <>
              {cart.length ? (
                <>
                  <div className="delivery-progress">
                    <Truck size={20} />
                    <p>
                      {subtotal >= storeConfig.deliveryThreshold
                        ? t("Your demo bag qualifies for free delivery.")
                        : t(
                            `Add ${price(storeConfig.deliveryThreshold - subtotal, lang)} more for free delivery.`,
                            `ফ্রি ডেলিভারির জন্য আরও ${price(storeConfig.deliveryThreshold - subtotal, lang)} যোগ করুন।`,
                          )}
                    </p>
                    <div>
                      <span
                        style={{
                          width: `${Math.min(100, (subtotal / storeConfig.deliveryThreshold) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <ul className="cart-lines">
                    {cart.map((line) => {
                      const p = products.find((p) => p.id === line.id)!;
                      return (
                        <li key={`${line.id}-${line.variant}`}>
                          <ProductImage
                            image={p.image}
                            alt={productName(p, lang)}
                          />
                          <div>
                            <h3>{productName(p, lang)}</h3>
                            {line.variant && (
                              <span className="demo-note">
                                {t("Size")}: {line.variant}
                              </span>
                            )}
                            <strong>
                              {price(p.price * line.quantity, lang)}
                            </strong>
                            <div className="quantity-control">
                              <button
                                aria-label={`Decrease ${p.name} quantity`}
                                onClick={() =>
                                  setCart((c) =>
                                    updateCart(c, p.id, line.variant, -1),
                                  )
                                }
                              >
                                <Minus size={15} />
                              </button>
                              <span aria-label="Quantity">{line.quantity}</span>
                              <button
                                aria-label={`Increase ${p.name} quantity`}
                                disabled={
                                  cart
                                    .filter((l) => l.id === p.id)
                                    .reduce((n, l) => n + l.quantity, 0) >=
                                  p.stock
                                }
                                onClick={() =>
                                  setCart((c) =>
                                    updateCart(c, p.id, line.variant, 1),
                                  )
                                }
                              >
                                <Plus size={15} />
                              </button>
                            </div>
                          </div>
                          <button
                            className="remove-line"
                            aria-label={`Remove ${p.name} from cart`}
                            onClick={() =>
                              setCart((c) => c.filter((l) => l !== line))
                            }
                          >
                            <X size={18} />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="cart-summary">
                    <div>
                      <span>{t("Subtotal")}</span>
                      <strong>{price(subtotal, lang)}</strong>
                    </div>
                    <p className="demo-note">
                      {t("Demo only. Delivery fees and taxes are not charged.")}
                    </p>
                    <button
                      className="button large"
                      onClick={() =>
                        onInfo(
                          t("Your demo bag is ready"),
                          t(
                            "Checkout is not connected. No order has been placed and no payment will be taken. Cash on Delivery, bKash and Nagad are shown as example payment options.",
                          ),
                        )
                      }
                    >
                      {t("Preview checkout")}
                      <ArrowRight size={19} />
                    </button>
                    <div className="cart-payments">
                      <Wallet size={17} /> COD <span>·</span> bKash{" "}
                      <span>·</span> Nagad <CreditCard size={17} />
                    </div>
                  </div>
                </>
              ) : (
                <Empty
                  icon={<ShoppingBag size={42} />}
                  title={t("A little room for something lovely.")}
                  body={t(
                    "Your shopping bag is empty. Explore the edit to find your everyday favourites.",
                  )}
                  onAction={() => {
                    setPanel(null);
                    onCategory("All");
                  }}
                  action={t("Start exploring")}
                />
              )}
            </>
          )}
          {panel === "wishlist" && (
            <>
              {wishlist.length ? (
                <>
                  <p className="modal-note">
                    {t("Your favourites, saved on this device.")}
                  </p>
                  <div className="results-grid">
                    {products
                      .filter((p) => wishlist.includes(p.id))
                      .map((p) => card(p))}
                  </div>
                </>
              ) : (
                <Empty
                  icon={<Heart size={42} />}
                  title={t("Keep a little wish list.")}
                  body={t("Tap a heart on any product to save it here.")}
                  onAction={() => setPanel(null)}
                  action={t("Keep exploring")}
                />
              )}
            </>
          )}
          {panel === "search" && (
            <>
              <form
                className="modal-search"
                onSubmit={(e) => e.preventDefault()}
              >
                <Search size={21} />
                <input
                  autoFocus
                  aria-label={t("Search products")}
                  placeholder={t("Search products, brands, categories…")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                  >
                    <X size={18} />
                  </button>
                )}
              </form>
              <p className="modal-note" role="status">
                {searchResults.length} {t("products in our demo collection")}
              </p>
              {searchResults.length ? (
                <div className="results-grid search-results">
                  {searchResults.map((p) => card(p))}
                </div>
              ) : (
                <Empty
                  icon={<Search size={42} />}
                  title={t("No matches just yet.")}
                  body={t(
                    "Try “headphones”, “serum” or a category like “Fashion”.",
                  )}
                  onAction={() => setQuery("")}
                  action={t("Explore all products")}
                />
              )}
            </>
          )}
          {panel === "product" && (
            <div className="product-detail">
              <ProductImage
                image={selected.image}
                alt={productName(selected, lang)}
              />
              <div>
                <span className="eyebrow">{selected.brand}</span>
                <h3>{productName(selected, lang)}</h3>
                <p className="detail-rating">
                  <Star size={16} fill="currentColor" /> {selected.rating} ·{" "}
                  {t("Demonstration rating")}
                </p>
                <div className="price-row">
                  <strong>{price(selected.price, lang)}</strong>
                  {selected.original && (
                    <del>{price(selected.original, lang)}</del>
                  )}
                </div>
                <p>
                  {t(
                    "Thoughtfully selected for your everyday. This is a sample product with illustrative photography and pricing.",
                  )}
                </p>
                {selected.variants && (
                  <fieldset className="variant-options">
                    <legend>{t("Choose your size")}</legend>
                    {selected.variants.map((size) => (
                      <label key={size}>
                        <input
                          type="radio"
                          name="size"
                          value={size}
                          checked={variant === size}
                          onChange={() => setVariant(size)}
                        />
                        <span>{size}</span>
                      </label>
                    ))}
                  </fieldset>
                )}
                <button
                  className="button large"
                  disabled={Boolean(selected.variants && !variant)}
                  onClick={() => add(selected, variant)}
                >
                  <ShoppingBag size={19} />
                  {selected.variants && !variant
                    ? t("Choose a size")
                    : t("Add to cart")}
                </button>
                <button
                  className="text-link"
                  onClick={() => onWish(selected.id)}
                >
                  <Heart
                    size={17}
                    fill={
                      wishlist.includes(selected.id) ? "currentColor" : "none"
                    }
                  />
                  {wishlist.includes(selected.id)
                    ? t("Saved to wishlist")
                    : t("Save for later")}
                </button>
                <p className="demo-note">
                  <PackageCheck size={15} />
                  {t("COD · bKash · Nagad (demo options)")}
                </p>
              </div>
            </div>
          )}
          {panel === "info" && (
            <div className="info-panel">
              <Sparkles size={34} />
              <p>{info.body}</p>
              <button className="button" onClick={() => setPanel(null)}>
                {t("Continue exploring")}
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
function Empty({
  icon,
  title,
  body,
  onAction,
  action,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  onAction: () => void;
  action: string;
}) {
  return (
    <div className="empty-state">
      {icon}
      <h3>{title}</h3>
      <p>{body}</p>
      <button className="button" onClick={onAction}>
        {action}
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
