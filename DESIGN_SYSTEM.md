# TUNERAIDER Design System

**Version**: 1.0  
**Last Updated**: 2026-05-28  
**Platform**: Web (desktop + mobile)  
**Aesthetic**: Game Boy retro (1989-2008)

---

## 1. Color Palette

### Primary Game Boy Greens
| Name | Hex | CSS Var | Usage |
|------|-----|---------|-------|
| Bright Green | `#9bbc0f` | `--gb-green` | Primary text, highlight, active buttons |
| Dim Green | `#8bac0f` | `--gb-light-green` | Secondary labels, hints |
| Medium Green | `#306230` | `--bg-panel` | Button panels, cards, containers |
| Deep Green | `#0f380f` | `--bg-dark` | Page background, deep shadows |
| Off-White Cream | `#e0f8d0` | `--gb-cream` | Light text on dark, success state |

### Accent Colors
| Name | Hex | Usage |
|------|-----|-------|
| Correct Answer | `#9bbc0f` | Correct button flash, score gained |
| Wrong Answer | `#ff4444` | Wrong button flash, error borders |
| Neutral Gray | `#666666` | Disabled text, hints |

### Full CSS Variables Block
```css
:root {
  --bg-dark: #0f380f;           /* Page bg, body */
  --bg-panel: #306230;          /* Buttons, panels, cards */
  --gb-green: #9bbc0f;          /* Primary text, highlights */
  --gb-light-green: #8bac0f;    /* Secondary labels */
  --gb-cream: #e0f8d0;          /* Light text, success */
  --text-disabled: #666666;     /* Disabled text */
  --correct: #9bbc0f;           /* Right answer feedback */
  --wrong: #ff4444;             /* Wrong answer feedback */
  --scanline-opacity: 0.08;     /* Overlay intensity */
}
```

---

## 2. Typography

### Font Family
- **Primary**: `'Press Start 2P'` (Google Fonts — pixel bitmap style)
- **Fallback**: `'Courier New', monospace`
- **Weight**: 400 (monospace font; no bold/italic variants)

### Type Scale
| Usage | Size | Line Height | Letter Spacing | Weight |
|-------|------|-------------|-----------------|--------|
| Page Title | 32px | 1.2 | 2px | 400 |
| Screen Heading | 24px | 1.2 | 1px | 400 |
| Button Label | 16px | 1.4 | 1px | 400 |
| Body Text | 14px | 1.5 | 0.5px | 400 |
| Small Label | 12px | 1.4 | 0px | 400 |
| Tiny Hint | 10px | 1.3 | 0px | 400 |

### Text Colors
- **Primary Text**: `var(--gb-green)` on `var(--bg-dark)`
- **Secondary Text**: `var(--gb-light-green)` on `var(--bg-dark)`
- **Disabled Text**: `var(--text-disabled)` with 0.5 opacity
- **Light Text**: `var(--gb-cream)` on dark backgrounds
- **Inverse** (rare): `var(--bg-dark)` on `var(--gb-green)` (active buttons)

---

## 3. Layout & Spacing

### Grid System
- **Screen width**: Full viewport (1024px+ desktop, full mobile)
- **Safe margin**: 16px from edges
- **Button grid**: 2 columns × 3 rows (arcade panel)
  - Button size: ~160px × 80px (min touch target 48px)
  - Gap between buttons: 12px
  - Total grid width: ~352px, height: ~264px

### Spacing Scale (8px base)
```
8px   - Minimal spacing (inline icons, tight groups)
12px  - Small spacing (button padding, minor separators)
16px  - Standard spacing (margins, gutters)
24px  - Medium spacing (section gaps)
32px  - Large spacing (major section breaks)
```

### Safe Areas (Mobile)
- Top: 16px + notch consideration (iOS)
- Bottom: 16px + home indicator (iOS)
- Left/Right: 16px minimum

---

## 4. Components

### Button (Arcade)
**States**: Default, Hover, Active, Disabled, Correct Flash, Wrong Flash

```css
.arcade-button {
  width: 160px;
  height: 80px;
  background: var(--bg-panel);
  border: 2px solid var(--gb-green);
  border-radius: 4px;
  color: var(--gb-green);
  font-family: 'Press Start 2P';
  font-size: 12px;
  cursor: pointer;
  transition: all 80ms ease;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arcade-button:hover {
  background: var(--gb-green);
  color: var(--bg-dark);
  box-shadow: inset 0 0 8px rgba(0,0,0,0.3);
}

.arcade-button:active {
  transform: scale(0.95);
  box-shadow: inset 0 0 12px rgba(0,0,0,0.5);
}

.arcade-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: var(--text-disabled);
  color: var(--text-disabled);
}

.arcade-button.correct {
  background: var(--correct);
  border-color: var(--correct);
  color: var(--bg-dark);
  animation: flash-correct 400ms ease-out;
}

.arcade-button.wrong {
  border-color: var(--wrong);
  animation: flash-wrong 400ms ease-out;
}
```

