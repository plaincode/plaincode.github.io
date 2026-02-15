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

## When Updating Content

Before finishing content updates:
- Verify header/logo/nav consistency with other pages.
- Verify footer links/content consistency with other pages.
- Verify store links still point to the correct app pages.
- Verify no broken HTML structure (especially in app-card sections).
- Verify no missing shared assets or incorrect relative paths.
- Keep wording and tone consistent with existing plaincode style.

## Scope Guidance for AI Edits
- Prefer minimal, surgical edits.
- Do not redesign the whole page when only content changes are requested.
- Do not add new frameworks/build steps unless explicitly requested.
- Keep performance-friendly static site approach.
