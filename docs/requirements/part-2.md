# RS School Landing Page — Part 2 Requirements

> **Source of truth note.** Sections 1–2 reproduce the assignment text and the
> grading checklist. Section 3 ("Project Decisions") is **not** from RS School —
> it records the choices made for this project so that implementation and
> review stay aligned. Do not mix the two when checking acceptance.

---

## 1. Assignment Text

### General description

Part 2 requires implementing interactivity on the pages created in Part 1. All
functionality is implemented in vanilla JavaScript without using ready-made
libraries or components.

Work continues on the chosen variant — Coffee House. Requirements and grading
criteria are the same for both variants.

### What must be implemented

- opening and closing the burger menu;
- slider or carousel on the home page;
- category switching in the catalog;
- managing card visibility with a "show more" button or pagination;
- a modal window with information about the selected card;
- selecting card options and dynamically updating the related information in
  the modal window.

### Catalog data

Data for all categories is stored as an array of objects in a separate `.js` or
`.json` file. Each object must contain the information needed to build the card
and the modal window: **name, description, image**, available options and the
information related to those options.

For Coffee House the prepared `products.json` file is used.

Cards of all categories are generated dynamically with JavaScript from the data
array. A card and its corresponding modal window are built from **one and the
same object**. Data is not duplicated in HTML and is not stored in separate
copies.

### Burger menu

- Works on both pages at screen widths of 768px and below.
- On menu button press it opens or closes smoothly, and the icon toggles
  between a burger and a cross.
- The open menu occupies the available space below the header and matches the
  visual design of the project.
- While the menu is open page scrolling is blocked; after closing it is
  restored.
- When a menu link is selected the menu closes and navigation happens to the
  corresponding home page section or to the catalog. The menu also closes on
  `Escape`.
- At widths of 769px and above the menu closes, the button is hidden, and the
  main navigation is displayed.

### Slider / carousel

- At least three elements.
- Switching is done by "forward" and "back" buttons.
- Switching is cyclic: after the last element the first is shown, after the
  first — the last.
- Element change is smooth. One element, or a group defined by the design, is
  displayed on screen; the rest are not visible beyond the container edges.
- If the design has current-slide indicators (dots or bars), the active
  indicator changes when switching.
- The component works correctly at all checked resolutions and after the window
  width changes.

### Category switching

- On opening or reloading the catalog page the first category is active and its
  cards are displayed.
- When another category is selected it becomes the only active one, is
  visually highlighted, and the corresponding cards are displayed without a
  page reload.

### Card visibility management

- Use the mechanism chosen in Part 1: a "show more" button or pagination.
- **Coffee House:** at widths above 768px all cards of the active category are
  displayed. At widths of 768px and below only four cards are displayed
  initially, and a button appears if there are more. After pressing it all
  cards are shown and the button is hidden.
- In a custom project the number of simultaneously displayed cards is decided
  freely. At least in one category some cards must not be displayed initially
  and become available via the button or pagination.
- The button is shown while the active category has hidden cards. After
  pressing it the additional or all remaining cards are shown.
- Pagination allows viewing all cards of the active category sequentially. The
  selected number is visually highlighted, and cards update without a page
  reload.
- When switching category the initial set of cards is shown; with pagination the
  first number becomes active.
- When the window width changes the mechanism keeps working correctly, and the
  number of cards and the state of the controls match the current width.

### Modal window

- Pressing any part of a card opens a modal window with the selected item's
  data, and the area around it is dimmed.
- The window is centered on screen, matches the visual design, and displays
  correctly at 1440px, 768px and 380px in both themes.
- While the window is open page scrolling is blocked; after closing it is
  restored.
- The window closes on the close button, on the dimmed area, and on `Escape`.
  Pressing inside the window does **not** close it.
- The modal window must contain at least two options that help the user refine
  or specify their choice.
- Selected option variants are visually highlighted.
- When options change, the related information updates without a page reload:
  for example a short description, price, duration, availability, or another
  value.
- When a different card is opened, the options and related information match
  the selected card.

### Submission

- Create the branch `landing-page-part-2` from `landing-page` and do the work
  there.