### Panel Card (Gallery / Leaderboard)
```css
.card {
  background: var(--bg-panel);
  border: 1px solid var(--gb-green);
  border-radius: 2px;
  padding: 16px;
  margin: 8px;
}

.card:nth-child(even) {
  background: rgba(155, 188, 15, 0.07);
}

.card-title {
  font-size: 16px;
  color: var(--gb-green);
  margin-bottom: 8px;
}

.card-subtitle {
  font-size: 12px;
  color: var(--gb-light-green);
}
```

### Volume Control (Top-Right)
```css
.volume-control {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 100;
  background: var(--bg-panel);
  border: 2px solid var(--gb-green);
  border-radius: 4px;
  padding: 12px;
  min-width: 200px;
}

.volume-slider {
  width: 100%;
  height: 8px;
  margin: 8px 0;
  accent-color: var(--gb-green);
}

.volume-button {
  width: 40px;
  height: 32px;
  margin: 0 4px;
  font-size: 14px;
}
```

### HUD (Heads-Up Display)
```css
.hud {
  position: fixed;
  top: 16px;
  left: 16px;
  font-size: 14px;
  color: var(--gb-green);
  z-index: 100;
}

.hud-item {
  margin-bottom: 8px;
}

.hud-label {
  color: var(--gb-light-green);
  font-size: 10px;
}

.hud-value {
  color: var(--gb-green);
  font-size: 16px;
  margin-top: 2px;
}
```

### Timer Bar
```css
.timer-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(155, 188, 15, 0.2);
  z-index: 99;
}

.timer-bar::after {
  content: '';
  display: block;
  height: 100%;
  background: var(--gb-green);
  width: 100%;
  transition: width 30s linear;
}

.timer-bar.active::after {
  width: 0%;
}
```

### Leaderboard Rank Badge
| Position | Emoji | Color | Variant |
|----------|-------|-------|---------|
| 1st | 🥇 | Gold highlight | Larger text |
| 2nd | 🥈 | Silver highlight | Standard |
| 3rd | 🥉 | Bronze highlight | Standard |
| 4-10 | #4, #5... | Normal green | Plain number |

### Now-Playing Visualizers

Three interchangeable "live sound" widgets, all CSS-driven (no audio needed). The marquee bulb chase (`.gb-bulbs`, `initMarquee()`) is the in-game now-playing strip; the two below are alternates defined in `src-v2/styles/tuneraider.css` and built from `src-v2/tuneraider.js`.

**Arcade VU Meter** (`.gb-vu`, `initVUMeter(el, { count })`)
Segmented columns whose green→amber→red fills rise on randomized speeds. LED gaps come from a `repeating-linear-gradient` overlay; the level animates via `clip-path` (`gb-vu-rise`). Mounted at the top of LISTEN MODE.
```html
<div class="gb-vu" id="my-vu"></div>
<script>initVUMeter(document.getElementById('my-vu'), { count: 14 });</script>
```

**Disco Grid** (`.gb-disco`, `initDiscoGrid(el, { rows, cols, colors })`)
A Game Boy disco floor — `rows × cols` cells flashing in random palette colors on staggered loops (`gb-disco-flash`). `--cols` controls the column count. Mounted at the top of the RESULT screen.
```html
<div class="gb-disco" id="my-disco"></div>
<script>initDiscoGrid(document.getElementById('my-disco'), { rows: 3, cols: 8 });</script>
```

### Mascot — Arc Hop Bunny

`.bunny-stage` + `.hop-arc` — an idle 🐰 that hops sideline-to-sideline on a stage with a dashed ground line. `bun-cross` walks it across; `bun-hop` gives the parabolic bounce with a slight rotate. Pure CSS, no JS. Mounted on the idle/menu (HOME) screen. Swap the `.bun` glyph for a sprite if one is added to `public/`.
```html
<div class="bunny-stage hop-arc">
  <div class="bunny-track"><span class="bun">🐰</span></div>
</div>
```

All three honor `prefers-reduced-motion: reduce` (animations freeze).

---

## 5. Animations

