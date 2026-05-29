# Handoff: TUNERAIDER Design System

## Overview
**TUNERAIDER** is a retro 8-bit chiptune quiz game (Bad Bunny edition): the player hears a
song rendered in a handheld-console style and picks the title against a timer. This bundle is
the **visual design system** — color, type, spacing, components, motion, and the celebration
FX — extracted into reusable CSS + JS so it can be dropped into the real game codebase.

## About the Design Files
The files here are **design references created in HTML/CSS/JS** — they show the intended look
and behavior, not a finished product to ship verbatim. The task is to **recreate this design
system inside the game's existing codebase** using its established patterns (React components,
CSS modules, Tailwind, web components, a canvas/WebGL renderer, etc.). If the game has no UI
layer yet, pick the most appropriate stack and implement there.

That said, `tuneraider.css` and `tuneraider.js` are written framework-agnostically and **can be
imported directly** if the project is plain HTML/JS — they have no dependencies.

## Fidelity
**High-fidelity.** Exact colors, type scale, spacing, borders, and animation timings are final
and listed below. Recreate pixel-perfectly. Two color themes are provided (classic green +
warm) — both are production-ready; pick one or support the toggle.

---

## Design Tokens

All tokens are CSS custom properties on `:root` (classic green) with a `[data-theme="warm"]`
override block. Switch themes by setting `document.body.dataset.theme = 'warm'` (or removing it
for green).

### Colors — Classic Green (default)
| Token | Hex | Use |
|---|---|---|
| `--bg-dark` | `#0f380f` | Page background, deepest shadow |
| `--bg-panel` | `#306230` | Panels, cards, chrome |
| `--gb-light-green` | `#8bac0f` | Labels, borders (dim) |
| `--gb-green` | `#9bbc0f` | Primary text, highlights |
| `--gb-cream` | `#e0f8d0` | Values, success, focus (lightest) |

### Colors — Warm theme (`[data-theme="warm"]`)
| Token | Hex | Use |
|---|---|---|
| `--bg-dark` | `#2a1206` | Espresso — page background |
| `--bg-panel` | `#80360f` | Burnt sienna — panels |
| `--gb-light-green` | `#e08a2c` | Amber — labels, borders |
| `--gb-green` | `#f7b733` | Gold-orange — primary text |
| `--gb-cream` | `#ffeccb` | Warm cream — values, focus |

### Semantic
| Token | Green hex | Warm hex | Use |
|---|---|---|---|
| `--correct` | `#9bbc0f` | `#f7b733` | Right answer flash |
| `--wrong` | `#ff4444` | `#ff4d4d` | Wrong answer border / errors |
| `--wrong-bg` | `#3a0a0a` | `#4a0c0c` | Wrong answer fill |
| `--text-disabled` | `#666666` | `#9c8568` | Inert text, placeholders |
| `--title-shadow` | `#0a280a` | `#160702` | Hard pixel drop shadow on titles |

### Spacing — 8px base scale
`--sp-1: 8px` · `--sp-2: 12px` · `--sp-3: 16px` · `--sp-4: 24px` · `--sp-5: 32px`

### Borders (chunky, never rounded)
`--border-thin: 2px solid var(--gb-light-green)` · `--border-mid: 3px solid var(--gb-green)`
· `--border-thick: 4px solid var(--gb-light-green)`

### Typography
- **One face: `Press Start 2P`** (bitmap pixel font), single weight 400, no italics.
  Bundled at `reference/fonts/PressStart2P.woff2`; also on Google Fonts.
- Always uppercase for titles/labels; sentence case OK for body. Pixels need letter-spacing.

| Role | Size | Notes |
|---|---|---|
| Page title | 32px | letter-spacing 2px, `text-shadow: 4px 4px 0 var(--title-shadow)` |
| Heading | 18px | letter-spacing 1px |
| Button | 13px | letter-spacing 1px, uppercase |
| Body | 11px | line-height 1.5 |
| Label | 9px | dim (`--gb-light-green`) |
| Tiny / hint | 8px | dim |

> **Scale note for gameplay UI:** keep in-game text ≥ 10px at the native render scale; the
> font is dense. Hit targets ≥ 44px.

---

## Components

All classes live in `tuneraider.css`. Key ones:

- **`.gb-panel` / `.gb-panel-title`** — raised panel with 4px frame; title has a bottom rule.
- **`.gb-card`** — inset card, 2px frame on `--bg-dark`.
- **`.gb-btn`** — base button. Hover **inverts** (bright fill, dark text); `:active` nudges
  `translate(1px,1px)`; `:disabled` → 0.5 opacity. **`.gb-btn-primary`** is full-width, 4px frame.
- **`.gb-answer`** — quiz answer tile. States: default, **`.correct`** (bright fill, cream
  border), **`.wrong`** (dark-red fill, red border).
- **`.gb-hud` / .gb-hud-item / .gb-hud-label / .gb-hud-value`** — 2-up stat readout.
- **`.gb-timer-wrap` / .gb-timer-fill`** — countdown bar; animate `width` linearly to 0.
- **`.gb-input` / .gb-label`** — text field; focus changes border to `--gb-cream`.
- **`.gb-leaderboard`** — ranked `<ol>`; rows are `grid` `auto 1fr auto` (rank / name / score),
  alternating row tint, 🥇🥈🥉 for top 3.
- **`.gb-song-grid` / .gb-song-card / .gb-song-cover / .gb-song-title / .gb-song-artist`** —
  Listen-mode picker; card lifts `translateY(-2px)` on hover.

