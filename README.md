# NOVA MART

A premium, bilingual Bangladesh e-commerce **frontend demonstration**, implemented from the NOVA MART “Modern Bazaar, Editorial Calm” Homepage Design Blueprint v1.0.

## Run locally

Requires Node.js **22.18+** (24 LTS recommended) and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The development server listens on `0.0.0.0` for sandbox previews. No environment variables, API keys, database, or paid service is needed.

```sh
npm run typecheck  # TypeScript project checks
npm run lint       # Oxlint, including React hook rules
npm test           # Five Node test suites for pricing/search/cart
npm run build      # TypeScript + optimized production bundle
npm run preview    # Inspect the production output locally
```

There is no deployment configuration or automatic merge workflow.

## Stack and structure

React 19, TypeScript, Vite, CSS custom properties, Lucide icons, and self-hosted Fontsource fonts (Fraunces, Inter, Noto Serif Bengali, Hind Siliguri). Dependencies are locked in `package-lock.json`.

- `src/tokens.css`, `src/index.css`: exact brand palette, type, spacing, radius, motion, and shared primitives.
- `src/App.tsx`, `src/App.css`: hero, trust strip, category bento, trending carousel, flash/editorial campaigns, best sellers, and shopping state.
- `src/components/Header.tsx`: announcement, responsive header, mega navigation, mobile drawer, bottom bar.
- `src/components/ProductCard.tsx`, `Modal.tsx`, `Logo.tsx`: reusable product, imagery, dialog, and brand components.
- `src/components/EditorialSections.tsx`: trust benefits, sample reviews, newsletter, footer, and support widget.
- `src/data/products.ts`: sample catalogue, English/Bangla product names, category/search and price formatting.
- `src/data/cart.ts`: immutable stock-aware cart operations and safe stored-state restoration.
- `src/data/config.ts`: configurable **example** hotline, address, hours, delivery threshold, fees, estimates, and return window.
- `src/i18n/en.ts`, `src/i18n/bn.ts`: main storefront strings. Header and editorial components contain their own bilingual copy maps.
- `public/images/`, `public/IMAGE-CREDITS.md`: local optimized images and sources.
- `public/payments/CREDITS.md`: payment mark sources and trademark caveats.
- `tests/shop.test.ts`: domain regression tests.

## Implemented experience

All 11 homepage sections, plus the overlapping trust strip, mobile bottom navigation, and delayed support button. Layouts target 1440px desktop, 768px tablet, and 390px mobile. Product and review rows use native horizontal scrolling and snapping.

Search matches English/Bangla names, brands and categories. Category tabs and navigation filter the catalogue. Product details support size selection; cart quantities respect shared stock across sizes. Wishlist, cart and language persist locally and gracefully tolerate unavailable browser storage. Native dialogs provide focus trapping, Escape dismissal and focus restoration. Motion respects reduced-motion preferences. Prices use `en-IN`/`bn-BD` grouping with a Bengali taka font fallback.

## Demo boundaries and launch requirements

**No real orders, payments, accounts, messages, or subscriptions are processed.** Checkout, tracking, account, social and support actions explicitly explain their demo status. Newsletter validates a Bangladesh phone number or email and displays a local sample coupon, but does not transmit or retain contact details.

All products, brands, prices, stock, sales rankings, customer counts, reviews, names, ratings and promotions are illustrative. Demo labels appear alongside them. No fictional review is presented as a verified purchase. Payment logos do not imply a provider relationship. Delivery and return policies are unverified examples. Configure and legally review every business claim before launch.

Stock photography is illustrative, not proof of a real product, customer, place or ethnicity. The winter hero is a stock editorial substitute rather than a commissioned Dhaka/South Asian shoot. See image credits for additional photo limitations. Provider-approved production marks and commissioned product photography should replace demo assets before launch. The sample store does not collect analytics or send data to third-party services at runtime; images and fonts are served locally.

## Verification

See `VERIFICATION.md` for the actual checks performed, viewport evidence, and known limitations. This repository is a frontend implementation, not a production commerce backend.
