# Aidid Marcello — Personal Brand Site

## What this site is
Personal brand portal for **Aidid Marcello** — Malaysian broadcaster, creative director, and host of the Aididitmyway podcast. The site positions him across five content channels and links to his social platforms. It is a **static site**: no framework, no build step, no package manager. Open `index.html` in a browser or serve with Python (`python -m http.server 3002`).

---

## File structure

```
index.html       — all HTML markup, no inline CSS or JS
styles.css       — all styling (CSS custom properties, layout, animations, responsive)
script.js        — all JavaScript (theme, animations, scroll effects, interactions)
CLAUDE.md        — this file
.claude/
  launch.json    — preview server config (Python http.server on port 3002, named "pbsite")
```

**To preview:** use `preview_start` with server name `pbsite`. Screenshots time out — use `preview_inspect` and `preview_snapshot` to verify changes instead.

---

## Theming system

- **Light mode = default** (no attribute on `<html>`)
- **Dark mode** = `data-theme="dark"` on `<html>`
- CSS custom properties defined in `:root` (light) and `:root[data-theme="dark"]` (dark)
- A tiny blocking inline script in `<head>` reads `localStorage('theme')` before first paint to prevent flash-of-wrong-theme
- JS toggle: `initTheme()` in `script.js` — persists choice to `localStorage`

### Key tokens
| Token | Light | Dark | Purpose |
|---|---|---|---|
| `--ink` | `#faf4ea` (warm paper) | `#0C0A08` (near-black) | Page background |
| `--surface` | `#f2e7d8` | `#15110D` | Elevated sections |
| `--text` | `#241a13` | `#F2EDE3` | Primary text |
| `--muted` | `#6b5c4c` | `#968B7B` | Secondary text |
| `--orange` | `#FF5C24` | same | Brand signal — never changes |
| `--bronze` | `#C9A96E` | same | Luxe hairline accents |

---

## Sections (in DOM order)

| # | ID | Description |
|---|---|---|
| — | `#nav` | Fixed top nav. Materialises on scroll (`.scrolled`). Desktop: links + theme toggle. Mobile: burger + theme toggle in `.nav-mobile-actions`. |
| — | `#drawer` | Full-screen mobile nav overlay. Pinned dark regardless of theme. |
| 1 | `#hero` | Full-viewport hero. Desktop: 2-col grid (copy left, portrait right). Mobile: portrait covers full viewport, copy sits over it. Light-mode desktop overrides text tokens only (no background change). |
| 2 | `#collab` | Brand logo marquee (auto-scrolling). JS duplicates the track for seamless loop. |
| 3 | `#about` | About section. Left: portrait + signature. Right: bio text + credential ledger (`.creds`). Signature image is `filter:invert(1)` in light mode. |
| 4 | `#universe` | **Content Universe** — 5-card scroll-driven stack. `.uni-stack` is 450vh tall; `.uni-pin` is sticky 100vh; `.uni-deck` holds 5 `.deck-card` articles. JS animates cards sliding up as you scroll. |
| 5 | `#mission` | Centred mission statement with ambient glow animation. |
| 6 | `#connect` | 6-platform social stats grid. Cards are fully clickable (JS click handler, not nested `<a>`). Numbers animate on scroll-into-view. |
| — | `footer` | Footer with universe links, contact, and social links. |

---

## Content Universe cards

Five `.deck-card` articles inside `#uni-deck`, each with a per-channel CSS variable `--c` for its accent colour:

