---
name: responsive
description:
  Ensures responsive layout from 1440px down to 380px according to Part 1
  requirements and Figma.
---

# Responsive Layout Skill

## Purpose

Ensures fluid adaptation across screen resolutions from 1440px down to 380px
without layout shifts, horizontal scrollbars, text clipping, or zoom-scaling.

## Core Rules & Constraints

### 1. Viewport Limits & Breakpoints

- **Desktop (Base):** `1440px`
- **Tablet / Mobile Switch:** `768px` (Desktop navigation hides, burger button
  appears)
- **Mobile Minimum:** `380px` (Layout must not break or cause overflow down to
  380px)
- **Container Centering (> 1440px):** Content wider than 1440px must remain
  constrained and centered (`max-width: 1440px; margin: 0 auto;`).

### 2. Layout & Sizing Principles

- **No Fixed Widths:** Never use fixed pixel widths on layout containers
  (`width: 1200px` is BANNED). Use `max-width`, `%`, `vw`, or Flexbox/Grid
  elasticity.
- **Relative Units:** Use `rem` for typography, paddings, and margins. Use `em`
  for media queries or component-relative sizing.
- **No Page Scaling:** Never scale the whole page using `transform: scale()` or
  CSS `zoom`. The layout must adapt natively using fluid CSS rules.
- **Image & Asset Fluidity:** Ensure all `img`, `svg`, and `video` elements have
  `max-width: 100%`, `height: auto`, and `object-fit: cover`.
- **Overflow Protection:** Prevent horizontal scrolling caused by absolute
  positioning, scaling, or negative margins. Apply `overflow-x: hidden` on the
  outer layout wrapper or body.

### 3. Container Padding & Touch Targets

- **Horizontal Margins/Padding:** Maintain uniform side padding across all
  sections (`40px` on desktop, `16px` on screens <= 768px).
- **Touch Targets:** Interactive elements on screens <= 768px must have
  accessible tap areas (minimum `44x44px`).
