# Render Contract — Hound Around Resort (`hound-3`)

**Audited:** 2026-07-10 · **Companion:** `schema-inventory.json`, `REPORT.md`
**Purpose:** the post-projection data contract a replacement content adapter must satisfy. Shapes below are what components *receive after GROQ projection*, not what is stored.

Conventions used in shape notation: `?` = optional key; `RawImage`, `Button`, `DereferencedLink`, `PT` are defined once in §2.1 and reused. "n=X, key:Y" presence counts come from a read-only query over all published page/service docs (2026-07-10).

---

## 1. ROUTING MAP

| Route | File | Query | Slug → document | Notes |
|---|---|---|---|---|
| `/` | `frontend/app/page.tsx` | `homepageQuery` | hardcoded `slug.current == 'homepage'` on `page` | Renders `<PageBuilder>`; empty-state JSX if no doc. `generateMetadata` refetches with `stega:false`; canonical `'/'` |
| `/[slug]` | `frontend/app/[slug]/page.tsx` | `getPageQuery` (`$slug`) | `page` by `slug.current == $slug` | `generateStaticParams` ← `pagesSlugs` (perspective `'published'`, `stega:false`). NOTE: slug `homepage` is also reachable at `/homepage` — no exclusion. Canonical `/${slug}` |
| `/services/[slug]` | `frontend/app/services/[slug]/page.tsx` | `getServiceQuery` (`$slug`) | `service` by `slug.current == $slug` | `generateStaticParams` ← `serviceSlugs`. Extra top-level fields: `title`, `heading`, `shortDescription`. Canonical `/services/${slug}` |
| Root layout (all routes) | `frontend/app/layout.tsx` | `settingsQuery` + `servicesNavQuery` | `settings` singleton + all services | See §5 |
| `/sitemap.xml` | `frontend/app/sitemap.ts` | `sitemapData` | all page+service with slugs | Host from request `headers()`; `noIndex` excluded; `/services` prefix for services; priorities 1 / 0.8 / 0.7 |
| `/robots.txt` | `frontend/app/robots.ts` | none | — | Static; hardcoded `https://houndaroundresort.com/sitemap.xml` |
| `/studio/[[...tool]]` | `frontend/app/studio/[[...tool]]/page.tsx` + `layout.tsx` | none (NextStudio) | — | Embedded Studio from `frontend/sanity.config.ts`; layout hides site header/footer via CSS. **Deleted at migration** |
| `POST /api/contact` | `frontend/app/api/contact/route.ts` | none | — | Nodemailer; no CMS dependency |
| `GET /api/draft-mode/enable` | `frontend/app/api/draft-mode/enable/route.ts` | — | — | `defineEnableDraftMode`; **deleted at migration** |
| `GET/POST /api/webcam-auth` | `frontend/app/api/webcam-auth/route.ts` | none | — | Env password + hours gate; no CMS dependency |
| 404 / error | `frontend/app/not-found.tsx`, `error.tsx` | none | — | Static JSX, no fetch. Note: `[slug]`/`services/[slug]` pages do **not** call `notFound()` — a missing doc renders inline "Page not found" JSX with HTTP 200 (`[slug]/page.tsx:45-52`) |

Non-page-builder renders: only `/sitemap.xml`, `/robots.txt`, `/studio`, the API routes, and the not-found/error boundaries. Everything user-facing is `PageBuilder` → `BlockRenderer` (`frontend/app/components/{PageBuilder,BlockRenderer}.tsx`).

---

## 2. PROJECTION DELTA

Source of truth: `frontend/sanity/lib/queries.ts` (fragments `linkReference`, `linkFields`, `buttonFields`, `pageBuilderExpansion`).

### 2.1 Shared shapes (define once, reuse everywhere)

