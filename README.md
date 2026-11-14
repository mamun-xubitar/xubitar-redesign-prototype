# Xubitar website redesign — Prototype v1 (for client review)

A clickable, responsive and animated HTML prototype of the new xubitar.com, based on the
discussion summary and the *Shopify Development Services 6-Month Plan*.

**Live preview:** https://mamun-xubitar.github.io/xubitar-redesign-prototype/start-here.html

> The `animated` branch has been merged into `main`; the live site is the animated version.

## How to review

| What | Where |
|---|---|
| **Start here**: overview, things to try, sitemap, brief → design mapping, questions for the client | `start-here.html` |
| Clickable prototype (Chrome, Safari, Edge or Firefox) | `index.html` |
| Offline review: one PDF with every page | `Xubitar-Website-Redesign-Prototype-v1.pdf` |
| Full-page screenshots (desktop 1440px + mobile 390px) | `screens/` |
| Developer hand-off: tokens, components, **motion system** | `style-guide.html` |

Inside the prototype, the yellow **Review** button (bottom-left) lets you:
- show numbered **design notes** that explain each decision
- **highlight sample content** (case studies, reviews, numbers and logos are placeholders)
- switch between three **accent colours**: Signal blue, Emerald, Volt
- jump to any page

Share a specific view with URL parameters, for example `index.html?notes=1&accent=emerald`.

## Pages (15 + review hub)
Home · Services overview · 5 service pages · Work · Case study · For agencies · Products ·
About · Careers · Start a project (3-step form + booking) · Style guide · Start here.

## Animation & interactivity
Motion is used to show reliability (live data), teach (hints) and help visitors decide (tools).
It follows the app's `lib/motion/presets.ts` (fadeUp 24px/600ms, scaleIn .95/400ms,
slideDown −8px/250ms, 100ms stagger) and uses **Lenis** for smooth scrolling, like the app.
Everything switches off for visitors who prefer reduced motion.

- Home hero: the headline rises word by word, a swoosh draws, a spotlight grid follows the cursor, and a live store-health console tilts and updates
- Logo marquee, count-up stats, a timeline that draws itself, and a live maintenance log
- Before/after renovation slider that demonstrates itself once
- Decision tools: **support plan finder**, **AI savings calculator**, **SEO / AEO / GEO / LLMO demo**
- Animated case-study and careers filters, reading progress and contents highlighting on the case study
- Live data-flow diagrams (integrations, agency partnership, case study)
- Enquiry form: progress bar, sliding steps, inline validation, animated success. Booking flow with confirmation
- Toki chat: a nudge after 7 seconds, an unread badge, quick replies, a typing indicator
- Header hides on scroll down and returns on scroll up; animated menus; page transitions (View Transitions API)

## Project structure

```
_src/build.py        # build script → writes the *.html files in this folder
_src/data.py         # all content: services, case studies, plans, FAQs…
_src/icons.py        # inline SVG icons (Lucide style)
_src/templates/      # base layout, macros (= future React components), pages, service template
_src/shoot.mjs       # Playwright: regenerates screens/
css/styles.css       # design system (tokens map to Tailwind v4 @theme)
css/motion.css       # motion & interaction layer (mirrors motion/react presets)
js/main.js           # navigation, Lenis, FAQ, filters, form, booking, Toki chat demo
js/motion.js         # reveals, headline split, count-ups, live data, hints
js/widgets.js        # plan finder, savings calculator, SEO demo
js/review.js         # review toolbar (prototype only)
js/vendor/lenis.min.js
assets/              # logo, favicon
```

Rebuild after editing content or templates (requires Python 3 + Jinja2):

```bash
python3 -I _src/build.py
```

Regenerate the screenshots. Start a local server, then run Playwright with Chrome:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
node _src/shoot.mjs http://127.0.0.1:4173
```

## Notes for implementation (after approval)
- Build in the existing Next.js 16 + Tailwind v4 app, following its `ARCHITECTURE.md`. Each Jinja macro maps to a React
  component, and `css/motion.css` maps to `motion/react` variants plus Tailwind utilities.
- Fonts: Geist and Geist Mono via `next/font`. Icons: `lucide-react`.
- Keep the existing contact pipeline (Zod → Turnstile → SES) and add the new fields: project type,
  URL, problem, timing, budget, role and lead source.
- Toki chat: replace the demo widget with the provider's embed script.
- Replace every sample item (turn on *Highlight sample content* to find them) with real, approved data.
