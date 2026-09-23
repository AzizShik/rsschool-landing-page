# RS School Landing Page — Part 1 Requirements

## 1. Project Goal

Build a responsive landing page based on the provided Coffee House Figma design.

The project must contain two linked pages:

* Home page
* Menu/Catalog page

The implementation must be responsive from **1440px down to 380px**.

The project must support:

* light theme
* dark theme
* theme persistence using `localStorage`

The Coffee House design is an allowed ready-made design for this assignment. The visual mockup is used as the primary reference.

---

## 2. Shared Site Structure

Both pages must use the same:

* Header
* Footer

The Header and Footer must be implemented as reusable components rather than duplicated independently on each page.

Both pages must be connected through working navigation.

---

## 3. Header

The Header must be present on both pages.

It must contain:

* Logo/name linking to the Home page
* Navigation
* Main page sections
* Link to the catalog/menu page
* Light/dark theme switcher
* Burger button for mobile layouts

The navigation should use semantic HTML:

```html
<nav>
  <ul>
    <li>
      <a href="...">...</a>
    </li>
  </ul>
</nav>
```

At widths of **768px and below**:

* desktop navigation must be hidden
* burger button must be displayed

The burger button may remain inactive in Part 1.

---

## 4. Home Page

The Home page must contain at least four content sections.

It must include:

* Hero section
* Slider/carousel with at least 3 items
* At least 2 additional content sections

The slider/carousel may be visual-only in Part 1.

Interactive slider functionality is not required unless explicitly requested later.

---

## 5. Menu / Catalog Page

The Menu/Catalog page must contain:

* At least 3 product categories
* Category controls
* At least 8 product cards in one category
* Load-more or pagination UI

Each product card must contain:

* Image
* Title
* Short description
* Additional information

For the Coffee House design, use the button shown in the mockup.

The following functionality may remain inactive in Part 1:

* category switching
* load-more behavior
* product modal behavior

The required visual elements and states must still be present.

---

## 6. Footer

The Footer must be present on both pages.

It must contain:

* Contact information
* External/social links
* Additional project information

External and social links must work.

---

## 7. Theme

The application must support both:

* Light theme
* Dark theme

The theme switcher must work on both pages.

The selected theme must:

* be saved to `localStorage`
* persist when navigating between pages
* be restored after page reload
* remain synchronized with the theme switcher state

Both themes must provide readable and sufficiently contrasting content.

---

## 8. Responsive Design

The layout must be checked at:

* 1440px
* 768px
* 380px

It must also work correctly at intermediate viewport widths.

Requirements:

* No horizontal overflow
* No horizontal scrolling caused by the layout
* Images must preserve their proportions
* The entire page must not be scaled down as a single image or block
* At widths greater than 1440px, the main content must remain constrained and centered
* At widths of 768px and below, desktop navigation must be hidden
* At widths of 768px and below, the burger button must be displayed

Responsive behavior must be implemented using responsive layout techniques and media queries.

---

## 9. Navigation and Interactive States

Navigation links must work.

Anchor navigation should provide smooth scrolling where appropriate.

Links, buttons, and cards must have appropriate hover states.

Transitions should not cause neighboring elements to shift unexpectedly.

---

## 10. Visual Requirements

The Coffee House Figma mockup is the primary visual guide.

Pixel-perfect reproduction is **not required**.

The implementation should nevertheless closely follow the visual design, including:

* layout
* proportions
* typography
* spacing
* colors
* imagery
* component appearance
* responsive behavior

Each major block is evaluated separately.

---

## 11. Part 1 Scope Restriction

This project currently implements **Part 1 only**.

Do not implement Part 2 functionality unless explicitly requested.

The following interactions may remain inactive in Part 1:

* Burger menu opening/closing
* Functional slider/carousel
* Product category switching
* Load-more behavior
* Product modal behavior

The visual UI for these elements must still be implemented when required by the design.

---

## 12. Submission Requirements

The project must use a dedicated branch:

```text
landing-page
```

The branch should be created from `main`.

The completed project must be deployed.

A Pull Request should be created from `landing-page` to `main`.

The Pull Request must not be merged or closed as part of the submission process.

---

## 13. Evaluation Areas

The implementation is evaluated across the following areas:

* Pages and navigation
* Required page elements
* Visual implementation at 1440px
* Visual implementation at 768px
* Visual implementation at 380px
* Responsive behavior
* Light/dark themes
* Semantic HTML
* Accessibility
* Hover and interactive states

---

## 14. Implementation Priority

When implementing the project, follow this priority:

1. Required page structure
2. Shared Header and Footer
3. Design system and global styles
4. Home page sections
5. Menu/Catalog page
6. Light/dark theme
7. Responsive behavior
8. Navigation
9. Hover and transition states
10. Accessibility
11. Final visual refinement

Do not implement optional Part 2 functionality unless explicitly requested.