```ts
// IMAGES ARE NEVER DEREFERENCED. No ->url, no lqip, no dimensions, no metadata
// anywhere in queries.ts (sole exception: settings favicon.asset->url, §5).
// Components receive the stored reference and build CDN URLs themselves from asset._ref
// (frontend/app/components/SanityImage.tsx, frontend/sanity/lib/image.ts).
type RawImage = {
  _type: 'image'
  asset: { _type: 'reference', _ref: string }   // 'image-<sha>-<W>x<H>-<ext>' — lightbox parses WxH from this string (image.ts:23)
  crop?: {...sanity crop}                        // only when editor cropped
  hotspot?: {...sanity hotspot}
  alt?: string                                   // only on images whose schema defines an alt field
  caption?: string                               // gallery images only
}

// LINKS: the one true dereference. `page` (stored reference) is REPLACED by the
// target's slug string; `pageType` is ADDED. All other stored keys spread through
// — including stale `href` values that coexist with page refs in live data.
type DereferencedLink = {                        // fragment `linkReference`, queries.ts:3-8
  _type: 'link'
  linkType?: 'href' | 'page'
  href?: string
  page?: string | null                           // WAS {_ref} — NOW target slug.current
  pageType?: string | null                       // ADDED — target _type ('page' | 'service')
  queryString?: string
  openInNewTab?: boolean
}
// Consumed by linkResolver (frontend/sanity/lib/utils.ts:31-56):
//   href → link.href · page → `/${page}` or `/services/${page}` if pageType==='service', + queryString
//   missing linkType with href present is coerced to 'href'.

type Button = { _type: 'button', buttonText?: string, link?: DereferencedLink }

// PORTABLE TEXT: stored block array passes through EXCEPT markDefs, where each
// link annotation gets the same page→slug replacement + pageType addition:
//   content[]{..., markDefs[]{..., _type=="link" => {"page": page->slug.current, "pageType": page->_type}}}
type PT = PortableTextBlock[]                    // spans/styles/decorators untouched
```

### 2.2 Per-query delta

**`settingsQuery`** — see §5 (only place with an asset URL deref: `"faviconUrl": favicon.asset->url`).

**`getPageQuery` / `homepageQuery`** — top level: `{_id, _type, name, slug: {_type:'slug', current}, seo, pageBuilder}` (everything else stored on the doc is dropped). `pageBuilder` is a computed re-projection (`"pageBuilder": pageBuilder[]{...}`) with per-`_type` conditional deltas:

| Block `_type` | Delta vs stored |
|---|---|
| callToAction | `button` → Button (link deref) |
| infoSection | `content` markDefs deref (PT rule). Note: this conditional has no leading `...` (queries.ts:70-78), unlike its siblings — harmless because GROQ merges conditionals into the outer `pageBuilder[]{...}` projection, whose spread already passes `heading`/`subheading` through; the sibling conditionals' extra `...` is redundant |
| hero, heroSplit | `primaryCta`, `secondaryCta` → Button |
| heroBanner | `primaryCta` → Button |
| featureCards, ctaBanner, processSteps, fullWidthMedia, ctaStrip, featureGrid | `cta` → Button |
| serviceTabs | `tabs[]` reference array → **expanded service docs**: `{_id, title, slug: {current}, sticker: {asset, alt}, shortDescription, tabImage: {asset, crop, hotspot, alt}, tabCta: Button}` — note `sticker` loses crop/hotspot keys (projected to `{asset, alt}` only) |
| testimonials | `reviews[]` reference array → expanded `{_id, quote, authorName, authorLabel, rating}` |
| splitContent, requirementsList | nested `link.link` → DereferencedLink |
| faqAccordion | `faqs[].answer` markDefs deref (PT rule) |
| contactForm | `description` markDefs deref (PT rule) |
| featureList | `features[].body` markDefs deref + `features[].cta` → Button (with spread) |
| contentColumns | `columns[].body` markDefs deref + `columns[].cta` → Button (with spread) |
| pricingTable | `categories[].tiers[].cta` → Button |
| pricingCalculator, pricingPageTabs | `ctaLink` → DereferencedLink |
| webcamGrid | **ADDED computed field** `webcams`: sibling subquery `*[_type=="webcam" && enabled==true] \| order(group asc, sortOrder asc){_id, name, cameraId, group, sortOrder}` — not stored on the block at all |
| statsBar, heroMinimal, iconGrid, videoSection, logoBar, pricingMatrix, pricingList, policyNotes, whatsIncluded, serviceCards*, galleryGrid, galleryCarousel, galleryShowcase, galleryPage, imageRow, teamGrid, valuePillars | pass-through `...` (serviceCards additionally derefs `cards[].cta`) |

**`getServiceQuery`** — same pageBuilder expansion; top level `{_id, _type, title, slug, heading, shortDescription, seo, pageBuilder}`.

**`sitemapData`** — computed/renamed: `{"slug": slug.current, _type, _updatedAt, "noIndex": seo.noIndex}`.
**`pagesSlugs`/`serviceSlugs`** — `{"slug": slug.current}`. **`servicesNavQuery`** — `{_id, title, "slug": slug.current}` ordered `title asc`.

