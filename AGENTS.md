# Coffee House — RS School Landing Page

## Project Overview

This project is an RS School Fullstack Engineering Landing Page assignment.

It is currently at **Part 2**: Part 1 (markup, design system, shared
Header/Footer, theme, responsive layout) is complete, and Part 2 adds the
required interactivity.

The project implements the Coffee House design from the provided Figma mockup.

The application must contain two pages:

- Home page
- Menu/Catalog page

The implementation must follow both the Part 1 and the Part 2 requirements and
the provided Figma design.

Authoritative requirements:

- `docs/requirements/part-1.md`
- `docs/requirements/part-2.md` — Section 3 also records the project-specific
  decisions made for this implementation

---

## Current Scope

This project implements **Part 1 and Part 2**.

Part 2 functionality that must be implemented and graded:

- burger menu
- slider/carousel
- category switching in the catalog
- card visibility management (load-more)
- product modal window
- card options with dynamically updated information

Nothing on that list may be left static or stubbed out. If a control appears in
the design, it must work.

Visual states required by the design should still be implemented.

Avoid JavaScript beyond what the requirements ask for. Every graded behaviour
must be hand-written, but do not add unrequested application state or
abstractions.

---

## Pages

The project must contain:

### Home page

The Home page must include:

- Header
- Hero section
- Slider/carousel section with at least 3 items
- At least 2 additional content sections
- Footer

### Menu/Catalog page

The Menu page must include:

- Header
- At least 3 product categories
- Category controls
- At least 8 product cards in one category
- Load-more or pagination UI
- Footer

The exact visual structure should follow the Figma design.

---

## Shared Components

Reusable components must have a single source of truth.

Shared components must not be duplicated between pages.

The following components should be reusable:

- Header
- Footer
- Button
- ThemeToggle
- Card
- BurgerMenu
- ProductModal

Additional reusable components may be introduced when a visual or structural
pattern is genuinely repeated.

Do not create components only for the sake of having more components.

Page-specific sections should remain inside their respective page directories
unless there is a clear reason to reuse them.

The current Header and Footer are single HTML partials injected into every
page by the `sharedHeader` Vite plugin, so they exist in the static HTML
without JavaScript. Keep that approach: the burger menu lives inside the
Header partial and must not be re-rendered per page.

`src/products.json` is the single source of truth for the catalog. A card, its
modal, and the category list must all derive from it. Do not keep a second
copy of product data anywhere, and do not hardcode product markup in
`menu/index.html`.

### Scroll Locking

The burger menu and the product modal both need to block page scrolling. They
must share **one** scroll-lock utility rather than each toggling styles
independently. It needs a lock count rather than a boolean, so that closing
one overlay while the other is open does not restore scrolling too early, and
it must compensate for the disappearing scrollbar so the page does not jump.

---

## Project Architecture

Use the following structure:

```text
src/
├── assets/
│   └── img/
│
├── components/
│   ├── Header/        # header.html partial + Header.css
│   ├── Footer/        # footer.html partial + Footer.css
│   ├── Button/
│   ├── ThemeToggle/
│   ├── Card/          # product card markup + styles
│   ├── BurgerMenu/    # open/close behaviour, scroll lock
│   └── ProductModal/  # dialog markup + option controls
│
├── pages/
│   ├── home/
│   │   ├── index.html
│   │   └── home.css
│   └── menu/
│       ├── index.html
│       └── menu.css
│
├── styles/
│   ├── reset.css
│   ├── variables.css
│   ├── global.css
│   └── utilities.css
│
├── js/
│   ├── main.js        # entry point: shared styles + init
│   ├── theme.js       # shared theme system
│   ├── scrollLock.js  # shared scroll lock (burger + modal)
│   ├── home.js        # slider
│   ├── catalog.js     # cards, categories, load-more
│   ├── productModal.js# modal + options
│   └── utils/         # small shared helpers
│
└── products.json      # catalog data — single source of truth
```

The `js/` layout above is a proposal, not a fixed contract. Prefer a few
focused modules over one large file, and keep genuinely shared helpers (the
scroll lock, the price formatter, the image resolver) in exactly one place.

The structure may be extended when necessary, but do not reorganize the
architecture without a clear reason.

---

## Styling Architecture

Use CSS custom properties as the project's design system.

Define semantic variables for:

- background colors
- surface colors
- primary text
- secondary text
- accent colors
- borders
- typography
- spacing
- container width
- border radius
- transitions
- other reusable design values

Components should use semantic variables instead of hardcoded colors and repeated magic values wherever practical.

Example:

```css
:root {
  --color-background: ...;
  --color-surface: ...;
  --color-text-primary: ...;
  --color-text-secondary: ...;
  --color-accent: ...;
}
```