### Volume — staircase meter (NEW)
Replaces a plain range input with a pixel "EQ knob": 12 bars rising in a staircase.
```html
<div class="gb-vol">
  <button class="gb-btn" data-vol="down">−</button>
  <div class="gb-vol-meter"><i></i>… ×12 …<i></i></div>
  <button class="gb-btn" data-vol="up">+</button>
  <span class="gb-vol-val">70%</span>
</div>
```
Bars get `.on` (lit, `--gb-green`) up to the level; the topmost lit bar gets `.peak`
(`--gb-cream`). Wire with `initVolumeMeter(el, { value, onChange })` from `tuneraider.js`,
or replicate: click-to-set by X position, ± buttons step 10.

### Melody — "now playing" equalizer (NEW)
A simple, always-reads-as-sound visualizer. Nine bars bounce on staggered CSS loops — **no
audio analysis needed**. Use it wherever a track is playing.
```html
<div class="gb-eq"><i></i> … ×9 … <i></i></div>
```
- Odd bars are `--gb-cream`, even are `--gb-green`.
- Per-bar `animation-duration` (0.50–0.88s) and negative `animation-delay` are set in CSS so
  the bounce looks organic. Container height controls scale (default 46px; the in-game HUD uses
  38px).
- Add class **`.paused`** to freeze all bars at min height when audio stops.
- `.gb-note` is a clean pixel note glyph (`♫`/`♪`) with the title drop shadow, for accents.

### CORRECT / WRONG FX burst (the celebration)
Overlapping retro titles that pop in back-to-front and cascade **upward**, each ringed by a
dark outline (via layered `text-shadow`) so the tight stack stays legible, plus a quick screen
flash. Fully CSS-driven; spawned by JS.
- **`fireCorrect('WEPA')`** — joyful palette (gold→lime→cyan→pink→orange), white flash.
- **`fireWrong('NOOO')`** — danger palette (bright red→dark reds→charcoal), red flash.
- Both accept any string (song name, `COMBO ×3`, etc.). 6 layers, 15px rise + 7px drift per
  layer, 45ms back-to-front stagger, ~2s total, then the overlay auto-removes.
- Markup is generated; CSS classes: `.cb-burst` (fixed overlay, `z-index:10000`,
  `pointer-events:none`), `.cb-flash`, `.cb-word`. Tunable per-call via
  `fireBurst(text, { layers, stepX, stepY, palette, outline, flash })`.

---

## Interactions & Behavior

- **Screen transitions:** instant cuts (cartridge swap), never fades.
- **Buttons:** hover invert, active 1px down-right nudge.
- **Answer flow:** on submit, the chosen tile flips to `.correct` or `.wrong`; simultaneously
  call `fireCorrect()` / `fireWrong()`. Lock further input until the burst clears (~2s) or a
  "Next" tap.
- **Timer:** `.gb-timer-fill` width animates from 100%→0 over the round; score scales with time
  remaining (game logic: 1s ≈ 1000pts, 15s ≈ 500pts, 30s ≈ 0).
- **Now-playing:** show `.gb-eq` while a clip plays; add `.paused` when stopped.
- **Volume:** persists across sessions in the real game (localStorage). Meter is click-to-set
  and ±10 via buttons.
- **Looping mascot/idle motion** (in the reference, Motion section): a bunny hops sideline to
  sideline (`bun-cross` + a per-style hop). Four variants documented in the reference file:
  Arc Hop, Squash & Stretch, Moon Float, Speed Dash. Optional flavor.
- **Accessibility:** all looping motion (EQ, mascot, bursts) is gated behind
  `@media (prefers-reduced-motion: reduce)` — honor it.

## State Management
Minimal, game-driven (not in this bundle): current round index, score, time remaining,
selected answer, volume (0–100, persisted), theme (`green` | `warm`, persisted), audio
playing flag (drives `.gb-eq.paused`).

## Assets
- **Font:** `Press Start 2P` — `reference/fonts/PressStart2P.woff2` (also Google Fonts).
- **Icons/cover art:** emoji placeholders (🎮, 🥇) in the reference; swap for real pixel-art
  sprites/cover thumbnails in production.
- No proprietary/branded assets are included.

## Files
- **`tuneraider.css`** — all tokens + component classes + animations. The core deliverable.
- **`tuneraider.js`** — framework-agnostic helpers: `fireCorrect` / `fireWrong` / `fireBurst`,
  `initVolumeMeter`, `setMelodyPlaying`. ES module exports; trivially convertible to globals.
- **`reference/Tuneraider Design System.html`** — the living showcase. Open it to see every
  token, component, state, and animation rendered, plus the theme toggle. Best single source
  of truth for visuals.
- **`reference/fonts/PressStart2P.woff2`** — the bundled font.

### Quickest path (plain HTML/JS project)
```html
<link rel="stylesheet" href="tuneraider.css">
<script type="module">
  import { fireCorrect, fireWrong, initVolumeMeter } from './tuneraider.js';
  // on correct answer:  fireCorrect('WEPA');
  // on wrong answer:     fireWrong('NOOO');
</script>
```
Make sure the `@font-face` path in `tuneraider.css` (`fonts/PressStart2P.woff2`) resolves, or
swap it for the Google Fonts import.
