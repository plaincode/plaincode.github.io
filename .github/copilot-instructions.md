# Project Mission

This repository is the source for **plaincode.github.io**, the static GitHub Pages homepage for plaincode app development.

## Project Context
- Migration target: replace the former WordPress content with a static, fast, maintainable site.
- Hosting: GitHub Pages.
- Main branch/source: `master`.
- Domain: `plaincode.github.io`.

## Current Site Structure

### Core pages
- `index.html` — homepage / posts overview.
- `apps.html` — apps overview page.
- `products/index.html` — SEO-compatible products overview (`/products/`).

### Legal pages (migration-critical)
- Ensure the legal pages from the original site are preserved in the static site migration.
- Include an imprint page.
- Include a privacy policy.

### SEO-compatible product detail routes
Keep these exact directory routes:
- `/products/clinometer/` → `products/clinometer/index.html`
- `/products/magnetmeter/` → `products/magnetmeter/index.html`
- `/products/accelmeter/` → `products/accelmeter/index.html`
- `/products/isetsquare/` → `products/isetsquare/index.html`
- `/products/contactsbynumber/` → `products/contactsbynumber/index.html`
- `/products/magichue/` → `products/magichue/index.html`

### Shared assets
- Global styles: `style.css`
- Global script: `script.js`
- Branding/logo/icons: `images/icons/*`
- Store badges: `images/app-store-badge.svg`, `images/google_play_store_badge.svg`
- App media/screenshots: `images/apps/*`, `images/screenshots/*`, `images/other/*`
- Fonts: `fonts/*`

## Content & Layout Consistency Rules

### 1) Header consistency (critical)
When editing or adding pages, keep the header structure and branding consistent across all pages:
- Use the same `site-header` + `header-content` block.
- Include the responsive logo using `<picture>` element in `h1.site-logo`:
	- Desktop: `/images/icons/plaincode_logo_text.svg` (wide version)
	- Mobile (≤370px): `/images/icons/plaincode_logo_text_narrow.svg` (compact version)
	- alt text: `plaincode`
- Keep navigation style/classes consistent (`main-nav`, active link state).
- Header layout: logo and navigation stay side-by-side on all screen sizes.

### 1b) Header/Footer synchronization (critical)
- Treat header and footer as shared global layout blocks.
- If a header or footer link/content/class is added, removed, or changed on one page, apply the same update to all relevant pages in the site.
- Do not ship partial updates where only a subset of pages contains the new header/footer state.
- After any content edit, quickly verify header and footer alignment against at least `index.html`, `apps.html`, product pages, and legal pages.

### 2) Head metadata consistency
All pages should include:
- responsive viewport meta tag
- meaningful page-specific description meta tag
- favicon links:
	- `/images/icons/favicon-32.png`
	- `/images/icons/apple-touch-icon.png`

### 3) Styling discipline
- Reuse existing classes and patterns from `style.css`.
- Avoid introducing one-off inline styles.
- Prefer extending shared CSS rules instead of page-specific overrides.

### 4) App store links/badges
- Do **not** reintroduce Windows Store/Windows Phone links.
- Use official App Store / Google Play badges where store links are shown.
- Keep badge markup consistent with existing `store-badge` usage.

### 5) URL/path safety
- Preserve existing URL structure for SEO/backward compatibility.
- Use root-relative paths for shared assets (e.g. `/style.css`, `/images/...`) on nested pages.
- Do not rename product slug folders unless explicitly requested.

### 6) Accessibility basics
- Keep descriptive `alt` text for meaningful images/icons.
- Preserve semantic heading order (`h1` for site logo/title block, `h2` page title, then `h3`/`h4`).

## Design System

### Visual Style: Modern Glassmorphism
The site uses a modern glass/frosted design inspired by iOS design language:

**Core principles:**
- **Glassmorphism effects**: Semi-transparent backgrounds with backdrop blur
- **Frosted glass appearance**: Headers, cards, and UI elements should have:
  - Semi-transparent backgrounds (rgba with reduced opacity)
  - `backdrop-filter: blur()` for frosted effect
  - Subtle borders with semi-transparent white/light colors
  - Soft shadows for depth
- **Typography**: Slim, normal-weight headers (not bold)
- **Spacing**: Use `rem` units for scalability and accessibility
- **Colors**: Light, airy palette with subtle transparency

