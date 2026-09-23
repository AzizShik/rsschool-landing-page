---
name: project-requirements
description: Keeps implementation aligned with the RS School Landing Page Part 1 requirements and prevents accidental Part 2 functionality.
---

# Project Requirements Skill

## Purpose

Use this skill whenever implementing, reviewing, or planning work for the RS School Coffee House Landing Page project.

The authoritative project requirements are defined in:

- `AGENTS.md`
- `docs/requirements/part-1.md`

Always follow both documents.

## Scope

This project currently implements **Part 1 only**.

Do not implement Part 2 functionality unless the user explicitly requests it.

Part 1 may include the visual appearance of controls and interactive elements, but functionality that belongs to Part 2 should remain inactive.

## Required Pages

The project must contain two linked pages:

1. Home page
2. Menu/catalog page

Both pages must use the shared Header and Footer.

## Home Page Requirements

The Home page must contain:

- shared Header
- Hero section
- Slider/carousel with at least 3 items
- at least 2 additional content sections
- shared Footer

The slider may be visual-only in Part 1.

Do not implement functional slider behavior unless explicitly requested.

## Menu Page Requirements

The Menu page must contain:

- shared Header
- at least 3 categories
- category controls
- at least 8 cards in one category
- load-more control or pagination
- shared Footer

Each card must contain:

- image
- title
- short description
- additional information

For the Coffee House design, use the button/control shown in the Figma design.

Category switching, load-more behavior, pagination behavior, and modal behavior may remain inactive in Part 1.

Do not implement their Part 2 functionality unless explicitly requested.

## Header Requirements

The shared Header must contain:

- logo/name linking to the Home page
- navigation
- catalog/menu link
- light/dark theme switcher
- burger button at widths <= 768px

Navigation must use semantic:

- `nav`
- `ul`
- `li`
- `a`

The burger button may remain inactive in Part 1.

The theme switcher must work.

Its exact visual appearance, placement, dimensions, icons, spacing, and responsive behavior must follow Figma.

## Footer Requirements

The shared Footer must appear on both pages.

It must contain:

- contact information
- external/social links
- additional project information

Links that are required by the design or project requirements must work.

## Theme Requirements

Both pages must support:

- light theme
- dark theme
- working theme switcher
- theme persistence using `localStorage`
- restoring the selected theme after reload
- preserving the selected theme when navigating between pages
- toggle state matching the current theme
- readable text and sufficient contrast

Do not implement separate theme logic independently for each page.

Prefer one shared theme implementation.

## Responsive Requirements

The implementation must work from:

- 1440px
- 768px
- 380px

and all intermediate widths.

The implementation must:

- avoid horizontal overflow
- preserve image proportions
- avoid scaling the entire page as one image/layout
- constrain and center content above 1440px
- hide desktop navigation at <= 768px
- show the burger button at <= 768px

Do not create separate desktop/mobile implementations when responsive CSS can handle the layout.

## Navigation Requirements

Required navigation links must work.

Use semantic anchors.

Smooth scrolling should be used where appropriate for same-page navigation.

Navigation must work between the two pages.

## Interaction Requirements

Required visual interaction states include:

- hover states
- appropriate transitions
- visible interactive affordances

Transitions must not cause neighboring elements to shift unexpectedly.

Part 1 does not require implementing inactive Part 2 interactions.

## Visual Requirements

The Coffee House Figma design is the primary visual reference.

Use Figma to determine:

- layout
- dimensions
- spacing
- colors
- typography
- imagery
- component appearance
- responsive behavior

Do not invent visual details when they can be determined from Figma.

Pixel-perfect reproduction is not required, but every major block should visually correspond to the design.

## Semantic and Accessibility Requirements

Prefer semantic HTML.

Use:

- `header`
- `nav`
- `main`
- `section`
- `footer`
- appropriate heading hierarchy
- meaningful `alt` text for meaningful images
- buttons for button actions
- anchors for navigation

Interactive elements should have appropriate focus states.

Do not add unnecessary ARIA attributes when native HTML semantics are sufficient.

## Shared Components

Header and Footer must have a single source of truth.

Do not duplicate their markup independently across pages.

If the same visual pattern is reused across multiple locations, consider extracting it into a reusable component.

Page-specific sections should remain associated with their page.

## Design System

Prefer shared design tokens instead of repeated hardcoded values.

The project should have semantic tokens for:

- colors
- typography
- spacing
- layout/container dimensions
- border radius
- transitions

Theme-specific values should override semantic tokens rather than requiring separate hardcoded component styles.

## Part 2 Protection

Do not add the following functionality unless explicitly requested:

- functional burger menu
- functional slider/carousel
- functional category switching
- functional load-more
- functional pagination
- functional product modal
- other Part 2-specific interactions

Visual controls for these features are allowed when required by the Figma design.

## Implementation Decision Rule

Before implementing a feature, determine:

1. Is it required by `docs/requirements/part-1.md`?
2. Is it visible in the Figma design?
3. Is it Part 1 functionality or Part 2 functionality?
4. Does it belong to a shared component?
5. Can it be implemented using the existing architecture?

If a feature is not required for Part 1 and would introduce Part 2 behavior, do not implement it.

## Validation

After implementation, verify:

- both pages exist
- both pages are linked
- Header is shared
- Footer is shared
- theme works on both pages
- theme persists through reload
- theme persists between pages
- responsive behavior works at 1440px, 768px, and 380px
- no horizontal overflow exists
- required Home sections exist
- slider contains at least 3 items
- Menu contains at least 3 categories
- Menu contains at least 8 cards in one category
- required controls are visually present
- required links work
- hover states exist
- semantic structure is used
- no accidental Part 2 functionality was introduced

## Priority

When requirements conflict, use this priority:

1. Explicit user instruction
2. `docs/requirements/part-1.md`
3. `AGENTS.md`
4. Figma design
5. This skill
6. General implementation preferences

Never use this skill to override an explicit user request.
