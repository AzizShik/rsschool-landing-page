# Coffee House — RS School Landing Page

## Project Overview

This project is an RS School Fullstack Engineering Landing Page Part 1
assignment.

The project implements the Coffee House design from the provided Figma mockup.

The application must contain two pages:

- Home page
- Menu/Catalog page

The implementation must follow the RS School Landing Page Part 1 requirements
and the provided Figma design.

---

## Current Scope

IMPORTANT:

This project currently implements **ONLY Part 1** of the assignment.

Do NOT implement Part 2 functionality unless explicitly requested.

Part 1 is primarily a visual and structural implementation.

The following functionality may remain static/inactive when the requirements
allow it:

- burger menu functionality
- slider/carousel interaction
- category switching
- load-more functionality
- product modal functionality
- other Part 2-specific interactions

Visual states required by the design should still be implemented.

Do not add unnecessary JavaScript functionality just because it could be
implemented.

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

Additional reusable components may be introduced when a visual or structural
pattern is genuinely repeated.

Do not create components only for the sake of having more components.

Page-specific sections should remain inside their respective page directories
unless there is a clear reason to reuse them.

---

## Project Architecture

Use the following structure:

````text
src/
├── assets/
│
├── components/
│   ├── Header/
│   ├── Footer/
│   ├── Button/
│   ├── ThemeToggle/
│   └── Card/
│
├── pages/
│   ├── home/
│   └── menu/
│
├── styles/
│   ├── reset.css
│   ├── variables.css
│   ├── global.css
│   └── utilities.css
│
└── js/
    └── theme.js

The structure may be extended when necessary, but do not reorganize the architecture without a clear reason.


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

Use JavaScript only where it is required by the Part 1 requirements.

Currently required functionality includes:

- theme switching
- theme persistence using `localStorage`

Do not introduce unnecessary application state or complex frameworks.

Avoid implementing Part 2 interactions unless explicitly requested.

---

## JavaScript Quality

Avoid:

- unnecessary `any`
- duplicated logic
- global mutable state when unnecessary
- magic numbers when a design variable can be used
- duplicated component implementations
- unnecessary dependencies

Prefer simple, readable, maintainable code.

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

Preferred order:

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
12. Final review

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
- implement Part 2 functionality without permission
- add unnecessary dependencies
- replace the Figma design with your own design
- use screenshots as the page implementation
- ignore responsive requirements
- ignore dark theme requirements
- remove existing user code without permission
- perform destructive git operations

When uncertain, prefer the simplest implementation that satisfies the requirements and existing architecture.

If a requirement is unclear, inspect the project requirements or Figma design before making assumptions.

The theme switcher is part of the shared Header.

Its exact visual placement, appearance, dimensions, icons, spacing, and responsive behavior must follow the Figma design.