**Implementation guidelines:**
- Use `backdrop-filter: blur(10px)` for glass effect
- Background colors should use `rgba()` with alpha ~0.7-0.9
- Borders: `1px solid rgba(255, 255, 255, 0.2)` for glass edges
- Box shadows: Soft, multi-layered for depth
- Avoid heavy, opaque backgrounds - prefer translucency

### Typography
- Headers (h1-h6): `font-weight: normal` (not bold)
- Heading sizes: Conservative, close to body text size (1rem-1.7rem range)
- Body font: CenturyGothicRegular, with fallbacks to Helvetica, Arial, sans-serif
- Available custom fonts: Josefin Sans (self-hosted for privacy/performance)

### Color Scheme
Maintain consistent color usage across the site:

**Brand Colors:**
- **Brand Orange** (Icon/Accent): `#E36732` / `rgb(227, 103, 50)`
  - Used for: App icons, brand accents, call-to-action elements
  
**UI Colors:**
- **Primary Blue** (Interactive): `#0066cc`
  - Used for: Links, hover states, active navigation, buttons
  - Apply to: `.main-nav a:hover`, `.main-nav a.active`, `a:hover`, button backgrounds
  
- **Text Gray** (Default): `#666`
  - Used for: Body text, default navigation links, secondary text
  - Apply to: `.main-nav a`, `.site-logo a`, general paragraph text

**Background & Glass Effects:**
- **Header Background**: `rgba(255, 255, 255, 0.75)` with `backdrop-filter: blur(10px)`
  - Semi-transparent white with frosted glass effect
  
- **Body Gradient**: `linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)`
  - Subtle light gray gradient for page background
  
- **Hero Section Gradient**: `linear-gradient(135deg, rgba(123, 124, 204, 0.85) 0%, rgba(21, 21, 137, 0.85) 100%)`
  - Purple-blue gradient with transparency for sticky page titles

**Border & Shadow Colors:**
- Glass borders: `rgba(255, 255, 255, 0.3)` or `rgba(255, 255, 255, 0.2)`
- Shadows: `rgba(0, 0, 0, 0.08)` for subtle depth

**Color Usage Rules:**
- Always use the exact hex/rgba values listed above
- Do not introduce new colors without updating this guide
- Maintain color consistency across all pages
- Use brand orange sparingly for visual impact
- Prefer rgba with opacity for glassmorphism effects

## Performance & PageSpeed Insights Optimizations

The site is optimized for Core Web Vitals (LCP, FCP, CLS) and PageSpeed Insights scores.

### Required Performance Patterns

**1. Image Optimization (CLS Prevention):**
All images, especially the logo, must have explicit width and height attributes:
```html
<img src="/images/icons/plaincode_logo_text.svg" alt="plaincode" width="347" height="74" fetchpriority="high">
```
- Logo dimensions: `width="347" height="74"` (based on SVG viewBox: 0 0 347.19 73.56)
- Use `fetchpriority="high"` for above-the-fold images (logo, hero images)
- Prevents cumulative layout shift (CLS) by reserving image space before load

**2. Font Loading Optimization (FCP/LCP):**
All @font-face declarations must include `font-display: swap`:
```css
@font-face {
    font-family: 'CenturyGothicRegular';
    src: url('/fonts/gothic.woff') format('woff');
    font-display: swap;
}
```
- Prevents invisible text flash (FOIT)
- Shows fallback fonts immediately while custom fonts load
- Improves First Contentful Paint (FCP)

**3. Critical Resource Preloading:**
Add preload link for critical fonts in all HTML pages:
```html
<link rel="preload" href="/fonts/gothic.woff" as="font" type="font/woff" crossorigin>
```
- Place in `<head>` before stylesheet link
- Reduces critical path length for text rendering
- Improves Largest Contentful Paint (LCP)