- Update the project deployment so it contains the Part 2 changes. The link
  must open the home page and work in incognito mode.
- Open a Pull Request from `landing-page-part-2` into `landing-page`. Do not
  merge or close it.
- Format the Pull Request according to RS School requirements. In the
  description state the chosen variant and a link to the current deployment.
- Send the Pull Request link in the Cross-Check: Submit section in RS App
  before the deadline.
- After cross-check starts, check all works assigned to you and submit your
  results.

### Penalties

- Using technologies forbidden by the general technical requirements: **−100**.
- Replacing the whole page or individual content blocks with screenshots
  instead of HTML elements: **−100**.
- Any disputed questions are interpreted in favour of the student being
  checked.

### General Technical Requirements

- Markup must be valid, semantic and adaptive.
- The project must display and work correctly in the latest Google Chrome.
- Use vanilla JavaScript for the functionality.
- CSS frameworks such as Bootstrap are **not** allowed.
- JS frameworks such as React, Angular or Vue are **not** allowed.
- TypeScript is **not** allowed.
- Ready-made component and interactivity libraries are **not** allowed,
  including slider, modal and burger-menu libraries. All graded functionality
  must be implemented independently.
- CSS preprocessors (SASS, SCSS) and modern-normalize are **allowed**.
- Bundlers such as Vite or Webpack are **allowed**. Source maps must be enabled
  when they are used.
- Code must be readable, without minification and obfuscation.
- It is not allowed to replace the layout of the whole mockup or individual
  blocks with screenshots. Images are used only as standalone content:
  photos, illustrations and icons.

---

## 2. Grading Checklist (100 points)

| # | Area | Points |
|---|------|--------|
| 1 | Data handling | 10 |
| 2 | Burger menu | 20 |
| 3 | Slider / carousel | 20 |
| 4 | Category switching | 12 |
| 5 | Card visibility management | 13 |
| 6 | Modal window | 12 |
| 7 | Card options | 13 |

### 1. Data handling — 10

| Criterion | Points |
|-----------|--------|
| Cards of all categories are generated dynamically by JavaScript from an array of objects in a separate `.js`/`.json` file | +6 |
| A card and its modal are built from one object; data is not duplicated in HTML nor stored in separate copies | +4 |

### 2. Burger menu — 20

| Criterion | Points |
|-----------|--------|
| At widths ≤768px the menu opens and closes smoothly on button press | +4 |
| While open, page scrolling is blocked; after closing it is restored | +3 |
| The open menu occupies the available space below the header and matches the design; the icon toggles smoothly between burger and cross | +4 |
| Links lead to the corresponding home sections or the catalog and close the menu; the menu also closes on `Escape` | +4 |
| At widths ≥769px an open menu closes, the button is hidden, and the main navigation is shown | +3 |
| The menu works correctly on both pages | +2 |

### 3. Slider / carousel — 20

| Criterion | Points |
|-----------|--------|
| "Forward" and "back" buttons switch elements in the corresponding direction | +6 |
| At least three elements; switching between first and last is cyclic | +4 |
| Element change is accompanied by smooth animation | +4 |
| One element (or a design-defined group) is on screen, the rest are not visible beyond the container edges; indicators, if present, match the current state | +3 |
| The component works at 1440px, 768px and 380px, and after the window width changes | +3 |

### 4. Category switching — 12

| Criterion | Points |
|-----------|--------|
| On opening or reloading the catalog page the first category is active and its cards are shown | +4 |
| Selecting another category makes it active, visually highlighted, and displays the corresponding card set | +6 |
| Switching happens without a page reload; exactly one category is active at a time | +2 |

### 5. Card visibility management — 13

| Criterion | Points |
|-----------|--------|
| On load the initial set is displayed. Controls are available only when part of the active category's cards is not in that set | +5 |
| The button shows additional or all remaining cards and hides itself once all are shown; selecting a pagination number shows the corresponding set and highlights it. Updates happen without a page reload | +4 |
| When switching category the initial set is shown; with pagination the first number becomes active | +2 |
| On window width change the mechanism keeps working and the card count and control state match the current width | +2 |

### 6. Modal window — 12

