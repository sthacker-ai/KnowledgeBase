# KnowledgeBase Brand Guide

**Identity:** "Nocturne" — premium dark theme, shipped 2026-07-06 (full replacement of the earlier light indigo/amber theme; see `git log` for the prior version if needed).

## Identity

**App name:** KnowledgeBase
**Tagline:** Turn liked posts into lasting knowledge.
**Voice:** Focused, practical, personal. Not corporate, not academic.

## Logo Mark

Two overlapping rounded squares — one gold (top-left) and one rose (bottom-right).
They represent the dual flow of the system: **input** (raw saved content) and **output** (synthesised knowledge).

- Top-left square: `--gold` `#F3C14B` — structured knowledge, courseware
- Bottom-right square: `--rose` `#F2789F` — raw imports, sources in flight

Do not use the text name without the mark at sizes above 16px.

## Color Palette

Dark is the **default** theme (`:root`). Light is a secondary variant, applied via `[data-theme="light"]` and toggled by the floating pill button (bottom-right of every page). Both variants share the same gold/rose accent family — light mode is not a separate brand, just a lower-contrast reading mode.

### Accent
| Token | Dark | Light | Use |
|---|---|---|---|
| `--brand` (= `--gold`) | `#F3C14B` | `#B9860F` | Active nav, primary numerals, links |
| `--rose` | `#F2789F` | `#D65B86` | Secondary accent, hero glow, gradient endpoint |
| `--brand-light` | `#F7D072` | `#A2760D` | Hover states |
| `--brand-dim` | `rgb(243 193 75 / 14%)` | `rgb(185 134 15 / 12%)` | Active nav background, chips |
| `--accent-gradient` | `linear-gradient(118deg, gold → rose)` | same hues, darker | Primary buttons, gradient headline/numerals |

### Status Colors (dark values; light variant is a darker/more saturated shift of the same hue)
| Token | Hex (dark) | Meaning |
|---|---|---|
| `--amber` `#F3C14B` | Amber (= gold) | Imported / raw / in-flight sources |
| `--green` `#56D6A0` | Green | Extracted / classified / complete / OK |
| `--blue` `#6EA8FF` | Blue | Extracted, info states, running |
| `--purple` `#B79BFF` | Purple | Classified, AI-processed, topic nodes |
| `--red` `#FF6B7A` | Red | Error, failed processing |

### Source processing status → color mapping
| Status | Color |
|---|---|
| `imported` | Amber |
| `extracted` | Blue |
| `classified` | Purple |
| `course_generated` | Green |
| `completed_with_errors` (pipeline run) | Amber ("Partial") |
| `error` / `failed` | Red |

### Backgrounds
| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg` | `#0A0C14` | `#F6F5F2` | Page background |
| `--body-bg` | radial gold+rose glow over `#0A0C14`, fixed attachment | flat `#F6F5F2` | `<html>`/`<body>` background |
| `--surface` | `#141826` | `#FFFFFF` | Cards, sidebar, panels |
| `--surface-glass` | `rgb(255 255 255 / 4%)` | `#FFFFFF` | Glass overlay layered on `--surface` (stat cards, panels, widgets) |
| `--surface-alt` | `#1B2032` | `#EFECE5` | Hover states, subtle fills |
| `--sidebar-bg` | `rgb(10 12 20 / 72%)`, blurred | `#FFFFFF` | Sidebar (glass in dark mode) |

### Text
| Token | Dark | Light |
|---|---|---|
| `--text` | `#ECEEFB` | `#191A1F` |
| `--text-sub` | `#B6BCD6` | `#54586A` |
| `--muted` | `#8990AD` | `#8A8E9D` |

### Borders
| Token | Dark | Light |
|---|---|---|
| `--border` | `#262C40` | `#E6E2D8` |
| `--border-strong` | `#38405C` | `#D2CDBF` |

### Shadows & Glow
| Token | Use |
|---|---|
| `--shadow-sm` / `--shadow` / `--shadow-lg` | Standard elevation, deeper/darker in dark mode |
| `--glow` | Ambient gold glow used behind hero art and on hover of key CTAs |

## Typography

**Display font:** Space Grotesk (self-hosted via `next/font/google`, weights 400–700) — used for headings, hero copy, and the theme toggle label.
**Body font:** Space Grotesk also carries body copy (`--font-body`) — one geometric sans voice across the app rather than a separate reading face.
**Mono font:** JetBrains Mono (self-hosted via `next/font/google`) — used for all numerals, stat values, IDs, timestamps, and tabular data (`font-variant-numeric: tabular-nums` where digits line up).