**4. Resource Loading Order:**
Maintain this exact order in `<head>` for optimal performance:
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="...">
<link rel="icon" href="/images/icons/favicon-32.png">
<link rel="apple-touch-icon" href="/images/icons/apple-touch-icon.png">
<link rel="preload" href="/fonts/gothic.woff" as="font" type="font/woff" crossorigin>
<link rel="stylesheet" href="style.css">
<script src="script.js" defer></script>
```

### Performance Constraints (GitHub Pages)

**Cannot be controlled from static content:**
- **Cache TTL**: GitHub Pages enforces 10-minute cache (cannot be changed)
- **Server headers**: No control over HTTP headers or CDN configuration
- **Render-blocking CSS**: Some CSS render-blocking is unavoidable; inlining critical CSS would complicate maintenance

**Acceptable trade-offs:**
- CSS remains in external file for maintainability
- Font files use standard loading (no complex subsetting)
- Keep static site approach without build pipeline

### When Adding New Pages

Apply all performance optimizations to new pages:
- [ ] Add explicit width/height to all images, especially logos
- [ ] Use `fetchpriority="high"` on above-the-fold images
- [ ] Include font preload link in `<head>`
- [ ] Verify all @font-face rules have `font-display: swap`
- [ ] Follow resource loading order in `<head>`

## Legal Compliance (Germany/EU)

### Legal Page Structure
plaincode is operated from Germany and must comply with German and EU law:

**Legal Pages:**
- `/legal/` — English Legal Notice (default landing for international UX, lang="en")
- `/legal/de.html` — German Impressum (legally required, lang="de")
- `/privacy/` — English Privacy Statement (default landing for international UX, lang="en")
- `/privacy/de.html` — German Datenschutzerklärung (legally required, lang="de")

**Critical Requirements:**
- German versions are **legally binding** and **required by law**
- German versions are accessible and findable (legal requirement met)
- English versions provide better UX for international visitors
- Both versions must have identical content (no contradictions)
- All pages must have language switchers (🇩🇪 Deutsch | 🇬🇧 English)
- Footer links always in English: "Legal Notice" | "Privacy Statement"
- Responsive footer text: full on desktop (>768px), short on mobile (≤768px)

### German Legal Requirements

#### § 5 DDG (Digital Services Act) — Impressum
Websites operated from Germany **must** provide a legal disclosure (Impressum) in German:
- **Provider information**: Name, full address, contact email
- **Editorial responsibility** (§ 18 MStV): Required for sites with editorial/blog content
- **Note on language**: State that German version is legally required, English is courtesy
- **Terminology**: Use "Legal Notice" (not "Imprint") in English version

Current implementation:
```
Anbieter:
Peter Breitling
Sternstr. 5
83071 Stephanskirchen
Deutschland
E-Mail: support@plaincode.com

Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:
Peter Breitling
[same address]
```

#### § 18 MStV (Media State Treaty) — Editorial Responsibility
Sites with regular editorial content (blogs, news, opinion pieces) must name a responsible person:
- Required for journalistic-redactional content
- Must include name and full address
- Currently implemented in both legal pages

#### DSGVO (GDPR) Art. 12 — Transparent Privacy Information
Privacy policy must be in German for German users:
- Required even for English-language sites operated from Germany
- Must be "transparent" and understandable to German users
- Non-German-only privacy = legal risk (Abmahngefahr)
- German authorities require German documentation

### Cookie & Tracking Compliance

**Current Status: No Tracking**
- Site operates **without** Google Analytics or any tracking tools
- No cookies used for marketing/analytics
- No consent banner required ✓

**If Tracking is Re-Introduced:**
- Non-essential cookies (tracking, marketing, analytics) require **active consent** (opt-in)
- Cookie banner must appear **before** cookies are set
- Pre-checked boxes are **not** valid consent
- Must store consent preference
- Even "cookieless" Google Analytics requires consent (processes personal data via IP/fingerprinting)

**Privacy-Friendly Alternatives (No Consent Required):**
- **Plausible Analytics** (recommended) — Cookie-free, EU-hosted, GDPR-compliant
- **Fathom Analytics** — Privacy-first, no cookies
- **Simple Analytics** — EU-based, cookie-free
- **Matomo** (self-hosted) — Can be configured cookie-free

These alternatives:
- Do not use cookies
- Do not collect personal data
- Are GDPR-compliant by design
- Do not require consent banners
- Are lighter and faster than Google Analytics

### Privacy Policy Scope

The privacy policy covers:
1. **Website** (plaincode.github.io)
   - GitHub Pages hosting (server logs handled by GitHub)
   - No tracking/analytics tools
   - No cookies for marketing/analysis

2. **Mobile Apps** (iOS/Android)
   - All published apps: Clinometer, Magnetometer, AccelMeter, iSetSquare, Contacts by Number, MagicHue, etc.
   - **No data transmission** — sensor data processed locally only
   - **No tracking tools** — no analytics in apps
   - **Device access** — camera/sensors used locally, not transmitted
   - **In-app purchases** — handled by App Stores (Apple/Google privacy policies apply)

### Footer Link Structure

**Desktop (>768px):**
```
Legal Notice | Privacy Statement | Email Us | Social Media
```

**Mobile (≤768px):**
```
Legal | Privacy | Email | Social
```

Implementation using responsive CSS:
```html
<a href="/legal/">
  <span class="link-text-full">Legal Notice</span>
  <span class="link-text-short">Legal</span>