| Criterion | Points |
|-----------|--------|
| Pressing any part of a card opens the modal with the selected item's data | +3 |
| The surrounding area is dimmed, the window is centered, and it matches the design | +2 |
| While open, page scrolling is blocked; after closing it is restored | +2 |
| Closes on the close button, the dimmed area, and `Escape`; pressing inside the window does not close it | +3 |
| Displays correctly at 1440px, 768px and 380px in light and dark themes | +2 |

### 7. Card options — 13

| Criterion | Points |
|-----------|--------|
| The modal has at least two options that let the user refine their choice; selected variants are visually highlighted | +3 |
| After opening the window, the options and related information match the initial state of the selected card | +3 |
| Option selection works according to its purpose and immediately updates the related information without a page reload | +5 |
| When a different card is opened, the options and related information match the selected card | +2 |

---

## 3. Project Decisions (not from RS School)

These are the choices made for this implementation. Follow them unless the
decision is explicitly revisited.

### 3.1 Data file

- **Location:** `src/public/data/products.json` — a single flat array of 20 objects.
  It is served as `/data/products.json` in dev and copied verbatim to
  `dist/data/products.json` on build; the catalog fetches it at runtime, so
  the bundle contains no inlined copy.
- **Added field:** the official file had no image reference, so an `image`
  field was added to every object holding a bare file name, e.g.
  `"image": "coffee-1.png"`. This satisfies the requirement that the image be
  part of the object.
- The value is deliberately **not** a path. The path convention lives in one
  place in JavaScript and is resolved through `import.meta.glob`, so Vite
  rewrites it to the hashed output URL and `base: './'` keeps working on
  GitHub Pages.

| Category | Products | Assets |
|----------|----------|--------|
| coffee | 8 | `coffee-1..8.png` |
| tea | 4 | `tea-1..4.png` |
| dessert | 8 | `dessert-1..8.png` |

- The `image` value is the Nth product of a category ↔ `category-N.png`. This
  order was verified against the assets and against the card order already
  used in Part 1.

### 3.2 Two options per product

The data already provides the required two options:

- `sizes` — an **object** keyed `s` / `m` / `l`, each with `size` and
  `add-price`
- `additives` — an **array** of 3 items, each with `name` and `add-price`

The two shapes are inconsistent, so they must be normalised to one list of
option groups before rendering.

Additive names differ per category:

| Category | Additives |
|----------|-----------|
| coffee | Sugar / Cinnamon / Syrup |
| tea | Sugar / Lemon / Syrup |
| dessert | Berries / Nuts / Jam |

`additives` is a list of choices, not a set of mutually exclusive radio
options — additive selections are additive to the price. `sizes` is a single
choice, so it is a radio group. The total price is:

```
total = price + size['add-price'] + sum(selected additives' 'add-price')
```

`price` and `add-price` are **strings** in the JSON and must be converted to
numbers before arithmetic.

### 3.3 Visibility mechanism: load-more button

Part 1 implemented a "show more" button, and Part 2 requires using the
mechanism already chosen in Part 1. Pagination is therefore not implemented.

Coffee House rules to encode:

| Width | Initial cards | Button |
|-------|---------------|--------|
| >768px | all cards of the active category | hidden — nothing is hidden |
| ≤768px | first 4 cards | shown only if the category has more than 4 |

Consequence: the **tea** category has exactly 4 products, so the button must
**never** appear for tea. This is the specified behaviour, not a bug.

Switching category resets the initial set. A window resize re-evaluates the
count and the button state.

### 3.4 Breakpoint 768/769

The assignment states the burger works at ≤768px and that at ≥769px the main
navigation is displayed. The Part 1 stylesheet hides the navigation at
**991px**, which contradicts this criterion. The Part 2 work must move the
header breakpoint to `max-width: 768px`.

### 3.5 Categories

Three categories: `coffee`, `tea`, `dessert` — the order they appear in
`products.json`, which also matches the Figma tab order. `coffee` is first and
therefore the default active category.

### 3.6 Language

`AGENTS.md` and the skills are written in English; `part-1.md` is English;
this file keeps the assignment wording in Russian as published. Only Section 3
is project-authored.