### 2.3 Before/after sketch — homepage `hero` block (real data, doc `c155f75d-…`)

```jsonc
// STORED (raw dataset)                          // RECEIVED by Hero.tsx (post-projection)
{                                                {
  "_key": "c8e685634f84",                          "_key": "c8e685634f84",
  "_type": "hero",                                 "_type": "hero",
  "eyebrow": "Southeast Twin Cities …",            "eyebrow": "Southeast Twin Cities …",
  "heading": "The place your dog …",               "heading": "The place your dog …",
  "subtext": "More than daycare. …",               "subtext": "More than daycare. …",
  "reviewRating": 4.8,                             "reviewRating": 4.8,
  "reviewText": "4.8/5 Star Reviews",              "reviewText": "4.8/5 Star Reviews",
  "trustLine": "Trusted by hundreds …",            "trustLine": "Trusted by hundreds …",
  "primaryCta": {                                  "primaryCta": {
    "_type": "button",                               "_type": "button",
    "buttonText": "Schedule a Tour",                 "buttonText": "Schedule a Tour",
    "link": {                                        "link": {
      "_type": "link",                                 "_type": "link",
      "linkType": "href",                              "linkType": "href",
      "href": "https://booking.goose.pet/…",           "href": "https://booking.goose.pet/…",
      "openInNewTab": true,                            "openInNewTab": true,
      "page": {                                        "page": "contact",      // ← _ref REPLACED by slug
        "_ref": "9b6d4e4a-…",                          "pageType": "page"      // ← ADDED
        "_type": "reference"                         }
      }                                            }
    }                                            },
  },                                             "secondaryCta": { …same treatment…
  "secondaryCta": { …stale href                    // stale "href": "https://www.google.com" passes
    "https://www.google.com" +                     // through; linkResolver ignores it (linkType='page')
    linkType "page" + page _ref… }                 "link": { …, "page": "pricing", "pageType": "page" } }
}                                                }
// Page wrapper: {_id, _type:"page", name:"Home", slug:{_type:"slug","current":"homepage"}, seo: null, pageBuilder:[…]}
```

---

## 3. BLOCK PROPS CONTRACT (23 live block types)

Every block component receives `{block, index: number, pageId: string, pageType: string}` from `BlockRenderer.tsx:116-124` (`index` drives eager-loading/animation in Hero, HeroSplit, CtaBanner; `pageId`/`pageType` only feed `dataAttr` overlays — dead weight post-migration). Shapes below are the `block` prop. Presence counts (`n` = live instances; `k:X` = key present on X of n) from the 2026-07-10 dataset — **any key below count n is optional-in-practice; components null-guard every field**.

