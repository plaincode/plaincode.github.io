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
- `contact/index.html` — contact information with email and social channels.
- `social/index.html` — social media links and community information.

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
- Global styles: `css/style.css`
- Global script: `js/script.js`
- Branding/logo/icons: `images/icons/*`
- Store badges: `images/app-store-badge.svg`, `images/google_play_store_badge.svg`
- App media/screenshots: `images/apps/*`, `images/screenshots/*`, `images/other/*`
- Fonts: `fonts/*`

### News & RSS Feed
- `news/index.html` — complete news archive (all news items)
- `feed/index.xml` — RSS feed (all news items, accessible at `/feed/`)
- `index.html` — displays 3 most recent news items + "View all news →" link

**News Management Workflow:**

When publishing new news items, update all three files synchronously:

1. **Add to news/index.html**: Insert new `<article class="post">` at the top of the blog-posts section
2. **Add to index.html**: Insert at the top, keep only 3 most recent posts, remove oldest
3. **Add to feed/index.xml**: Insert new `<item>` at the top, update `<lastBuildDate>`, maintain chronological order
4. **Update RSS feed discovery**: Both index.html and news/index.html include RSS feed link in `<head>`

**Why LLM prompts (not automated tools):**
- Low update frequency (sporadic posts, months/years apart)
- No build pipeline needed (keeps static site approach)
- Flexible content formatting and tone
- Context-aware summaries and key point extraction
- Simple maintenance: "update RSS feed with this new post"

**News Item Structure:**
```html
<article class="post">
    <h3>Title</h3>
    <p class="post-meta">Month Day, Year</p>
    <p>Content with <a href="/products/app/">links</a> to products...</p>
</article>
```

**RSS Item Structure:**
```xml
<item>
    <title>Title</title>
    <link>https://plaincode.github.io/news/#YYYY-MM-DD</link>
    <guid>https://plaincode.github.io/news/#YYYY-MM-DD</guid>
    <pubDate>Day, DD Mon YYYY 12:00:00 +0000</pubDate>
    <description><![CDATA[<p>Content...</p>]]></description>
</item>
```

**Checklist for new news items:**
- [ ] Add to top of news/index.html
- [ ] Add to top of index.html (keep only 3 most recent)
- [ ] Add to top of feed/index.xml (update lastBuildDate)
- [ ] Use consistent date formats (HTML: "Month Day, Year", RSS: RFC 822)
- [ ] Include links to relevant product pages where appropriate
- [ ] Use proper CDATA escaping in RSS descriptions

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
- Reuse existing classes and patterns from `/css/style.css`.
- Avoid introducing one-off inline styles.
- Prefer extending shared CSS rules instead of page-specific overrides.

### 4) App store links/badges
- Do **not** reintroduce Windows Store/Windows Phone links.
- Use official App Store / Google Play badges where store links are shown.
- Keep badge markup consistent with existing `store-badge` usage.

### 5) URL/path safety
- Preserve existing URL structure for SEO/backward compatibility.
- Use root-relative paths for shared assets (e.g. `/css/style.css`, `/js/script.js`, `/images/...`) on nested pages.
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

### Color Scheme: Bavaria Blue with Neutral Background
**Current Active Scheme: Bavaria Blue with Glassmorphism**

