# TUNERAIDERZ — Project overview

> Living reference for product, architecture, UX, deployment, and history.  
> Last updated: **2026-05-30**
>
> **Live:** https://www.tuneraiderz.com · **Repo:** https://github.com/cipshadow/tuneraider · **Creator:** cipshadow

---

## 1. What it is

TUNERAIDERZ is a **dexterity-based music quiz game**. Bad Bunny songs are re-synthesised into 8-bit (Game Boy–style) audio in the browser; the player identifies the song by ear and taps its title from a panel of buttons that orbit the screen. Points scale with speed. A global leaderboard ranks players.

The aesthetic is a deliberate Game Boy homage: 4-shade green palette, `Press Start 2P` pixel font, scanline overlay, blinking arcade prompts.

**Origin:** forked from **[b1rdmania/motif](https://github.com/b1rdmania/motif)** — the "WARIO SYNTH" engine. That project provides the 8-bit synthesis core (`src-v2/`); TUNERAIDERZ is the quiz game layered on top. b1rdmania is credited in `credits.html` and `MIDI_CREDITS.md`.

---

## 2. Game mechanics

### Core loop
1. Home screen → **PLAY GAME** → How to Play modal → enter username.
2. **10 rounds** (one per song; round 1 is always DtMF, rest shuffled).
3. Each round: 8-bit song plays, six answer buttons orbit the screen, player taps the correct title.
4. Per-round result screen → **NEXT** → … → game over → score auto-submitted → rank modal → leaderboard.

### Scoring
- **Starting score:** 10,000 points
- **Correct:** `+max(0, round(1000 × (1 − elapsed/60)))` — up to +1000 at ~1s, decays to 0 at 60s
- **Wrong pick:** `round(-(1000 + (elapsed/60) × 1000))` — −1000 at 0s to −2000 at 60s
- **Timeout:** +0
- Negative final scores are valid and stored on the leaderboard.

### Features
- Arcade answer panel (6 orbiting buttons; `fireCorrect("WEPA")` / `fireWrong("NOOO")` burst effects)
- Speed-based scoring with live countdown and 60s timer bar
- Volume control (top-left of game bar, default 90%)
- **Listen mode** — browse/preview all songs (unlocked after playing one game)
- **Beat-reactive disco grid** on result screen (WebAudio AnalyserNode → frequency bands → cells)
- Songs loop on result screen until NEXT is hit
- Coin/error SFX on correct/wrong answers (synthesised, no audio assets)
- Global leaderboard — auto-submitted at game over, rank shown immediately
- Hidden backdoor: click the last **"S"** in "TOP SCORES" to open Listen Mode without playing

### Result states
- **CORRECT! (✓)** — coin sound, green icon
- **WRONG! (✗)** — error buzz, red icon
- **TIME'S UP! (TIME!)** — error buzz, red icon (timeout only)

---

## 3. Song library

10 Bad Bunny tracks in `public/midi/` + `src-v2/data/songs.ts`:

| Title | Avg MIDI vel | Gain |
|-------|-------------|------|
| DtMF | 35 | 1.40 |
| Tití Me Preguntó | 50 | 1.00 |
| Callaíta | 24 | 2.00 |
| Mónaco | 20 | 2.10 |
| Amorfoda | 21 | 2.10 |
| Mía | 36 | 1.35 |
| Moscow Mule | 50 | 1.00 |
| Baile Inolvidable | 33 | 1.48 |
| Efecto | 50 | 1.00 (reference) |
| Dákiti | 50 | 1.00 |

Gains normalised to Efecto's perceived loudness. Add a song → round count increases automatically.

---

## 4. Architecture

### Stack

| Layer | Tech |
|-------|------|
| Frontend | Vite + TypeScript, single `index.html` |
| Synthesis | `src-v2/core/GameBoyPlayer.ts` — 8-ch APU (pulse/wave/noise) |
| UI kit | `src-v2/tuneraider.js` + `src-v2/styles/tuneraider.css` |
| Analytics | PostHog EU (posthog-js, build-injected key) |
| SFX | WebAudio synthesis in `src-v2/audio/sfx.ts` |
| Backend | Express (`server/src/server.ts`) |
| Leaderboard | Upstash Redis via direct REST fetch |
| Build | Vite, outputs to `dist/` |
| Hosting | Vercel (`cipblujdea95-gmailcoms-projects` team) |

### Key files

```
index.html                         Game — all screens + inline JS
src-v2/
  core/GameBoyPlayer.ts            APU synthesis engine
  audio/apu/APU.ts                 WebAudio APU; getAnalyserNode() for visualisers
  audio/sfx.ts                     playCoin() / playError()
  analytics.ts                     PostHog init + track()
  data/songs.ts                    Song library
  data/songs-normalization.ts      Per-song volume gains
  tuneraider.js                    UI helpers (initDiscoGrid, initVUMeter, etc.)
  styles/tuneraider.css            Component CSS
server/src/server.ts               Express API (scores, share, MIDI search)
vite.config.ts                     Build config; PostHog key injection
public/midi/                       MIDI files
```

### Backend API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/scores` | GET | Top 10 leaderboard |
| `/api/scores` | POST | Submit score (auto-called at game over) |
| `/api/migrate-scores-add10k` | POST | One-time migration (already run) |

---

## 5. Infrastructure

### Deploy
```bash
cd /Users/cip/personal_vibes/tuneraider
vercel --prod --yes   # personal auth, .vercel/project.json present
```

### Environment variables
Set in Vercel project settings and local `.env` (gitignored):
- `UPSTASH_REST_URL` + `UPSTASH_REST_TOKEN` — Redis leaderboard
- `POSTHOG_ANALYTICS_API_KEY` + `POSTHOG_ANALYTICS_HOST` — analytics (in monorepo-root `.env`, injected at build time)
- `VERCEL_TOKEN` / `VERCEL_PROJECT_ID` / `VERCEL_ORG_ID` — managed by Stripe Projects (expires; rotate with `stripe projects rotate vercel-project`)

### Vercel project
- Team: `cipblujdea95-gmailcoms-projects`
- Project ID: `prj_q9Q4n0weErHFS8ePIrirtaVV239Y`
- Domains: `tuneraiderz.com`, `www.tuneraiderz.com`, `tuneraider.vercel.app`
- DNS (Namecheap): A `@` → `216.198.79.1`, CNAME `www` → `cname.vercel-dns.com`

### Stripe Projects (personal_vibes)
- PostHog analytics (EU, free)
- Upstash Redis (usage-based)
- Vercel project link (token expires ~every few days — rotate as above)

---

## 6. Design system

```css
--bg-dark: #0f380f          /* deep green background */
--bg-panel: #306230         /* medium green panels */
--gb-green: #9bbc0f         /* bright green, primary text */
--gb-light-green: #8bac0f   /* dim green, labels */
--gb-cream: #e0f8d0         /* off-white, highlights */
```

- Font: `Press Start 2P` (self-hosted WOFF2 + Google Fonts fallback)
- Scanlines: `repeating-linear-gradient(transparent 0, transparent 2px, rgba(0,0,0,.08) 2px, rgba(0,0,0,.08) 4px)`
- No emoji in UI — text labels or unicode only
- All branding: **TUNERAIDERZ** (with Z)

---

## 7. Known issues / TODOs

- PostHog duplicate resources: `posthog-analytics-2`, `posthog-plan`, `posthog-plan-2` — free-tier, harmless, can be cleaned up
- Dákiti MIDI is minimal (55 notes, ~15s) — loops correctly but sounds sparse
- TS errors in `server/src/server.ts:195-196` (`catch (e)` unknown type) — non-blocking, deploy succeeds
- Mobile button sizing could be tweaked for thumb comfort
