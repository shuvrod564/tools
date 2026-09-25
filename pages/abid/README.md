# Interactive Parallax Portfolio — Social Media × AI × E-Commerce

A fully responsive, SEO-optimized, single-page portfolio website built with **HTML, Tailwind CSS, DaisyUI and vanilla JavaScript**. Based on the "Interactive Parallax Portfolio Website Architecture & Implementation Plan" — showcasing 10 core skills across Social Media Management, AI Automation and E-Commerce Operations (Amazon FBA, Etsy, Shopify).

## ✨ Features

| Area | What's inside |
|------|---------------|
| **Hero** | Multi-layer parallax (mesh grid + glow orbs + floating metric badges), gradient-clip headline, count-up stats, cursor-reactive orbs |
| **Toolkit marquee** | Infinite CSS marquee of tools/platforms |
| **Skills Bento Matrix** | 6 interactive cards covering all 10 core skills: animated reach bars, live-typing AI terminal, Amazon FBA × Etsy toggle, platform-tagged mini calendar, 98.4% sentiment dial, storefront metrics |
| **Case Studies** | Desktop: scroll-pinned **horizontal scrub** through 3 projects with progress counter + dots. Mobile: clean vertical stack |
| **AI Workflow Simulator** | 4-stage pipeline that auto-runs on scroll (or via "Run Simulation") with live status chips |
| **Live Dashboard** | 3 tabbed views (Amazon FBA / Etsy / Social) with simulated real-time updating KPIs, meters, inventory badges, tag rankings |
| **Before/After slider** | Draggable comparison of an optimized marketplace listing |
| **Contact** | Validated form with toast confirmation, magnetic CTA button, booking link |
| **Extras** | Back-to-top FAB, active-section nav highlighting, glassmorphic mobile menu, `prefers-reduced-motion` support |

## 🚀 Performance & SEO

- **Zero raster images in-page** — all visuals are CSS/SVG (only favicon + OG image ship as PNG/SVG)
- Compiled & minified Tailwind output: **~16 KB gzipped** CSS, ~4 KB gzipped JS
- `defer`red JavaScript, preconnected fonts with `display=swap`, GPU-accelerated transforms (`translate3d`, `will-change`)
- Complex parallax/tilt effects **auto-disabled below 1024px** and for `prefers-reduced-motion` users
- Full SEO kit: meta/OG/Twitter tags, canonical, **JSON-LD structured data** (Person + WebSite + ProfessionalService), `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, semantic HTML5 + ARIA, custom `.htaccess` (gzip + cache headers)

## 📁 Structure

```
├── index.html            ← the whole site (single page)
├── css/style.css         ← compiled + minified Tailwind/DaisyUI (do not edit by hand)
├── js/main.js            ← all interactions (readable, commented)
├── assets/               ← favicon.svg, favicon.png, apple-touch-icon.png, og-image.png
├── src/input.css         ← Tailwind source (edit custom classes here)
├── tailwind.config.js    ← theme: colors, fonts, animations, DaisyUI "obsidian" theme
├── robots.txt · sitemap.xml · manifest.webmanifest · .htaccess
└── package.json          ← dev tooling (only needed for rebuilds)
```

## 🔧 Customization (5-minute checklist)

1. **Name & branding** — search-replace `Ayesha Rahman`, `ayesharahman.dev`, `AR` and `hello@ayesharahman.dev` in `index.html` (also update JSON-LD, OG/Twitter URLs, `sitemap.xml`, `robots.txt`).
2. **Booking link** — swap the `https://cal.com/ayesharahman` href in the contact section.
3. **Real form delivery** — the form currently simulates success. Point it at [Formspree](https://formspree.io)/Resend: add `action="https://formspree.io/f/yourid" method="POST"` and remove the demo handler in `js/main.js` (search "Contact form").
4. **Social links** — update LinkedIn / Upwork / X URLs in the contact + JSON-LD blocks.
5. **Colors** — edit the palette in `tailwind.config.js` (and gradient hexes in `src/input.css`), then rebuild CSS (below).

## 🛠 Rebuilding the CSS (after edits)

Requires Node 18+:

```bash
npm install          # installs tailwindcss + daisyui
npm run build:css    # recompiles minified css/style.css
# or: npm run watch:css  (auto-rebuild while editing)
```

## 🌍 Deploy (free)

- **Netlify / Vercel**: drag-and-drop the folder (skip `.htaccess` — both platforms configure caching automatically).
- **GitHub Pages**: push and enable Pages on the repo root.
- **Apache/cPanel hosting**: upload as-is; `.htaccess` enables gzip + 1-year static caching.

## ✅ Recommended post-launch checks

- Run [PageSpeed Insights](https://pagespeed.web.dev/) — expect 95–100 on Performance/SEO/Best Practices.
- Replace the placeholder domain in `sitemap.xml` + canonical tag with your real domain, then submit the sitemap in Google Search Console.
- Update `assets/og-image.png` with a personal photo/version if desired (1200×630).
