# TUNERAIDER — Project Overview

> Comprehensive reference: product, architecture, UX, deployment, history, and where to go next.
> Living document — update it as the project evolves. Last major update: **2026-05-30**.
>
> **Live:** https://tuneraider.vercel.app · **Repo:** https://github.com/cipshadow/tuneraider · **Creator:** cipshadow

---

## 1. What it is

TUNERAIDER is a **dexterity-based music quiz game**. Bad Bunny songs are re-synthesized into 8-bit (Game Boy–style) audio in the browser; the player identifies the song by ear and taps its title from a panel of buttons that drift around the screen. Points scale with speed. A global leaderboard ranks players.

The aesthetic is a deliberate Game Boy homage: 4-shade green palette, `Press Start 2P` pixel font, scanline overlay, blinking arcade prompts, and "cartridge-swap" instant screen cuts.

**Origin:** forked from **[b1rdmania/motif](https://github.com/b1rdmania/motif)** — the "WARIO SYNTH" engine. That project provides the 8-bit synthesis core and MIDI playback infrastructure (`src-v2/`); TUNERAIDER is the quiz game layered on top. b1rdmania is credited in `credits.html`, `MIDI_CREDITS.md`, and the README.

---

## 2. Product requirements

### Core loop
1. Player lands on the **home/menu** (which is now the game's front door).
2. Clicks **PLAY GAME** → reads **How to Play** → enters a **username**.
3. **10 rounds** (one per song; round count is derived from the song list — add a song, get an extra round). Round 1 is always **DtMF**; the rest are shuffled.
4. Each round: an 8-bit song plays, six answer buttons orbit the screen, player taps the title.
5. Per-round **result** screen → **NEXT** → … → **game over** → **submit score** → **rank** → **leaderboard**.

### Scoring (`selectAnswer` / `showResult` in `index.html`)
- **Correct:** `points = max(0, round(1000 * (1 - clamped/60)))` — up to 1000 at ~1s, decaying to 0 by 60s. *Faster = more.*
- **Wrong pick:** `points = round(-(1000 + (clamped/60)*1000))` — −1000 at 0s down to −2000 at 60s. *Dithering on a wrong guess costs more.*
- **Timeout** (song ends, no pick): 0 points.
- `clamped = min(max(0, elapsed), 60)` seconds.

> Note: in-app copy intentionally avoids quoting exact point numbers (and never uses the word "chiptune"). The earlier "1,111 points" penalty claim was wrong and was removed.

### Feature list
- Arcade answer panel (6 buttons, orbital drift; correct/wrong burst effects "WEPA"/"NOOO").
- Speed-based scoring + live points countdown + 60s timer bar.
- Volume control (top-left of game bar) with per-song normalization gain.
- **Listen mode** — browse/preview all songs anytime (unlocked after a game, or via the hidden backdoor).
- Global leaderboard (Redis / Vercel KV, with in-memory dev fallback).
- Result states: **CORRECT! (✓)**, **WRONG! (✗)**, **TIME'S UP! (TIME!)** — three distinct states.
- Rank reveal as an in-game modal with a hopping ASCII bunny (not a browser alert).
- Credits page.

### Easter eggs / hidden
- **Backdoor:** clicking the last **"S"** in the home "TOP SCORES" heading (`#backdoor-listen`) opens Listen Mode even before playing a game.

---

## 3. Architecture

### Stack
- **Frontend:** Vite + TypeScript. The game itself is a single self-contained `index.html` (vanilla JS + inline `<style>`), importing the synthesis engine and helpers as ES modules.
- **Synthesis engine (`src-v2/`):** `core/GameBoyPlayer.ts` drives an 8-channel APU (`audio/apu/` — pulse/wave/noise channels), MIDI mapping/arpeggiation (`audio/midi/`), and an arranger. Parses MIDI via `@tonejs/midi`, outputs through the Web Audio API.
- **Shared UI kit:** `src-v2/styles/tuneraider.css` (component CSS) + `src-v2/tuneraider.js` (builders: `initMarquee`, `initVUMeter`, `initDiscoGrid`, `initVolumeMeter`, `fireCorrect`, `fireWrong`, `setMelodyPlaying`).
- **Backend:** Express in `server/src/server.ts`. Leaderboard at `/api/scores` (GET list, POST submit). Names are trimmed/capped (20 chars) and HTML-escaped server-side before storage. Redis/Vercel KV with in-memory fallback when no `REDIS_URL`.
- **Data:** `src-v2/data/songs.ts` (the curated library) + `songs-normalization.ts` (per-title gain, default 1.0). MIDI files in `public/midi/`.

### Routing (`vercel.json`)
- `/api/*`, `/health`, `/s/*` → Express function.
- `/credits` → `credits.html`; `/game` + `/game.html` → resolve to the game (now `index.html`).
- Everything else → `index.html` (the game).
- Vite multi-page build inputs are declared in `vite.config.ts` (main/index, credits, plus legacy `v2*`, `embed`, `models`, `play`, `ux-test`).

### Key files
```
index.html                     # THE game (home + all screens + game JS)   ← primary
credits.html                   # Styled credits page
src-v2/core/GameBoyPlayer.ts   # 8-bit playback engine
src-v2/audio/apu/*             # 8-channel APU (pulse/wave/noise)
src-v2/data/songs.ts           # 10-song library (add a song here → +1 round)
src-v2/styles/tuneraider.css   # Design-system component CSS
src-v2/tuneraider.js           # Design-system component builders / effects
server/src/server.ts           # Express + leaderboard API
public/midi/*.mid              # Song MIDIs
vercel.json / vite.config.ts   # Routing + build config
DESIGN_SYSTEM.md               # Design tokens + component docs
public/design-reference/…html  # Original design showcase (source of truth for look)
```

### Local dev
```
npm run dev           # Vite on :3000  (serves index.html at /)
npm run dev:backend   # Express on :3001 (Vite proxies /api/* → :3001)
npm run build         # tsc && vite build → dist/
```
For headless visual checks this session used Playwright (cached browsers) driven against the system Chrome at `/Applications/Google Chrome.app/...` — handy for screenshotting screens and asserting DOM state. Answer buttons orbit, so use `{ force: true }` clicks or click via `evaluate`.

---

## 4. UX & design system

### Palette (Game Boy)
```
--bg-dark:        #0f380f   /* deep green background */
--bg-panel:       #306230   /* medium green panels */
--gb-green:       #9bbc0f   /* bright green — primary text */
--gb-light-green: #8bac0f   /* dim green — labels */
--gb-cream:       #e0f8d0   /* off-white highlight */
```
Font: **Press Start 2P**. Scanline overlay via fixed `body::before` repeating-linear-gradient. Screen changes are instant cuts (no fades). Sentence-case headings.

### Screens
HOME (menu, leaderboard preview, footer bunny ticker) → How-to-Play modal → Username modal → GAME (top bar: VOL + EXIT; round title; marquee; points/timer; orbiting answer panel) → RESULT (disco grid, ✓/✗/TIME, points, NEXT, EXIT chip) → GAME OVER (final score, "Playing as <name>", SUBMIT) → RANK modal (hopping bunny) → LEADERBOARD. Plus LISTEN MODE (VU meter + song-card grid) and CREDITS.

### Design-system components (in `tuneraider.css` + `tuneraider.js`, documented in `DESIGN_SYSTEM.md`)
- **Marquee chase** — `.gb-bulbs` / `initMarquee()` — in-game now-playing bulb runner.
- **Arcade VU meter** — `.gb-vu` / `initVUMeter(el,{count})` — green→amber→red segmented bars; mounted atop Listen Mode.
- **Disco grid** — `.gb-disco` / `initDiscoGrid(el,{rows,cols,colors})` — flashing palette floor; mounted small atop the Result screen.
- **Arc Hop mascot** — `.bunny-stage`/`.hop-arc` — idle 🐰 hopping on a stage (library/reference component). The app currently uses a slim **footer ticker** variant (namespaced `footer-bun-*`) on HOME because that's the look that was preferred.
- All components honor `prefers-reduced-motion: reduce`.

> Convention: new visual widgets go in the shared `tuneraider.css`/`.js` with an `init*` builder, get documented in `DESIGN_SYSTEM.md`, and are mounted from `index.html`. Avoid ad-hoc inline CSS for reusable widgets — it causes class/keyframe collisions (learned the hard way with the bunny).

### Design rules (house style)
- Game Boy aesthetic first; no emojis in functional UI (use text/unicode) — exceptions are deliberate mascot/icon glyphs (🐰 mascot, 🌴 song-card cover) chosen with the user.
- Buttons must stay large tap targets; orbital motion is part of the challenge but must not make them un-tappable (mobile: slower orbit + narrower cards).
- "chiptune" is banned from copy. Prefer "8-bit".

---

## 5. Deployment

**Path:** Stripe Projects CLI brokers the Vercel link; deploys go out with the Vercel CLI using a Stripe-vended token.

```
stripe login                              # interactive, live mode (user runs it)
stripe projects env --pull --yes          # writes VERCEL_TOKEN / ORG_ID / PROJECT_ID to .env
npm i -g vercel
export VERCEL_TOKEN=… VERCEL_ORG_ID=… VERCEL_PROJECT_ID=…   # from .env, never printed
vercel deploy --prod --yes                # aliases to tuneraider.vercel.app
```

**Gotchas learned:**
- The Stripe-vended `VERCEL_TOKEN` is short-lived and **expired mid-session**. Fix: `stripe projects rotate vercel-project` → `stripe projects env --pull --yes` → redeploy. (A plain re-link/`env --pull` was *not* enough; rotate was.)
- GitHub → Vercel auto-deploy is **not** wired up — pushing to `origin` does not deploy. Deploys are the explicit CLI path above. (Could be connected in the Vercel dashboard later.)
- `.env` holds the live token and is now gitignored — never commit it. Also never commit the Stripe/Cursor tooling artifacts (`.agents/`, `.cursor/`, `.projects/`, `AGENTS.md`, `.cursorignore`).
- Build runs `tsc && vite build`; two non-blocking TS errors in `server/src/server.ts:195-196` (`catch (e)` is `unknown`) log but don't fail the build.

---

## 6. History & evolution

- **Origin:** forked from `b1rdmania/motif` (WARIO SYNTH 8-bit engine). Early TUNERAIDER work built the quiz on top: 9-song library, arcade answer panel, volume control, Redis leaderboard, v2 synthesis integration, MIDI credits.
- **Reorg:** the standalone project folder was consolidated into `personal_vibes/` and later **renamed `motif-bad-bunny` → `tuneraider`**. (Stale dev servers pointing at old paths caused 404s — restart from the current dir.)
- **2026-05-30 (this session):** fixed the stuck-round crash; major result-screen UX; added Dákiti (10th song, 10 rounds); made `index.html` the home/game; scrubbed "chiptune"; built the styled credits page; mobile-friendly listen mode; backdoor; design-system VU meter / disco grid / mascot; first live Vercel production deploys. See `SESSION_LOG.md` for the blow-by-blow.

---

## 7. Known issues / tech debt

- `server/src/server.ts:195-196` — unguarded `catch (e)` (`e` is `unknown`); TS errors at build (non-blocking). Should narrow with `e instanceof Error`.
- Leaderboard does not persist without `REDIS_URL` (in-memory fallback resets on cold start). Set `REDIS_URL` in Vercel for durable scores.
- Dákiti MIDI is a minimal single-channel file (~55 notes, ~15s) — plays but is thinner than the multi-track songs; a richer MIDI would sound fuller.
- Two bunny implementations coexist: the canonical `.bunny-stage` (library/reference) and the mounted `footer-bun-*` ticker. Intentional, but keep them from colliding.
- `prefers-reduced-motion` is honored by the design-system components but not everywhere in `index.html` inline animations.

---

## 8. Where to go next (backlog ideas)

- **Persist the leaderboard:** provision Redis (`stripe projects add …` / Vercel KV) and set `REDIS_URL`.
- **Connect GitHub → Vercel** auto-deploy so pushes ship without the manual CLI dance.
- **Fix the server TS errors** and tighten the backend (input validation, rate-limit score POSTs).
- **Difficulty levels:** snippet length, button count (4/6/8), faster orbit.
- **More songs / genres;** richer MIDI for Dákiti.
- **Mobile polish:** thumb-comfort tuning of orbit distance vs card size; test on real devices.
- **Sound-on-result / SFX** for correct/wrong; optional mute.
- **Share results** (the legacy `play.html`/`/s/*` sharing infra exists — could revive a "share my rank" card).
- **Accessibility:** focus states, keyboard play, screen-reader labels for the game flow.

---

## 9. Pointers

- Day-to-day work log: **`SESSION_LOG.md`**
- Design tokens & component docs: **`DESIGN_SYSTEM.md`**
- Look/feel source of truth: **`public/design-reference/Tuneraider Design System.html`**
- Attribution: **`credits.html`** (live) and **`MIDI_CREDITS.md`**
- Operating instructions for assistants: **`CLAUDE.md`**
