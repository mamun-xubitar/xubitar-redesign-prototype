# Xubitar website redesign — Prototype v1 (for client review)

A clickable, responsive HTML prototype of the new xubitar.com, based on the discussion
summary and the *Shopify Development Services 6-Month Plan*.

**Live preview:** https://mamun-xubitar.github.io/xubitar-redesign-prototype/start-here.html

> This `main` branch is the **previous version** (static design, minimal motion).
> The `animated` branch adds the full motion system and interactive tools on top of it.

## How to review

| What | Where |
|---|---|
| **Start here**: overview, sitemap, brief → design mapping, questions for the client | `start-here.html` |
| Clickable prototype (Chrome, Safari, Edge or Firefox) | `index.html` |
| Offline review: one PDF with every page | `Xubitar-Website-Redesign-Prototype-v1.pdf` |
| Full-page screenshots (desktop 1440px + mobile 390px) | `screens/` |
| Developer hand-off: colours, type, components | `style-guide.html` |

Inside the prototype, the yellow **Review** button (bottom-left) lets you:
- show numbered **design notes** that explain each decision
- **highlight sample content** (case studies, reviews, numbers and logos are placeholders)
- switch between three **accent colours**: Signal blue, Emerald, Volt
- jump to any page

Share a specific view with URL parameters, for example `index.html?notes=1&accent=emerald`.

## Pages (15 + review hub)
Home · Services overview · 5 service pages · Work · Case study · For agencies · Products ·
About · Careers · Start a project (3-step form + booking) · Style guide · Start here.

## Project structure

```
_src/build.py        # build script → writes the *.html files in this folder
_src/data.py         # all content: services, case studies, plans, FAQs…
_src/icons.py        # inline SVG icons (Lucide style)
_src/templates/      # base layout, macros (= future React components), pages, service template
_src/shoot.mjs       # Playwright: regenerates screens/
css/styles.css       # design system (tokens map to Tailwind v4 @theme)
js/main.js           # navigation, FAQ, filters, form, booking, Toki chat demo
js/review.js         # review toolbar (prototype only)
assets/              # logo, favicon
```

Rebuild after editing content or templates (requires Python 3 + Jinja2):

```bash
python3 -I _src/build.py
```

## Notes for implementation (after approval)
- Build in the existing Next.js 16 + Tailwind v4 app, following its `ARCHITECTURE.md`. Each Jinja macro maps to a React component.
- Fonts: Geist and Geist Mono via `next/font`. Icons: `lucide-react`.
- Keep the existing contact pipeline (Zod → Turnstile → SES) and add the new fields: project type,
  URL, problem, timing, budget, role and lead source.
- Toki chat: replace the demo widget with the provider's embed script.
- Replace every sample item (turn on *Highlight sample content* to find them) with real, approved data.