| Block | Component | Resolved `block` shape (post-projection) | Live presence (n; notable gaps) |
|---|---|---|---|
| hero | `sections/Hero.tsx` | `{eyebrow?, heading, subtext?, primaryCta?: Button, secondaryCta?: Button, reviewRating?: number, reviewText?, trustLine?, heroImage?: RawImage}` | n=1; **heroImage absent** — hero renders text-only today |
| heroSplit | `sections/HeroSplit.tsx` | `{eyebrow?, heading, body?: string (plain text, NOT PT), primaryCta?: Button, secondaryCta?: Button, image: RawImage+alt, stickerImage?: RawImage+alt, imagePosition?: 'left'\|'right', backgroundColor?: 'cream'\|'sand'\|'forest'}` | n=4; stickerImage 3/4, rest full |
| heroBanner | `sections/HeroBanner.tsx` | `{eyebrow?, heading, subtext?, primaryCta?: Button, backgroundImage?: RawImage, overlayOpacity?: 'light'\|'medium'\|'heavy', minHeight?: 'standard'\|'tall'\|'fullscreen', backgroundColor?}` | n=1; **backgroundImage & backgroundColor absent** |
| heroMinimal | `sections/HeroMinimal.tsx` | `{eyebrow?, rating?: string, heading, headingAccent?, subtext?, backgroundColor?}` | n=1; rating absent |
| ctaBanner | `sections/CtaBanner.tsx` | `{heading, icon?: RawImage+alt, stickerImage?: RawImage+alt, backgroundImage?: RawImage+alt, sideImage?: RawImage+alt, cta?: Button, showRating?: boolean, ratingText?}` — sideImage presence switches layout | n=4; backgroundImage 1/4, icon 1/4, sideImage 3/4, stickerImage 3/4 |
| ctaStrip | `sections/CtaStrip.tsx` | `{heading, subtext?, cta: Button, backgroundColor?: +'terracotta'}` | n=6; all full |
| serviceTabs | `sections/ServiceTabs.tsx` | `{eyebrow?, heading, tabs?: Array<{_id, title, slug: {current}, sticker?: {asset, alt}, shortDescription?, tabImage?: {asset, crop, hotspot, alt}, tabCta?: Button}>}` (expanded service docs) | n=1 (homepage), 3 tabs |
| statsBar | `sections/StatsBar.tsx` | `{stats?: Array<{_key, value, label}>, showLogo?: boolean}` | n=2; full |
| testimonials | `sections/Testimonials.tsx` | `{icon?: RawImage+alt, heading, reviews?: Array<{_id, quote, authorName, authorLabel?, rating?}>, googleRating?: string}` (googleReviewCount arrives but is dead) | n=1; full |
| splitContent | `sections/SplitContent.tsx` | `{heading, body?: PT, link?: {label?, link?: DereferencedLink}, badge?: RawImage+alt, image?: RawImage+alt, stickerImage?: RawImage+alt, imagePosition?, backgroundColor?}` | n=4; link 3/4, stickerImage 2/4, badge 0/4 |
| faqAccordion | `sections/FaqAccordion.tsx` | `{eyebrow?, heading, faqs?: Array<{_key, question, answer?: PT}>}` | n=6; full |
| featureCards | `sections/FeatureCards.tsx` | `{heading, subheading?, stickerLeft?: RawImage+alt, stickerRight?: RawImage+alt, features?: Array<{_key, icon?: IconifyName, title, description?}>, cta?: Button, trustLine?}` (darkMode arrives, dead) | n=1; full |
| iconGrid | `sections/IconGrid.tsx` | `{eyebrow?, heading, description?, items?: Array<{_key, icon?: IconifyName, title, description?}>, columns?: 2\|3\|4, accentImage?: RawImage+alt, backgroundColor?}` | n=2; description/eyebrow/accentImage 1/2 |
| processSteps | `sections/ProcessSteps.tsx` | `{eyebrow?, heading, description?, steps?: Array<{_key, title, badge?, description?, icon?: IconifyName}>, cta?: Button, backgroundColor?}` | n=4; cta 3/4, description 1/4 |
| requirementsList | `sections/RequirementsList.tsx` | `{eyebrow?, heading, description?, items?: Array<{_key, text?}>, link?: {label?, link?: DereferencedLink}, image?: RawImage+alt, imagePosition?, backgroundColor?}` | n=2; link 1/2 |
| whatsIncluded | `sections/WhatsIncluded.tsx` | `{eyebrow?, heading?, description?, items?: Array<{_key, icon?: IconifyName, title, description?}>, layout?: 'card'\|'inline', columns?: 2\|3\|4, backgroundColor?, iconColor?: 'terracotta'\|'forest'\|'muted'}` | n=4; description 3/4 |
| galleryGrid | `sections/GalleryGrid.tsx` | `{eyebrow?, heading?, images?: RawImage[]+alt+caption, columns?: 2\|3\|4, displayStyle?: 'grid'\|'circles', enableLightbox?: boolean, accentImage?: RawImage+alt, backgroundColor?}` | n=4; heading 3/4, eyebrow 1/4, displayStyle 1/4, accentImage 2/4 |
| galleryCarousel | `sections/GalleryCarousel.tsx` | `{eyebrow?, heading?, images?: RawImage[]+alt+caption, enableLightbox?: boolean, backgroundColor?}` | n=2; heading/eyebrow/enableLightbox 1/2 |
| galleryPage | `sections/GalleryPage.tsx` | `{heading?, subtext?, images?: RawImage[]+alt+caption, layout?: 'grid'\|'single', backgroundColor?}` | n=1; full |
| webcamGrid | `sections/WebcamGrid.tsx` | `{heading?, subtext?, trustMessage?, showGroupHeaders?: boolean, webcams: Array<{_id, name, cameraId, group: 'indoor'\|'outdoor', sortOrder?}>}` — `webcams` is query-injected, pre-filtered (enabled) and pre-sorted | n=1; **subtext & trustMessage absent** |
| contactForm | `sections/ContactForm.tsx` | `{eyebrow?, heading, description?: PT, formFields?: Array<{_key, fieldName, label, type?: 'text'\|'email'\|'tel'\|'textarea'\|'select', required?: boolean, options?: string[]}>, submitButtonText?, successMessage?, showMap?: boolean, mapEmbedUrl?, image?: RawImage+alt, address?, phone?, email?, nextSteps?: Array<{_key, title, description?}>}` — also reads `?service=` searchParam to preselect a select field | n=1; **description & mapEmbedUrl absent** |
| pricingCalculator | `sections/PricingCalculator.tsx` | `{displayMode?: 'single'\|'tabbed', calculatorType?: 'daycare'\|'boarding'\|'grooming', eyebrow?, heading, subheading?, ctaText?, ctaLink?: DereferencedLink, taxNote?}` — prices come from `app/data/pricingData.ts`, NOT the block | n=3; **displayMode absent (all default to single)** |
| pricingPageTabs | `sections/PricingPageTabs.tsx` | `{eyebrow?, heading, description?, defaultTab?: 'daycare'\|'boarding'\|'grooming', services?: Array<{_key, serviceKey, pricingDisplay?: 'table'\|'matrix', tableData?: {categories?: Array<{_key, categoryName?, tiers?: Array<{_key, name?, price?, description?, features?: string[], highlighted?: boolean}>}>, description?}, matrixData?: {description?, tables?: Array<{_key, tableName?, tableDescription?, columnHeaders?: string[], rows?: Array<{_key, rowLabel?, cells?: Array<{_key, value?, note?}>}>}>, footnotes?: string[]}, showCalculator?: boolean}>, ctaText?, ctaLink?: DereferencedLink, taxNote?}` | n=1 (pricing page); stored pass-through except ctaLink |