Both fonts are bundled at build time (no runtime CDN request), so they render identically offline and on a fresh Vercel deploy.

| Role | Size | Weight | Face |
|---|---|---|---|
| Hero headline | clamp(1.6rem, 3vw, 2.3rem) | 700 | Space Grotesk, gradient-filled (white → gold → rose) |
| Section title | 0.97rem | 700 | Space Grotesk |
| Body | 0.88–0.9rem | 400–600 | Space Grotesk |
| Labels / caps | 0.67–0.72rem | 700, uppercase | Space Grotesk / JetBrains Mono |
| Stat values | 2.3rem | 700, gradient-filled | JetBrains Mono, tabular-nums |

## Layout

**Shell:** 3-column grid — `240px sidebar | flex-1 workspace | 280px right panel`
Collapses to 2-col at ≤1300px, single-col at ≤900px.

**Hero banner:** Near-black gradient panel with two animated ambient glow blobs (rose top-right, gold bottom-left, 8s ease-in-out pulse) and a gradient headline (white → gold → rose text-fill). Respects `prefers-reduced-motion` (glow animation disabled).

**Stat cards / panels:** Glass surfaces — a translucent white gradient (`--surface-glass`) layered over `--surface`, with `backdrop-filter: blur(6px)`, a 1px border, and a lift + stronger shadow on hover. Stat numerals use the gold→rose gradient fill in JetBrains Mono.

**Page transitions:** Every route re-mounts inside `app/template.tsx`, which fades the whole page in on navigation (`kb-page-transition`, opacity-only so the sticky sidebar layout never breaks).

**Entrance animation:** Cards/sections that opt in via `.kb-animate-in` rise + fade + slightly scale in on mount, staggered by a `--stagger` CSS variable (80ms per step).

**Tables:** Clean rows with hover highlight (`--surface-alt`), no heavy borders.

**Badges:** Pill-shaped with dot prefix (`--badge` classes) or a solid pill (run-status badges), colored per status mapping above — all read from CSS variables, no hard-coded hex, so they re-skin automatically with the theme.

## Component Patterns

### Stat card (glass, gradient numeral)
```
┌─────────────────────────┐
│ [icon]                  │  ← 1px border, blurred glass fill
│                         │
│ 214      ← gradient num │  ← JetBrains Mono, gold→rose fill
│ SOURCES  ← mono label   │  ← uppercase, letter-spaced
│ 33 filtered ← sub       │  ← status-color text
│▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ │  ← 3px status-colored bottom border
└─────────────────────────┘
```

### Theme toggle (fixed, bottom-right, every page)
A labeled pill (`Dark` / `Light`), not an icon-only button — sun/moon glyph + text label, lifts and glows gold on hover. Preference persists to `localStorage`; an inline pre-paint script in `app/layout.tsx` applies it before first render so there's no flash. Default (no saved preference) is **dark**.

### Status badge
```
● imported            (amber bg, amber text)
● extracted           (blue bg, blue text)
● classified          (purple bg, purple text)
● course_generated    (green bg, green text)
● completed_with_errors ("Partial", amber bg, amber text)
```

### Pipeline step
```
(✓) Step 1    ← green dot = done
(2) Step 2    ← gold dot = next/active
( ) Step 3    ← gray dot = queued
```

## Do / Don't

**Do:**
- Use the gold→rose gradient (`--accent-gradient`) for primary CTAs and gradient text — never solid `--brand` with white text (gold-on-white has poor contrast; always pair gold backgrounds with dark text `#1A1206`).
- Use amber for anything "in the pipeline but not done."
- Use green exclusively for completed/learned/OK states.
- Use monospace (JetBrains Mono) for all IDs, counts, paths, and technical values.
- Read every color from a CSS variable — never hard-code a hex in a component, so both themes and any future palette change apply everywhere at once.
- Respect `prefers-reduced-motion` — every animation (hero glow, page transitions, entrance, count-up) has a reduced-motion fallback.

**Don't:**
- Don't put white/light text directly on a gold or gradient background — use `#1A1206` (near-black) instead.
- Don't reintroduce the old indigo (`#5B4CF5`) — it was fully retired with the Nocturne redesign.
- Don't use red for anything that isn't an error or failed state.
- Don't hard-code light-theme-only backgrounds (e.g. `#fef3c7`, `#dcfce7`) in new components — use the `--*-dim` status tokens so dark mode doesn't break.