| # | Kicker | `--c` token |
|---|---|---|
| 01 | Automotive & EVs | `--c-auto` (#FF5C24) |
| 02 | Food & Hidden Eats | `--c-food` (#E2452B) |
| 03 | Travel & Places | `--c-travel` (#3E7CA0 light / #5B93B0 dark) |
| 04 | Gadgets & Lifestyle | `--c-tech` (#A9853F light / #C9A96E dark) |
| 05 | People & Podcast (Aididitmyway) | `--c-people` (#C25A2C light / #D9683C dark) |

**Card layout:**
- Desktop: `.deck-media` is `position:absolute` (right side of card, 40% card width). `.deck-main` uses `padding-right:calc(52% + clamp(1.8rem,4vw,3.4rem))` to clear it.
- Mobile: `.deck-media` is `position:relative`, `width:100%`, `aspect-ratio:16/9`, inside the normal flow between kicker and title.

---

## JavaScript functions (script.js)

| Function | What it does |
|---|---|
| `initTheme()` | Reads localStorage, applies theme, wires toggle buttons |
| `initHero()` | Staggered entrance animation (setTimeout chain) |
| `initReveal()` | IntersectionObserver fade-in for `.reveal` elements |
| `initMarquee()` | Clones logo track innerHTML for seamless CSS animation loop |
| `initUniverse()` | Scroll-driven card stack (rAF + getBoundingClientRect) |
| `initCounters()` | IntersectionObserver number count-up animation for `.stat-num` |
| `initParallax()` | Desktop-only hero portrait parallax on scroll (disabled on mobile + reduced-motion) |
| `initStatCards()` | Makes entire `.stat` div clickable, delegates to `.stat-follow` href |
| `initUniverseTint()` | Syncs `.uni-pin` CSS `--glow` variable to the active card's `--c` colour |
| `boot()` | Calls all init functions; runs on DOMContentLoaded or immediately if already loaded |

---

## Images

All images are hosted on **Cloudinary** (CDN). Format: `https://res.cloudinary.com/da3lqh4dl/image/upload/...`

- Hero desktop portrait: `v1774003750/Aidid_marcello_poster_1080_x_1300_udr7hk.webp`
- Hero mobile portrait: `v1783090493/Untitled_design_53_wqrkg6.png`
- About photo: `v1771334216/AIDIDMARCELLO.COM_1_qvfvdr.webp`
- Signature: `v1783087904/Aidid_Marcello_UGC_signature_-_Edited_yli0lr.png` (inverted in light mode via CSS `filter:invert(1)`)
- Brand logos (collab marquee): `res.cloudinary.com/da3lqh4dl` — Astro, Primeworks, Gintell, AirAsia, TM, TV3, RTM, Petronas
- Content Universe cards: Unsplash placeholder images (replace with real content)

**Image fallback pattern:** every `<img>` has `onerror="this.remove()"` — if the URL fails, the image removes itself and the `.ph` placeholder underneath becomes visible.

---

## Social links (real URLs)

| Platform | URL |
|---|---|
| YouTube | `https://www.youtube.com/channel/UCo0mCPYFcIu5yNP_esHKz6g` |
| TikTok | `https://www.tiktok.com/@aidid.marcello` |
| Facebook | `https://www.facebook.com/aididmarcello11/` |
| X | `https://x.com/aidid_marcello` |
| Instagram | `https://www.instagram.com/aididmarcello/` |
| Spotify | `https://open.spotify.com/show/3Fhibq7tIRJw0wDh7R9NHI` |

---

## Key CSS patterns to know

- **`.reveal`** — opacity:0 + translateY by default; JS adds `.in` class to animate in
- **`.ph`** — striped placeholder div; shown when no image URL is loaded
- **`.img-slot`** — `position:absolute;inset:0;object-fit:cover` — fills any `.ph` container
- **`--d` CSS variable** — stagger delay for `.reveal` elements (set inline as `style="--d:.1s"`)
- **Reduced-motion** — `@media (prefers-reduced-motion:reduce)` block disables all animations and makes the card stack a plain vertical list
- **No-JS** — `<noscript>` block in `index.html` makes reveals visible and card stack static

---

## GitHub

Repo: `https://github.com/Aidid-Marcello/aidid-marcello-main-website`
Branch: `main`
Auth: Personal Access Token from the Aidid-Marcello GitHub account (regenerate at github.com/settings/tokens if needed)
