# Fitcorn Design System

## Overview

A lightweight, modern design system for Fitcorn e-commerce built with Angular Standalone components and Tailwind CSS v4.

## Core Principles

- Clean: minimal visual noise, clear hierarchy, and purposeful whitespace
- Premium: refined surfaces, deliberate typography, and strong product framing
- Systematic: reusable tokens first, component decisions second
- Mobile first: every primitive should feel stable on small screens before scaling up
- Accessible: visible focus states, readable contrast, and sensible motion defaults
- Performant: no heavy UI library dependency for core interface primitives

## Brand Tokens

### Primary Brand: Corn

| Token | Hex | Usage |
|---|---|---|
| `corn-50` | `#fffbeb` | soft tint background |
| `corn-100` | `#fef3c7` | subtle highlight surface |
| `corn-200` | `#fde68a` | hover tint |
| `corn-300` | `#fcd34d` | accent hover |
| `corn-400` | `#fbbf24` | primary action |
| `corn-500` | `#f59e0b` | active accent |
| `corn-600` | `#d97706` | strong accent text |
| `corn-700` | `#b45309` | dark accent text |
| `corn-800` | `#92400e` | deep accent |
| `corn-900` | `#78350f` | deeper accent |
| `corn-950` | `#451a03` | darkest accent |

### Neutral Brand: Charcoal

| Token | Hex | Usage |
|---|---|---|
| `charcoal-50` | `#f6f6f7` | light page background |
| `charcoal-100` | `#ececed` | subtle surface |
| `charcoal-150` | `#dedee0` | soft border |
| `charcoal-200` | `#d0d0d3` | default border |
| `charcoal-300` | `#b1b1b6` | disabled text |
| `charcoal-350` | `#9e9ea5` | muted body text |
| `charcoal-400` | `#8c8c93` | secondary text |
| `charcoal-455` | `#7a7a82` | strong muted text |
| `charcoal-500` | `#6b6b72` | body text |
| `charcoal-600` | `#4a4a50` | strong text |
| `charcoal-700` | `#2d2d32` | dark text |
| `charcoal-800` | `#1c1c1e` | dark primary surface |
| `charcoal-850` | `#161618` | dark elevated surface |
| `charcoal-900` | `#121214` | dark page background |
| `charcoal-950` | `#0a0a0b` | darkest background |

## Semantic Tokens

These tokens should drive component styling before raw palette tokens are used.

### Surfaces

- `--color-surface-base`: default field and card background
- `--color-surface-subtle`: muted background
- `--color-surface-muted`: secondary surface
- `--color-surface-elevated`: elevated container background
- `--color-surface-inverse`: inverse surface for dark-on-light swaps

### Text

- `--color-text-primary`: primary content color
- `--color-text-secondary`: secondary supporting color
- `--color-text-muted`: helper, metadata, and placeholder color
- `--color-text-inverse`: inverse text color

### Borders and Feedback

- `--color-border-default`: default border color
- `--color-border-muted`: softer divider color
- `--color-border-strong`: hover or stronger edge color
- `--color-focus-ring`: focus halo color
- `--color-danger`: destructive/error accent
- `--color-danger-soft`: error focus or background halo

## Typography

| Token | Font | Usage |
|---|---|---|
| `font-sans` | Plus Jakarta Sans | body copy, controls, utility labels |
| `font-display` | Outfit | headings, pricing, large emphasis |

### Type Guidance

- `text-[10px]`: labels and overlines
- `text-xs`: metadata and helper copy
- `text-sm`: default body size for forms and cards
- `text-base`: longer body text
- `text-lg` and up: titles, section headers, and pricing accents

Use `font-display` sparingly for emphasis. Most UI chrome should stay on `font-sans`.

## Spacing and Radius

### Common Spacing

- `p-4`: compact card or control grouping
- `p-5`: default card padding
- `p-6`: modal and section card padding
- `p-8`: large feature sections
- `gap-2` to `gap-4`: dense to normal control spacing
- `gap-6` to `gap-12`: layout spacing

### Radius

| Token | Value | Usage |
|---|---|---|
| `rounded-md` | 6px | controls and buttons |
| `rounded-lg` | 8px | compact containers |
| `rounded-xl` | 12px | cards and content sections |
| `rounded-2xl` | 16px | premium feature blocks |
| `rounded-full` | pill UI, avatars, badges only |

## Control Foundation

Use shared utility classes before custom local styling:

- `.ds-label`: standard field label
- `.ds-hint`: standard hint text
- `.ds-error`: standard error text
- `.ds-control`: base field surface, border, hover, and focus behavior
- `.ds-card`: base card surface and elevation behavior

### Control Rules

- All interactive controls should expose a visible focus state
- Error state should use `.is-invalid` on top of `.ds-control`
- Control height should come from `--control-height-sm|md|lg`
- Placeholder color should be treated as muted content, not disabled content

## Component Status

### Stable Foundations

- `Button`
- `Input`
- `PasswordInput`
- `Select`
- `Textarea`
- `Card`

### Needs Further Unification

- `Checkbox`
- `Radio`
- advanced feedback and overlay primitives

## Accessibility Rules

- Never remove focus indication without replacing it
- Prefer `focus-visible` behavior over `focus`-only decoration
- Avoid low-contrast muted text on tinted surfaces
- Motion should support reduced-intensity interpretation and never carry critical meaning alone

## Usage Notes

- Prefer semantic tokens and shared utility classes over raw hex or repeated utility chains
- Use local one-off styling only when a component has a real visual exception
- If a component introduces a new visual pattern repeatedly, promote it into the system