### Keyframes & Timings
| Animation | Duration | Easing | Trigger | Loop? |
|-----------|----------|--------|---------|-------|
| **blink** | 1000ms | - | INSERT COIN, ♪ indicator | ∞ |
| **swap1-6** | 200ms | ease-in-out | Round start | ✓ staggered |
| **flash-correct** | 400ms | ease-out | Correct answer | 1x |
| **flash-wrong** | 400ms | ease-out | Wrong answer | 1x |
| **timer-bar** | 30s | linear | Round active | 1x |
| **score-increment** | 500ms | ease-out | Score update | 1x |
| **fade-in** | 300ms | ease-out | Screen transition | 1x |

### Button Swap Animation Detail
```css
@keyframes swap1 { /* Top-left button */
  0% { transform: translateX(0) translateY(0); }
  100% { transform: translateX(156px) translateY(120px); }
}

@keyframes swap2 { /* Top-center button */
  0% { transform: translateX(0) translateY(0); }
  100% { transform: translateX(-156px) translateY(120px); }
}

/* ... swap3-6 follow similar pattern with different translate values */

.arcade-button {
  animation: var(--swap-anim) 200ms ease-in-out infinite;
  animation-delay: var(--swap-delay);
}

/* Button 1: swap1, 0s delay */
/* Button 2: swap2, 0.05s delay */
/* Button 3: swap3, 0.10s delay */
/* Button 4: swap4, 0.15s delay */
/* Button 5: swap5, 0.20s delay */
/* Button 6: swap6, 0.25s delay */
```

### Blinking Text
```css
@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

.blink {
  animation: blink 1000ms infinite;
}
```

---

## 6. Visual Effects

### Scanlines Overlay
Apply globally to create CRT scan effect:
```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 2px,
    rgba(0, 0, 0, var(--scanline-opacity)) 2px,
    rgba(0, 0, 0, var(--scanline-opacity)) 4px
  );
  pointer-events: none;
  z-index: 9999;
}
```

### Screen Transition
- Hard cut `display: none` / `display: block` (no fade)
- OR brief 300ms fade-in if desired (optional refinement)

### Box Shadow Patterns
- **Raised button**: `0 2px 4px rgba(0,0,0,0.3)`
- **Pressed button**: `inset 0 0 12px rgba(0,0,0,0.5)`
- **Card shadow**: `0 1px 3px rgba(0,0,0,0.2)`
- **Glow effect** (on focus): `0 0 8px rgba(155, 188, 15, 0.3)`

---

## 7. Responsive Design

### Breakpoints
| Screen | Width | Changes |
|--------|-------|---------|
| **Mobile** | < 480px | Single-column layout, buttons 100% width, smaller font (14px → 12px) |
| **Tablet** | 480px – 1024px | 2-column for cards, button grid scales (140px × 70px) |
| **Desktop** | > 1024px | Full design, 160px × 80px buttons, centered layout |

### Mobile Optimizations
- Button height ≥ 48px touch target (increase if needed)
- Tap delay: none (remove on touch devices)
- Margin inside safe area (notch + home indicator)
- Portrait-first (no landscape requirement)
- Font size ≥ 16px to prevent zoom on iOS

---

## 8. Screens & Layouts

### HOME Screen
```
┌─────────────────────────────┐
│         TUNERAIDER          │  32px title
│                             │
│     🎮 INSERT COIN 🎮      │  14px, blinking
│                             │
│     ╔════════════════╗      │  Button 160×80
│     ║  PLAY GAME     ║      │
│     ╚════════════════╝      │
│     ╔════════════════╗      │
│     ║  LISTEN MODE   ║      │
│     ╚════════════════╝      │
│                             │
│    📊 TOP 3 SCORES         │  14px label
│    🥇 cipshadow  8,540     │  12px rows
│    🥈 friend1    7,200     │
│    🥉 friend2    5,890     │
│                             │
└─────────────────────────────┘
```

### GAME Screen
```
Round 1 / 9        Score: 2,450    (HUD top-left + top-right volume)

[========░░░░░░░░░░░░░░░░░] ♪  (Timer bar + blinking note)

    🎵 Now Playing 🎵

    ╔════════╗  ╔════════╗
    ║  Song1 ║  ║  Song2 ║  (Buttons swap positions)
    ╚════════╝  ╚════════╝

    ╔════════╗  ╔════════╗
    ║  Song3 ║  ║  Song4 ║
    ╚════════╝  ╚════════╝

    ╔════════╗  ╔════════╗
    ║  Song5 ║  ║  Song6 ║
    ╚════════╝  ╚════════╝
```

