---
name: design-system
description:
  Defines and maintains a consistent CSS design system based on the Coffee House
  Figma design.
---

# Design System Skill

## Purpose

Use this skill when establishing or modifying the visual foundation of the
Coffee House landing page.

The design system must be derived from the Figma design rather than invented
independently.

## Source of Truth

Use:

1. Figma design
2. `AGENTS.md`
3. `docs/requirements/part-1.md`

Do not invent visual values when they can be determined from Figma.

## Design Tokens

Create shared semantic CSS variables for recurring visual values.

At minimum consider tokens for:

### Colors

- page background
- surface/background containers
- primary text
- secondary text
- accent color
- borders
- interactive states

Use semantic names rather than component-specific names.

Prefer:

```css
--color-text-primary
```

over:

```css
--header-black
```

### Typography

Define shared values for:

- font family
- heading sizes
- body sizes
- line heights
- font weights

Typography values should correspond to the Figma design.

Avoid repeating identical typography declarations unnecessarily.

### Spacing

Define a consistent spacing system for recurring gaps and paddings.

Use shared variables where the same spacing values occur repeatedly.

Do not create variables for every single unique pixel value.

### Layout

Define shared layout tokens such as:

- maximum content width
- page/container horizontal padding
- section spacing

Content wider than the supported viewport should remain constrained and
centered.

### Borders and Radius

Define reusable values for:

- border widths
- border radius

Use the values from Figma where applicable.

### Transitions

Define a shared transition strategy for interactive elements.

Transitions should be subtle and must not cause layout shifts.

## Themes

The project supports light and dark themes.

Theme-specific values should override semantic variables.

Prefer:

```css
:root {
	--color-background: ...;
	--color-text-primary: ...;
}

[data-theme='dark'] {
	--color-background: ...;
	--color-text-primary: ...;
}
```

Components should consume semantic variables instead of directly checking the
current theme.

Avoid:

```css
.dark .header {
	color: ...;
}
```

when the same result can be achieved through semantic tokens.

## Component Styling

Reusable components should consume the shared design tokens.

Do not hardcode the same color, spacing, radius, or typography value across
multiple components.

If a visual value appears repeatedly, consider whether it belongs in the design
system.

## Figma Accuracy

When implementing a visual element:

1. Inspect the corresponding Figma element.
2. Identify its typography, colors, spacing, dimensions, radius, and states.
3. Determine whether those values are shared with other elements.
4. Create or reuse appropriate design tokens.
5. Implement the component using those tokens.

Do not approximate a value when the required value can be obtained from Figma.

Pixel-perfect reproduction is not required, but the implementation should
visually correspond to the design.

## Responsive Tokens

Design tokens may have responsive overrides when required by the Figma design.

For example:

```css
:root {
	--container-padding: ...;
}

@media (max-width: 768px) {
	:root {
		--container-padding: ...;
	}
}
```

Do not create separate unrelated design systems for desktop and mobile.

Prefer shared semantic tokens with responsive overrides.

## Reusability

The design system should support shared components such as:

- Header
- Footer
- buttons
- cards
- theme switcher
- navigation elements

Shared visual patterns should have one source of truth.

## Avoid Over-Abstraction

Do not create tokens or abstractions solely because they are technically
possible.

Avoid:

- variables used only once
- excessive utility classes
- unnecessary component-specific design systems
- deeply nested styling abstractions

The goal is consistency and maintainability, not maximum abstraction.

## Validation

When reviewing the design system, verify:

- repeated colors use shared tokens
- repeated typography uses shared values
- repeated spacing uses shared values
- themes use semantic token overrides
- components do not contain unnecessary hardcoded design values
- responsive values remain coherent
- tokens correspond to the Figma design
- the design system remains simple enough to maintain