New Part 2 UI — the burger menu, the product modal, the option controls and the
load-more button — must be built from these existing tokens rather than
introducing new hardcoded colors or magic numbers.

---

## Theme

The application must support:

- Light theme
- Dark theme

Theme switching must:

- work on both pages
- persist using `localStorage`
- survive page navigation
- restore the selected theme after reload
- keep the theme toggle state synchronized with the active theme

Both themes must remain readable and accessible.

---

## Responsive Design

The layout must work from:

- 1440px
- 768px
- 380px

and all widths between them.

Important rules:

- no horizontal scrolling
- no whole-page scaling
- images must preserve their proportions
- content wider than 1440px must remain constrained and centered
- desktop navigation must be hidden at widths <= 768px
- burger button must be displayed at widths <= 768px
- at widths >= 769px an open burger menu must close, the burger button must be
  hidden, and the desktop navigation must be displayed

The header breakpoint is `max-width: 768px`. Part 1 shipped `max-width: 991px`
in `Header.css`, which contradicts the 769px rule and must be corrected.

Some behaviour depends on the viewport in JavaScript, not only in CSS, and must
use `matchMedia` so it re-evaluates on the threshold crossing:

- the burger menu open/close state
- the number of catalog cards shown and the visibility of the load-more button
  (all cards above 768px, the first four at <= 768px)

Use responsive CSS rather than creating separate desktop/mobile pages.

---

## HTML and Accessibility

Use semantic HTML.

Examples:

- `header`
- `nav`
- `main`
- `section`
- `footer`
- `ul`
- `li`
- `a`
- `button`

Navigation should use semantic list-based markup.

Interactive elements must use the correct HTML element.

Do not use a `div` as a replacement for a button or link when a semantic element is appropriate.

Images must have meaningful `alt` text when they convey information.

Decorative images should use appropriate empty alt attributes.

Maintain reasonable keyboard accessibility and visible focus states.

---

## Navigation

The two pages must be connected through working navigation.

Header navigation must contain links to the appropriate sections/pages.

Anchor navigation should support smooth scrolling where appropriate.

The logo/name should link to the Home page.

External/social links in the footer must work.

---

## Visual Implementation

The Figma design is the primary visual reference.

Do not attempt to reproduce the design by taking screenshots or using a single large image.

Build the interface using:

- HTML
- CSS
- JavaScript where necessary

Pixel-perfect reproduction is not required, but the visual structure, proportions, typography, spacing, colors, images, and responsive behavior should closely follow the Figma design.

Each major section should be visually coherent on its own.

---

## JavaScript

Use plain JavaScript. No frameworks, no TypeScript, no libraries.

Required functionality:

- theme switching and persistence via `localStorage`
- burger menu open/close
- slider with cyclic switching
- category switching
- card visibility management (load-more)
- product modal window
- card options with dynamically updated information
- catalog rendering from `src/products.json`

Every graded behaviour must be hand-written. A ready-made slider, modal,
burger-menu or utility library is forbidden, and so is a CSS framework.

Do not introduce application state or abstractions that the requirements do
not ask for. Keep the state minimal — for the slider that is a single index;
for the catalog that is the active category and the visible card count.

Prefer a few focused modules over one large file, and keep shared helpers in
exactly one place. Do not duplicate a helper because two pages need it —
init the shared component once instead.

---

## JavaScript Quality

Avoid:

- duplicated logic
- duplicated component implementations
- duplicated copies of product data
- global mutable state when unnecessary
- magic numbers when a design variable can be used
- unnecessary dependencies
- building DOM through unsanitised HTML string interpolation
- recomputing viewport-dependent values on every `resize`/`scroll` event
  instead of on a `matchMedia` threshold change
- adding a listener per open/close cycle instead of one delegated listener

Prefer simple, readable, maintainable code.

Comments should explain **why**, not restate the code. Keep the existing
explanatory comments — they record Figma node references and layout decisions
that are not obvious from the CSS alone.

---

## Component Rules

Before creating a new component, ask:

1. Is this UI reused?
2. Does it represent a meaningful reusable concept?
3. Would extracting it make the code easier to maintain?

If the answer is no, keep the code local to the page or section.

Shared components must not contain page-specific content unless explicitly designed to accept it as data.

---

## Design System Rules

Before implementing page sections, establish the base design system:

1. CSS reset
2. Design tokens
3. Global typography
4. Global layout/container
5. Common utilities
6. Theme variables

Do not hardcode the same design values repeatedly across unrelated components.

---

## Figma Workflow

When Figma MCP is available:

1. Inspect the relevant Figma section.
2. Identify layout structure.
3. Identify typography.
4. Identify colors.
5. Identify spacing.
6. Identify images and assets.
7. Identify responsive differences.
8. Implement the section according to the existing project architecture.
9. Compare the implementation with Figma.
10. Fix visual discrepancies.