A professional color scheme using Bavaria Blue (#1976D2) for interactive elements with a neutral light gray background, creating a clean, trustworthy appearance.

**CSS Variables Used:**
- `--brand-orange`: Brand orange color (currently unused, reserved for future use)
- `--bavaria-blue`: Bavaria blue accent color (rgba(25, 118, 210, 1.0))
- `--link-color`: Link color (#1976D2 - Bavaria blue)
- `--link-color-hover`: Link hover color (#1565C0 - darker Bavaria blue)
- `--bg-gradient-start`: Body background gradient start (#F9FAFB)
- `--bg-gradient-end`: Body background gradient end (#F3F4F6)
- `--header-footer-gradient-start/mid/end`: Header/footer gradients (light gray, 0.5 opacity)
- `--hero-title-gradient-start/mid1/mid2/end`: Hero bar blue gradient (4 stops, 0.65-0.75 opacity)
- `--button-gradient-start/end`: Learn More button gradients (blue, matches hero)

**Current Color Implementation:**

**Interactive Elements (Bavaria Blue):**
- **Links**: `#1976D2` (Bavaria blue)
  - Used for: All clickable navigation links, social links, main content links
  - Hover state: `#1565C0` (darker blue)
  - Active/current page: Black (#000) with bold font-weight
  
**Navigation & Footer:**
- **Header Navigation**: Blue links, bold black for active page
- **Footer Social Links**: Blue with hover state
- **Footer Copyright/W3C**: Black (subtle, less prominent)

**Hero Title Bar (Blue Transparent Plexiglass Pipe):**
- **4-stop blue gradient** with transparency (0.65-0.75 opacity):
  - Start: `rgba(70, 130, 200, 0.65)`
  - Mid1: `rgba(50, 110, 180, 0.7)` at 30%
  - Mid2: `rgba(35, 95, 165, 0.72)` at 70%
  - End: `rgba(25, 80, 150, 0.75)`
- **Text**: White (#ffffff) with subtle shadow
- **Effect**: `backdrop-filter: blur(10px)` for frosted glass
- **Borders**: Light top border, blue bottom border
- **Shadow**: Blue-tinted shadow for 3D depth

**Buttons (Learn More):**
- **Background**: Blue gradient matching hero bar
- **Text**: White (#ffffff)
- **Hover**: Darker blue gradient

**Background & Glass Effects:**
- **Header/Footer**: `rgba(233, 233, 233, 0.5)` gradient with `backdrop-filter: blur(30px)`
- **Body Background**: Light gray gradient (#F9FAFB → #F3F4F6)
- **Content Cards** (.post, .app-card, .product-detail): White glass cards with blur(20px)

**CSS Optimization:**
- Glassmorphism styling uses grouped selectors: `.post, .app-card, .product-detail`
- Shared hover effects for cards
- No redundant CSS properties
- Semantic class names (no utility classes needed)

**Color Usage Rules:**
- Links are blue by default, bold black when active/current page
- Hero bar and buttons use matching blue gradient
- Optional/subtle links (copyright, W3C) are black
- Maintain glassmorphism transparency throughout
- Use --bavaria-blue for hover states on post/app-card titles

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
<link rel="stylesheet" href="/css/style.css">
<script src="/js/script.js" defer></script>
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
- `/app-privacy/` — Redirect page to `/privacy/#mobile-apps` (backward compatibility for old app store links)

**Backward Compatibility:**
The old WordPress site had different URL structures. To maintain external links from app stores, old documentation, and search engines:

**App Privacy Redirect:**
- `/app-privacy/index.html` redirects to `/privacy/#mobile-apps`
- Privacy policy uses **combined approach**: one document covering both website and mobile apps
- Section anchors: `#website` and `#mobile-apps` for direct linking

**Press Release Category Redirect:**
- `/category/press-release/index.html` redirects to `/news/`
- Old WordPress category URL preserved for external links and SEO
- News section contains all announcements and press releases

**Redirect Implementation Pattern:**
- Uses HTML meta refresh + JavaScript fallback (GitHub Pages compatible)
- Includes canonical link and noindex meta tag (SEO-safe)
- Shows user-friendly message with manual link fallback
- Consistent glassmorphism styling with site design

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
   - **Anonymized analytics collection** — device type, device ID (anonymized), IP address (anonymized), OS, browser type, usage information
   - **Purpose** — bug finding, feature improvement and prioritization
   - **Data retention** — up to 24 months, then aggregated
   - **No user-provided data** — apps do not ask for user input beyond functionality
   - **Sensor data processed locally** — accelerometer, magnetometer, gyroscope, camera data stays on device, not transmitted
   - **Third-party analytics services** — configured for anonymized collection only
   - **Opt-out** — uninstall the application
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
- [ ] Section anchors `#website` and `#mobile-apps` present in privacy pages
- [ ] `/app-privacy/` redirect page exists and redirects to `/privacy/#mobile-apps`
- [ ] `/category/press-release/` redirect page exists and redirects to `/news/`
- [ ] Footer links consistent across all pages (currently 18+ pages)
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

## Maintaining These Instructions

**CRITICAL: Keep copilot-instructions.md synchronized with project changes.**

When making structural or architectural changes, update this file immediately:

**Always update when:**
- Adding new pages or routes (e.g., `/contact/`, `/social/`)
- Creating redirects for backward compatibility (e.g., `/app-privacy/`, `/category/press-release/`)
- Changing URL structure or file organization
- Adding new sections to existing pages (e.g., new privacy policy sections)
- Modifying footer/header structure across multiple pages
- Adding new product pages or changing product URLs
- Implementing new design patterns or CSS conventions
- Adding new legal requirements or compliance rules

**Why this matters:**
- Copilot relies on these instructions to maintain consistency
- Outdated instructions lead to divergent implementations
- Future edits may break backward compatibility if routes aren't documented
- Legal/compliance requirements must be tracked to avoid violations

**How to update:**
1. After implementing structural changes, immediately update relevant sections
2. Document the path/route in the appropriate section ("Current Site Structure", "Backward Compatibility", etc.)
3. Explain the purpose and implementation pattern
4. Add to relevant checklists if applicable
5. Update examples if the change affects common patterns

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