Dead blocks (schema+component exist, zero live instances — adapter may skip): callToAction, infoSection, imageRow, webcamPreview, teamGrid, contentColumns, videoSection, fullWidthMedia, logoBar, pricingMatrix, pricingList, policyNotes, featureGrid, serviceCards, featureList, pricingTable, galleryShowcase, valuePillars.

---

## 4. PREVIEW/EDITING COUPLING INVENTORY

Surface area that exists only for Sanity live preview / visual editing — the deletion list at migration:

**Infrastructure (whole files):**

| File | Coupling |
|---|---|
| `frontend/sanity/lib/live.ts` | `defineLive` → `sanityFetch` + `SanityLive` (the fetch layer itself) |
| `frontend/sanity/lib/client.ts` | `stega: {studioUrl}` on the client |
| `frontend/sanity/lib/token.ts`, `api.ts` | token + `studioUrl` for edit-intent links |
| `frontend/sanity/lib/utils.ts:58-67` | `dataAttr` / `createDataAttribute` |
| `frontend/app/api/draft-mode/enable/route.ts` | `defineEnableDraftMode` |
| `frontend/app/actions.ts` | `disableDraftMode` server action |
| `frontend/app/components/DraftModeToast.tsx` | draft-mode UI (`useDraftModeEnvironment` from `next-sanity/hooks`) |
| `frontend/app/client-utils.ts` | `handleError` for `<SanityLive/>` CORS toasts |
| `frontend/app/studio/[[...tool]]/{page,layout}.tsx`, `frontend/sanity.config.ts`, `frontend/sanity.cli.ts` | embedded Studio |
| `frontend/app/layout.tsx:20-33,136,232-238` | `draftMode()`, `VisualEditing`, `DraftModeToast`, `SanityLive` |

**Structural components:**

- `frontend/app/components/PageBuilder.tsx:84-106` — `useOptimistic` (from `next-sanity/hooks`) drag-and-drop reconciliation + `dataAttr` wrapper
- `frontend/app/components/BlockRenderer.tsx:128-133` — per-block `data-sanity={dataAttr(...)}` overlay attribute (the only reason `pageId`/`pageType` props exist)

**`sanityFetch` callers (replace with adapter calls):** `app/layout.tsx`, `app/page.tsx`, `app/[slug]/page.tsx`, `app/services/[slug]/page.tsx`, `app/sitemap.ts`.