Do not invent design details when they can be obtained from Figma.

---

## Development Workflow

Implement the project incrementally.

Part 1 order (complete):

1. Project structure
2. CSS reset
3. Design tokens
4. Global styles
5. Shared Header
6. Shared Footer
7. Theme system
8. Home page
9. Menu page
10. Responsive refinement
11. Accessibility refinement

Part 2 order:

1. Fix the header breakpoint to 768/769
2. Shared scroll-lock utility
3. Burger menu
4. Slider
5. Catalog data loading, card rendering, categories
6. Card visibility (load-more)
7. Product modal window
8. Card options and dynamic price
9. Responsive and theme verification of every new component
10. Accessibility refinement: focus management, keyboard, ARIA
11. Final review against `docs/requirements/part-2.md`

Do not implement the entire project in one uncontrolled step.

---

## Validation

After implementing a significant feature:

1. Run the development server.
2. Check the page in the browser.
3. Check desktop layout.
4. Check tablet layout.
5. Check mobile layout.
6. Check light theme.
7. Check dark theme.
8. Check navigation.
9. Check for horizontal overflow.
10. Review the git diff.

Do not assume that code is correct without visually checking the result.

Part 2 additionally requires checking, at 1440px, 768px and 380px, in both
themes:

- the burger menu opens and closes, blocks and restores scrolling, closes on
  `Escape` and on link selection, and closes when the viewport passes 769px
- the slider switches in both directions, wraps cyclically, animates, keeps its
  indicators in sync, and stays aligned after a resize
- the catalog renders from `products.json` with no product markup in the HTML,
  the first category is active on load, and switching needs no reload
- all cards show above 768px with no load-more button; the first four show at
  <= 768px with the button only when more exist
- a card opens a modal built from the same object, the backdrop is dimmed, the
  page cannot scroll, and the modal closes on the button, the backdrop and
  `Escape` — but not on a click inside
- the modal exposes at least two option groups and updates the price live,
  resetting correctly for each newly opened card
- keyboard operability and focus handling for every new interactive element

The component-specific skills in `.opencode/skills/` contain detailed
validation checklists. Load the relevant one before implementing and before
declaring done.

---

## Hard Restrictions (penalty: −100)

These are grading disqualifiers, not style preferences.

Do NOT use:

- JS frameworks: React, Angular, Vue, Svelte, Solid, Preact
- TypeScript
- CSS frameworks: Bootstrap, Tailwind, Bulma
- ready-made interactivity or component libraries, including slider, modal and
  burger-menu libraries
- screenshots or images in place of markup for the page or for any content
  block — images are standalone content only: photos, illustrations, icons

Also required by the assignment:

- source maps must stay enabled — `build.sourcemap: true`
- code must stay readable, without minification or obfuscation —
  `build.minify: false`, `build.cssMinify: false`
- must work in the latest Google Chrome

CSS preprocessors (SASS, SCSS) and `modern-normalize` are allowed. Bundlers
such as Vite or Webpack are allowed.

## Submission

- Work happens on the branch `landing-page-part-2`, created from
  `landing-page`.
- Update the deployment so it contains the Part 2 changes. The link must open
  the home page and work in incognito mode.
- Open a Pull Request from `landing-page-part-2` into `landing-page`. Do not
  merge it and do not close it.
- State the chosen variant and a link to the current deployment in the Pull
  Request description.
- Submit the Pull Request link in the Cross-Check: Submit section in RS App
  before the deadline, then check the works assigned to you.

---

## Git Responsibility

The user is responsible for Git operations.

Do NOT execute:

- `git add`
- `git commit`
- `git push`
- `git reset`
- `git rebase`
- `git checkout`
- `git restore`

unless the user explicitly asks you to perform a specific Git operation.

When a task is complete, provide a short summary of the changes and let the user review the diff and create the commit manually.

## Important Restrictions

Do NOT:

- switch frameworks without explicit permission
- introduce React, Vue, or another framework unless explicitly requested
- redesign the project architecture without a clear reason
- duplicate Header or Footer implementations
- add unnecessary dependencies
- replace the Figma design with your own design
- use screenshots as the page implementation
- ignore responsive requirements
- ignore dark theme requirements
- leave Part 2 functionality unimplemented
- remove existing user code without permission
- perform destructive git operations

When uncertain, prefer the simplest implementation that satisfies the requirements and existing architecture.

If a requirement is unclear, inspect the project requirements or Figma design before making assumptions.

The theme switcher is part of the shared Header.

Its exact visual placement, appearance, dimensions, icons, spacing, and responsive behavior must follow the Figma design.

