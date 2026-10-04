# Coffee House — Landing Page

Coursework for the [RS School](https://rs.school/) Front-end course (Parts 1–2).

A responsive two-page landing page for a coffee house, built with vanilla HTML, CSS and JavaScript — markup and design system first, then full interactivity, with no frameworks and no UI libraries.

**Live demo:** [Home](https://azizshik.github.io/rsschool-landing-page/pages/home/index.html) · [Menu](https://azizshik.github.io/rsschool-landing-page/pages/menu/index.html)

## Pages

- **Home** — hero with video backdrop, infinite “favorite coffee” slider, about gallery, mobile-app section with store badges
- **Menu** — product catalog with category tabs, load-more button and a product modal with configurable options and live price

## Features

- Light / dark theme persisted in `localStorage`, applied before first paint (no flash)
- Burger menu for ≤ 768 px with scroll lock, close on `Escape`, link click and viewport change
- Infinite carousel: arrows, indicators, touch swipe, mouse drag, screen-reader status announcements
- Catalog rendered from `data/products.json` (fetched at runtime) — one source of truth for cards, categories and the modal
- Category switching without reload; load-more shows the first 4 cards on mobile, all cards on desktop
- Modal dialog: size (radio) + additives (checkbox) options, live total, focus trap, inert background
- Icon system: SVG files in `assets/icons`, applied via CSS masks so they follow theme and hover states
- Accessibility: skip link, live regions, visible focus states, hover styles guarded by `@media (hover: hover)`, forced-colors and reduced-motion support
- Responsive layout for 1440 / 768 / 380 px with no horizontal scrolling

## Tech stack

- Vanilla JavaScript (ES modules), semantic HTML, modern CSS (custom properties, no frameworks)
- Vite 8 for the dev server and the production build (readable, unminified output with source maps)

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Build output

`npm run build` produces a clean, hash-free `dist/`:

```text
dist/
├── assets/images|videos|fonts|icons/
├── css/main.css            # shared styles
├── data/products.json      # catalog data
├── js/main.js              # shared code
├── pages/home/             # index.html + home.js + home.css
└── pages/menu/             # index.html + menu.js + menu.css
```

## AI-assisted workflow

Built with `OpenCode` while practicing AI-assisted development across multiple models. The workflow started with Composio MCP, then shifted to direct Figma token access. Occasional 429 rate-limit errors were handled by retry logic and model switching. The workflow carries its rules with it: `AGENTS.md` with project rules, `skills` for repeated concerns and explicit acceptance `criteria` per feature. Every change was reviewed and verified by build and manual checks before commit.