</a>
```

CSS:
```css
.link-text-short { display: none; }
@media (max-width: 768px) {
  .link-text-full { display: none; }
  .link-text-short { display: inline; }
}
```

### Language Switcher Pattern

Place at top of legal/privacy pages (right-aligned). Always show English left, German right:

English version:
```html
<div style="text-align: right; margin-bottom: 1rem;">
  <strong>🇬🇧 English</strong> | <a href="/legal/de.html">🇩🇪 Deutsch</a>
</div>
```

German version:
```html
<div style="text-align: right; margin-bottom: 1rem;">
  <a href="/legal/">🇬🇧 English</a> | <strong>🇩🇪 Deutsch</strong>
</div>
```

### Legal Compliance Checklist

Before deploying changes to legal pages:
- [ ] German version exists and is accessible at `/legal/de.html` and `/privacy/de.html`
- [ ] English version accessible at `/legal/` and `/privacy/` (default landing)
- [ ] Correct `lang` attributes (lang="de" for German, lang="en" for English)
- [ ] Language switchers present on all legal pages
- [ ] Content identical between language versions (no contradictions)
- [ ] § 18 MStV editorial responsibility section present in legal pages
- [ ] Privacy policy covers both website AND mobile apps
- [ ] Footer links consistent across all 14+ pages
- [ ] No tracking tools active without consent mechanism
- [ ] Store links point to Apple/Google privacy policies where relevant

## When Updating Content

Before finishing content updates:
- Verify header/logo/nav consistency with other pages.
- Verify footer links/content consistency with other pages.
- Verify store links still point to the correct app pages.
- Verify no broken HTML structure (especially in app-card sections).
- Verify no missing shared assets or incorrect relative paths.
- Keep wording and tone consistent with existing plaincode style.
- **For legal pages: verify both German and English versions updated identically**

## Git Commit Message Format

Use clear, descriptive commit messages that summarize the changes:

**For simple changes:**
- Use imperative mood: "Add feature" not "Added feature"
- Be specific and concise
- Examples:
  - "Add privacy/imprint pages, implement glassmorphism design, unify header/footer"
  - "Implement responsive design with dual breakpoints and enhanced glassmorphism"

**For complex multi-feature commits:**
- Start with a summary line
- Follow with bullet points describing key changes
- Use present tense descriptive format
- Example structure:
  ```
  Migrate WordPress content to static plaincode.github.io
  - Expand copilot instructions and migration rules
  - Rework homepage branding, layout, and favicon setup
  - Update apps page and fix broken card markup
  - Remove Windows Store links from all app/product pages
  - Add SEO-compatible /products/ overview and detail routes
  ```

**What to include:**
- Major features or improvements
- Responsive design changes (breakpoints, layout adjustments)
- Visual design updates (glassmorphism, styling)
- Structural changes (new pages, reorganization)
- Bug fixes or compatibility improvements

## Scope Guidance for AI Edits
- Prefer minimal, surgical edits.
- Do not redesign the whole page when only content changes are requested.
- Do not add new frameworks/build steps unless explicitly requested.
- Keep performance-friendly static site approach.

## Git Workflow
- **Do NOT automatically commit changes** unless explicitly requested by the user.
- Wait for the user to initiate commits with phrases like "commit this", "let's commit", or "commit these changes".
- After making edits, present the changes and wait for user confirmation before committing.
- Users may want to review changes, make additional edits, or test before committing.
