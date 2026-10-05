---
name: project-requirements
description: Keeps implementation aligned with the RS School Coffee House landing page requirements for Part 1 and Part 2, and prevents forbidden technologies. Use when implementing, reviewing or planning any work on this project.
---

# Project Requirements Skill

## Purpose

Use this skill whenever implementing, reviewing, or planning work for the RS
School Coffee House landing page.

The authoritative requirements are defined in:

- `AGENTS.md` — project rules and architecture
- `docs/requirements/part-1.md` — Part 1 assignment and checklist
- `docs/requirements/part-2.md` — Part 2 assignment, checklist, and the
  project-specific decisions in its Section 3

Follow all three.

## Current Scope

This project is at **Part 2**. Part 1 (markup, design system, shared
Header/Footer, theme) is complete and must keep working.

Part 2 adds the required interactivity:

- burger menu
- slider / carousel
- category switching in the catalog
- card visibility management (load-more)
- product modal window
- card options with dynamically updated information

Everything graded in Part 2 must be implemented. Do not stub it out and do not
describe it as out of scope.

## Implementation Decision Rule

Before implementing a feature, answer:

1. Is it required by `part-1.md` or `part-2.md`?
2. Is it visible in the Figma design?
3. Does it belong to a shared component?
4. Can it be implemented within the existing architecture?

If a feature is required, implement it — do not leave it inactive.

## Hard Restrictions (penalty: −100)

These are graded disqualifiers, not style preferences. Never introduce them.

- No JS frameworks: React, Angular, Vue, Svelte, Solid, Preact.
- No TypeScript. The project is plain JavaScript with JSDoc at most.
- No CSS frameworks: Bootstrap, Tailwind, Bulma.
- No ready-made interactivity libraries: no slider/carousel library, no modal
  or dialog library, no burger-menu library, no utility framework. Every
  graded behaviour must be written by hand.
- No replacing markup with screenshots. Images are standalone content only:
  photos, illustrations, icons.

## Technical Requirements

- Vanilla JavaScript only.
- Source maps must stay enabled (`build.sourcemap: true`).
- Code must stay readable and unminified (`build.minify: false`,
  `build.cssMinify: false`).
- Must work in the latest Google Chrome.
- CSS preprocessors and `modern-normalize` are allowed.
- Bundlers (Vite, Webpack) are allowed.

## Data Handling (10 points)

- All catalog data lives in one array of objects in a separate file:
  `src/products.json`.
- Every object carries the fields needed to build a card **and** a modal:
  `name`, `description`, `image`, `price`, `category`, `sizes`, `additives`.
- A card and its modal are built from **one and the same object**. Do not
  duplicate data into HTML, and do not keep a second copy of product data
  anywhere.
- Cards are generated dynamically with JavaScript. Product markup must not be
  hardcoded in `menu/index.html`.

See `part-2.md` Section 3.1 and 3.2 for the file layout, the `image`
convention, and how the two option groups are normalised.

## Shared Components

- Header and Footer must have a single source of truth. Do not duplicate their
  markup per page. The current implementation injects the partials through the
  `sharedHeader` Vite plugin.
- `products.json` is the single source of truth for the burger menu links and
  for the catalog, so the burger menu must not grow a private copy of the nav.
- Page-specific sections stay in their page directory unless there is a real
  reason to share them.

## Responsive Requirements

Works from 1440px down to 380px and at all intermediate widths.

- No horizontal overflow.
- Images preserve their proportions.
- The whole page is never scaled down as one image or block.
- Content above 1440px stays constrained and centred.
- **Burger menu works at ≤768px; at ≥769px the menu closes, the burger button
  is hidden, and the desktop navigation is shown.** The header breakpoint is
  `max-width: 768px`.
- Catalog card visibility: above 768px all cards of the active category are
  shown; at ≤768px the first four are shown with a load-more button when more
  exist. This is a JavaScript concern as well as a CSS one, because the card
  count depends on the viewport.

Do not create separate desktop/mobile implementations when CSS can handle the
layout.

## Theme Requirements

Both pages support light and dark themes with a working switcher, persisted in
`localStorage`, restored after reload, preserved across navigation, and with
the toggle state matching the current theme.

- One shared implementation (`src/js/theme.js`). Never per-page theme logic.
- The theme attribute must be applied before the first paint. A blocking
  script in `<head>` (injected by the Vite plugin) handles this; do not remove
  it in favour of `main.js` only, or the page flashes light.
- New components (modal, burger menu, options) must use the existing semantic
  tokens and must be readable in both themes.

## Semantic HTML and Accessibility

- Semantic elements: `header`, `nav`, `main`, `section`, `footer`, `ul`, `li`,
  `a`, `button`.
- Use `button` for actions and `a` for navigation. Never a `div` standing in
  for either.
- Use the correct heading hierarchy.
- Meaningful `alt` text for meaningful images, empty `alt` for decorative
  ones.
- Visible focus states; keyboard operability for every interactive element.
- Do not add ARIA when native semantics suffice. The Part 1 menu tabs are plain
  toggle buttons with `aria-pressed`, not a `tablist` — all three tabs shared
  one `tabpanel`, which is invalid.
- When a dialog is involved, see the `product-modal` skill for focus
  management, `Escape`, and scroll locking.

## Design System

Prefer shared design tokens over repeated hardcoded values. Tokens exist for
colors, typography, spacing, layout/container dimensions, border radius, and
transitions.

New Part 2 UI (modal, burger menu, options, load-more) must use these tokens
rather than introducing new magic values.

## Git

The user performs all Git operations. Do not run `git add`, `git commit`,
`git push`, `git checkout`, `git rebase`, or `git reset` unless explicitly
asked to perform that specific operation.

## Validation

Before declaring Part 2 work done, verify:

- Catalog data is rendered from `products.json`; no product markup in HTML.
- Opening or reloading the catalog shows `coffee` as the only active category.
- Switching categories updates the cards with no page reload.
- Above 768px all cards show and no load-more button appears.
- At ≤768px the first four cards show and the button appears only when more
  exist (never for tea, which has exactly 4).
- Resizing the window re-evaluates the card count and the button state.
- A card opens a modal with its own data; the backdrop is dimmed; the window is
  centred.
- The modal closes on the close button, the backdrop, and `Escape`; clicking
  inside it does not close it.
- Page scroll is locked while the burger menu or the modal is open, and is
  restored on close.
- At ≤768px the burger opens/closes smoothly and the icon toggles to a cross.
  At ≥769px the menu closes, the button hides, and the navigation returns.
- The slider switches forward and back, cycles between the first and last
  element, animates smoothly, and syncs its indicators.
- Options in the modal update the price without a page reload, and reset when
  another card is opened.
- Everything is checked at 1440px, 768px and 380px, in light and dark themes.
- No horizontal overflow.
- `npm run build` succeeds and source maps are emitted.

Do not assume code is correct without checking it in the browser.

## Priority

When requirements conflict, use this priority:

1. Explicit user instruction
2. `docs/requirements/part-2.md`, then `docs/requirements/part-1.md`
3. `AGENTS.md`
4. Figma design
5. This skill
6. General implementation preferences

Never use this skill to override an explicit user request, and never use it to
block functionality that Part 2 requires.