**`stegaClean()` callers (strip once stega encoding is gone) — 25 files:** `Cta.tsx`, and sections/ `ContactForm, ContentColumns, CtaStrip, FeatureGrid, FeatureList, FullWidthMedia, GalleryCarousel, GalleryGrid, GalleryPage, GalleryShowcase, HeroBanner, HeroMinimal, HeroSplit, IconGrid, LogoBar, PolicyNotes, PricingList, PricingMatrix, ProcessSteps, RequirementsList, ServiceCards, SplitContent, ValuePillars, VideoSection, WhatsIncluded` (each calls it on enum-ish fields like `backgroundColor`/`layout`/`imagePosition` because stega pollutes string comparisons). Adapter returning clean strings makes every call a no-op → delete.

`NOT FOUND`: no other draft/preview mechanism (no `previewData`, no bypass cookies beyond Next draft mode).

---

## 5. SHARED SHELL DATA (layout.tsx / Header / Footer)

`frontend/app/layout.tsx` fetches twice per request (plus once more in `generateMetadata` with `stega:false`):

**A. `settingsQuery` → `settings` singleton.** Post-projection shape delivered (keys actually consumed):

```jsonc
{
  // metadata (generateMetadata, layout.tsx:94-133)
  "title": "Hound Around Resort",              // title template `%s | title` + JSON-LD Organization/WebSite name
  "description": PT,                           // → toPlainText() → meta description (marks-only PT, §PT-config-3)
  "ogImage": RawImage + { "alt", "metadataBase": url },  // resolveOpenGraphImage → 1200x627 fit=crop; metadataBase → new URL()
  "faviconUrl": string | null,                 // ONLY asset-URL deref in the codebase: favicon.asset->url  → icons.icon/apple  (null in live data)
  "googleSiteVerification": string?,           // → metadata.verification.google  (absent in live data)

  // scripts (layout.tsx:143-230)
  "gtmContainerId": "GTM-NVNLRHVW",            // @next/third-parties GoogleTagManager + noscript iframe
  "ga4MeasurementId": string?,                 // gtag fallback only when NO gtmContainerId (absent live)
  "ctmScriptUrl": "//598466.tctm.co/t.js",     // <Script async afterInteractive>

  // JSON-LD (layout.tsx:35-92,169-208)
  "localBusiness": { businessName, businessType, address{street,city,state,zip,country}, phone,
                     geoCoordinates{latitude,longitude}, businessHours[{days,open,close}], priceRange }?,
                                               // absent live → LocalBusiness JSON-LD not emitted
  "socialLinks": {facebook?, instagram?, google?}?,   // sameAs arrays (absent live)
  "logo": RawImage?,                           // Header w220 / Footer w160; JSON-LD uses asset._ref AS URL (bug, layout.tsx:87,185); absent live → TextLogo fallback

  // Header props (components/Header.tsx)
  "navItems": [{ "_key", "label", "link"?: DereferencedLink,
                 "children"?: [{ "_key", "label"?, "link"?: DereferencedLink }] }],
      // MUTATED in layout.tsx:148-160: the item with label === 'Services' gets children
      // REPLACED by servicesNavQuery results as {_key: service._id, label: title,
      // link: {linkType:'href', href:`/services/${slug}`}}
  "ctaButton": Button,                         // header CTA (live: booking.goose.pet)

  // Footer props (components/Footer.tsx)
  "footerTagline": string?, 
  "footerColumns": [{ "_key", "title"?, "links": [{ "_key", "label"?, "link"?: DereferencedLink }] }],
  "contactInfo": { "address"?, "phone"?, "email"? },
  "footerText": string?, "footerTextLink": { "label"?, "href"? }?,
  "footerBottomLinks": [{ "_key", "label"?, "link"?: DereferencedLink }],
  "footerSticker": RawImage + alt?,
  "yearEstablished": number?                   // fetched, never consumed — drop
  // "tagline" is NOT in the projection's explicit list but arrives via `...` — never consumed
}
```

All link objects inside navItems/footer follow the `DereferencedLink` deref (`linkFields` fragment applied at every nesting level, queries.ts:17-54). Footer resolves links via its own `resolveFooterLink` wrapper around the same `linkResolver` (`Footer.tsx:134`).

**B. `servicesNavQuery` → `[{_id, title, slug: string}]`** ordered by title — consumed only for the Services dropdown injection above.

Adapter contract for the shell: one call returning the settings shape above (with links pre-resolved to the DereferencedLink shape) + the services list; or pre-compose the nav injection server-side and drop the magic-label logic.

---

*Every shape above was verified against `frontend/sanity/lib/queries.ts`, the consuming component files cited inline, and the live dataset (read-only, 2026-07-10). Items marked absent-in-live-data are schema-valid and code-handled; the adapter must still support them.*