### RESULT Screen
```
    ✓ CORRECT!

    You earned:   +425 PTS

    Running total: 2,875 PTS

    ╔════════════════╗
    ║  CONTINUE      ║
    ╚════════════════╝

    ╔════════════════╗
    ║  KEEP LISTENING║
    ╚════════════════╝
```

### LEADERBOARD Screen
```
       🏆 LEADERBOARD 🏆

    🥇 1  cipshadow      8,540
    🥈 2  friend1        7,200
    🥉 3  friend2        5,890
    4  friend3        4,120
    5  friend4        3,980
    ...
    10 friend9        1,250

    ╔════════════════╗
    ║  PLAY AGAIN    ║
    ╚════════════════╝
```

---

## 9. Interactive States

### Button States
- **Default**: Border `var(--gb-green)` 2px, BG `var(--bg-panel)`, text green
- **Hover**: BG green, text dark, inset shadow
- **Active**: Scale 0.95, inset shadow darker
- **Disabled**: Opacity 0.5, cursor not-allowed
- **Correct Flash**: BG green 400ms, fade to normal
- **Wrong Flash**: Border red 400ms, fade to normal

### Leaderboard Rows
- Alternating background: even rows slightly lighter green tint
- Hover: highlight entire row with subtle BG change
- Tap target: full row height ≥ 48px

### Volume Slider
- Native `<input type="range">` with `accent-color: var(--gb-green)`
- Labels: 0%, 50%, 100%
- ± buttons: 40px × 32px arcade buttons

---

## 10. Icon System

### Emoji Icons (Game Boy Era Compatible)
| Icon | Usage | Size |
|------|-------|------|
| 🎮 | Game controller (INSERT COIN) | Inline with text |
| 🎵 | Music playing indicator | 16px, blinking |
| 🏆 | Leaderboard title | 24px |
| 🥇🥈🥉 | Rank badges | 14px |
| ✓ | Correct answer | 24px |
| ✗ | Wrong answer | 24px |
| 🔊 | Volume icon | 16px |

---

## 11. Accessibility

### Color Contrast
- All text ≥ 4.5:1 contrast ratio (WCAG AA)
- Green on dark green: 6.2:1 ✓
- Test with: https://www.tpgi.com/color-contrast-checker/

### Keyboard Navigation
- Tab order: buttons in visual order, left-to-right, top-to-bottom
- Enter/Space: trigger buttons
- Volume slider: Arrow keys to adjust ±5%

### Screen Readers
- Alt text on all images
- Button labels clear and descriptive
- ARIA labels for dynamic score updates
- Avoid color-only feedback (use icons + text)

### Mobile Touch
- Min button height: 48px
- Min tap spacing: 8px
- Avoid hover states on touch (use active)

---

## 12. Brand & Tone

### Visual Personality
- **Era**: Game Boy Color (2001) – warm retro nostalgia
- **Vibe**: Arcade game meets handheld nostalgia – playful, competitive, inviting
- **Energy**: Confident pixel art meets smooth animations – predictable arcade controls with fluid motion

### Typography Personality
- Press Start 2P conveys retro gaming and fun
- Small sizes (~12px) feel authentic to Game Boy Pocket
- All caps encouraged for titles, mixed case for body (readability)

### Motion Personality
- Swapping buttons feel **unpredictable but fair** – arcade challenge
- Score increment is **rewarding** – smooth animation with easing
- Screen transitions are **instant** (cartridge swap) – no fade blur

---

## 13. Refinement Ideas (Next Iteration)

- [ ] Difficulty selector (button count: 4/6/9)
- [ ] Snippet length variation (10s/20s/30s)
- [ ] Particle effects on correct answer
- [ ] Custom leaderboard filters (friend groups, daily challenges)
- [ ] Sound effects (beep on button press, chime on correct)
- [ ] Dark/light mode toggle (optional — green might adapt)
- [ ] Multiplayer real-time leaderboard updates
- [ ] Mobile app wrapper (PWA)

---

## Export / Implementation Notes

**For Claude Design**: Import this document and create:
1. **Color palette component** — 5 swatches with CSS vars
2. **Button state matrix** — 6 variations (default, hover, active, disabled, correct, wrong)
3. **Layout mockups** — HOME, GAME, RESULT, LEADERBOARD screens
4. **Animation specs** — Figma prototypes for button swap & timer bar
5. **Typography scale** — Type specimen showing all sizes

**For Claude Code**: Reference section numbers (e.g., "Button states per §9") when implementing CSS, and use `DESIGN_SYSTEM.md` as the source of truth for pixel sizes, colors, and animations.

---

**Next Step**: Take this to Claude Design, create high-fidelity mockups, then return with visual refinements to implement in Claude Code.
