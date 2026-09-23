---
name: accessibility
description:
  Enforces W3C accessibility standards, proper semantic HTML, ARIA attributes,
  and keyboard navigation.
---

# Accessibility (A11y) Skill

## Purpose

Ensures the Coffee House application meets modern web accessibility standards
(WCAG 2.1 AA level), supports screen readers, proper heading hierarchies, and
keyboard navigation.

## Core Rules & Constraints

### 1. Semantic HTML & Structure

- Use explicit semantic tags (`header`, `nav`, `main`, `footer`, `section`,
  `article`).
- Maintain a logical heading hierarchy (`h1` -> `h2` -> `h3`). Do not skip
  heading levels for visual styling.
- Ensure every page contains exactly one `h1` element.
- All non-text content (images, icons) must have descriptive `alt` text or
  `aria-label` attributes.
- Decorative images must have empty `alt=""` or `aria-hidden="true"`.

### 2. Interactive Elements & Forms

- Always use native `button` elements for actions and `a` tags for links. Do not
  use `div` or `span` as clickable buttons.
- Form inputs must have linked `label` elements using matching `for` and `id`
  attributes.
- Interactive controls must feature visible focus indicators for keyboard
  navigation.

### 3. Focus & CSS Rules

- Interactive elements must maintain a clear focus state.
- Do not hide outline without providing an alternative focus ring.

```css
:focus-visible {
	outline: 2px solid var(--color-border-accent);
	outline-offset: 2px;
}

.visually-hidden {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}
```

4. Color Contrast & Touch Targets

- Text elements must satisfy minimum contrast ratios (at least 4.5:1 for normal
  text).
- Tap targets on mobile screens must be at least 44x44px.
