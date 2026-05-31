# Fitcorn Design System

## Overview

A lightweight, modern design system for Fitcorn e-commerce built with Angular 20 Standalone + Tailwind CSS v4.

### Core Principles

- **Clean** — Minimal visual noise, purposeful whitespace
- **Modern** — Glassmorphism, subtle shadows, smooth transitions
- **Premium** — Attention to detail, refined color palette
- **Mobile First** — Responsive by default
- **Dark Mode** — Full support via Tailwind `dark:` prefix
- **Performant** — No heavy UI libraries, pure Tailwind

### Color Palette

#### Primary Brand — "Corn" (Amber/Yellow)

| Token | Hex | Usage |
|---|---|---|
| `corn-50`  | `#fffbeb` | Light bg |
| `corn-100` | `#fef3c7` | Badge bg |
| `corn-200` | `#fde68a` | Hover states |
| `corn-300` | `#fcd34d` | Accent hover |
| `corn-400` | `#fbbf24` | **Primary accent** (CTAs, buttons, highlights) |
| `corn-500` | `#f59e0b` | Interactive hover |
| `corn-600` | `#d97706` | Active states |
| `corn-700` | `#b45309` | Text/dark bg |
| `corn-800` | `#92400e` | — |
| `corn-900` | `#78350f` | — |
| `corn-950` | `#451a03` | — |

#### Neutral — "Charcoal" (Premium Dark)

| Token | Hex | Usage |
|---|---|---|
| `charcoal-50`  | `#f6f6f7`  | Lightest bg |
| `charcoal-100` | `#ececed`  | Card bg light |
| `charcoal-150` | `#dedee0`  | Border light |
| `charcoal-200` | `#d0d0d3`  | Borders |
| `charcoal-300` | `#b1b1b6`  | Disabled text |
| `charcoal-350` | `#9e9ea5`  | Muted text |
| `charcoal-400` | `#8c8c93`  | Secondary text |
| `charcoal-455` | `#7a7a82`  | Body text |
| `charcoal-500` | `#6b6b72`  | Body text |
| `charcoal-600` | `#4a4a50`  | Strong text |
| `charcoal-700` | `#2d2d32`  | Dark text |
| `charcoal-800` | `#1c1c1e`  | **Dark BG Primary** |
| `charcoal-850` | `#161618`  | Dark surface |
| `charcoal-900` | `#121214`  | **Dark BG Secondary** |
| `charcoal-950` | `#0a0a0b`  | Darkest bg |

### Typography

| Token | Font | Weight | Usage |
|---|---|---|---|
| `font-sans` | Plus Jakarta Sans | 300-800 | Body, UI elements |
| `font-display` | Outfit | 300-800 | Headings, display text |

#### Text Size Map

- `text-[10px]` — Labels, badges (uppercase tracking-widest)
- `text-xs` — Captions, meta info
- `text-sm` — Body text, descriptions
- `text-base` — Regular text
- `text-lg` — Card titles
- `text-xl` — Section headings
- `text-2xl` — Page headings
- `text-3xl` — Hero headings
- `text-4xl` — Large hero
- `text-5xl` — Display

### Spacing

Standard Tailwind spacing scale. Common patterns:

- `p-4` — Card inner padding (compact)
- `p-5` — Card inner padding (default)
- `p-6` — Modal/dialog padding
- `p-8` — Large container padding
- `gap-2` — Tight element spacing
- `gap-3` — Default element spacing
- `gap-4` — Section spacing
- `gap-6` — Card grid spacing
- `gap-12` — Section spacing

### Border Radius

| Token | Size | Usage |
|---|---|---|
| `rounded-md` | 6px | **Buttons, inputs, selects, interactive elements** |
| `rounded-lg` | 8px | Cards (mobile nav items) |
| `rounded-xl` | 12px | Cards, dialogs, containers |
| `rounded-2xl` | 16px | Large containers, modals (glassmorphism) |
| `rounded-full` | 9999px | Avatars, floating buttons, icons only |

### Shadows

| Token | Light | Dark | Usage |
|---|---|---|---|
| `shadow-sm` | Standard | Standard | Subtle elevation |
| `shadow` | Standard | Standard | Default elevation |
| `shadow-lg` | Standard | Standard | Cards, dropdowns |
| `shadow-xl` | Standard | Standard | Modals, dialogs |
| `shadow-premium` | Custom light | — | Premium cards (light mode) |
| `shadow-premium-dark` | — | Custom dark | Premium cards (dark mode) |

### Glassmorphism

Two CSS classes for frosted-glass effect:

- `.glassmorphism-light` — `rgba(255,255,255,0.65)` backdrop-blur
- `.glassmorphism-dark` — `rgba(28,28,30,0.65)` backdrop-blur

Usage: apply programmatically via `[appGlassmorphism]` directive or manual `[ngClass]`.

### Component Architecture

All components in `shared/ui/` are:
- Angular Standalone
- SSR compatible
- Dark mode via Tailwind `dark:` prefix
- Signal-based inputs
- No external style files (inline templates)

### Exports

The barrel file is at `shared/ui/index.ts` — import from `@fitcorn/ui` convention or direct path.
