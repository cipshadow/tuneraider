# TUNERAIDERZ — Claude working context

**Live:** https://www.tuneraiderz.com  
**Vercel project:** https://vercel.com/cipblujdea95-gmailcoms-projects/tuneraider  
**GitHub:** https://github.com/cipshadow/tuneraider  
**Creator:** cipshadow

---

## What it is

Bad Bunny songs re-synthesised as 8-bit Game Boy audio in the browser. Players identify the song from an orbiting arcade button panel. Points scale with speed. Global leaderboard.

---

## How to deploy

```bash
cd /Users/cip/personal_vibes/tuneraider
vercel --prod --yes   # uses personal auth + .vercel/project.json
```

Do NOT use the Stripe-vended `VERCEL_TOKEN` — it expires frequently. Personal `vercel` auth is stable.

---

## Dev setup

```bash
npm install
npm run dev              # Vite frontend on :3000
npm run dev:backend      # Express backend on :3001 (in server/)
```

Frontend proxies `/api/*` → `localhost:3001` via Vite.

---

## Key files

| File | Purpose |
|------|---------|
| `index.html` | Entire game — all screens, game logic, inline JS |
| `src-v2/core/GameBoyPlayer.ts` | 8-channel APU synthesis engine |
| `src-v2/audio/apu/APU.ts` | WebAudio APU; exposes `getAnalyserNode()` for visualisers |
| `src-v2/data/songs.ts` | Song library (title, midiUrl, artist) |
| `src-v2/data/songs-normalization.ts` | Per-song volume gains (formula: `min(35/avgVel, 1.5) * ~1.4`) |
| `src-v2/tuneraider.js` | UI helpers: `initDiscoGrid`, `initVUMeter`, `fireCorrect`, `fireWrong` |
| `src-v2/analytics.ts` | PostHog wrapper (`initAnalytics`, `track`) |
| `src-v2/audio/sfx.ts` | Game SFX: `playCoin()` correct, `playError()` wrong/timeout |
| `server/src/server.ts` | Express: `/api/scores` leaderboard, `/api/migrate-scores-add10k` |
| `vite.config.ts` | Injects `__POSTHOG_KEY__`/`__POSTHOG_HOST__` from root `.env` |

---

## Scoring

- **Starting score:** 10000
- **Correct:** `+max(0, round(1000 * (1 - elapsed/60)))` — up to +1000 at 1s
- **Wrong:** `round(-(1000 + (elapsed/60)*1000))` — −1000 to −2000
- **Timeout:** +0
- Negative final scores are allowed and stored.

---

## Storage (Upstash Redis)

Credentials: `UPSTASH_REST_URL` + `UPSTASH_REST_TOKEN` — set in Vercel env and local `.env`.  
Server uses direct REST fetch (no SDK) via `upstash(command[])` helper in `server.ts`.  
Leaderboard key: `leaderboard` (Redis sorted set, score = points, member = `name|||timestamp`).

---

## Analytics (PostHog EU)

**Live dashboard:** https://eu.posthog.com/project/190111/dashboard/715506 (id 715506, "TUNERAIDERZ — Live"): players/day, total players, game funnel, started-vs-completed, engagement bar. All tiles use `filterTestAccounts:true` so they show real players only.

**Project:** https://eu.posthog.com/project/190111 — project **190111** (token `phc_yWEsuKMv…`), org `digitalshelf` (lowercase, `019d9cd4-b16b-…`). This is the live project the deployed site sends to. Ignore the duplicate empty projects (162233 in org `Digitalshelf`, 161373) — provisioning cruft.

Key: `POSTHOG_ANALYTICS_API_KEY` (= `phc_yWEsuKMv…`) in monorepo-root `.env`, build-injected as `__POSTHOG_KEY__`.  
Ingestion host: `https://eu.i.posthog.com` (the `.i.` host, NOT the dashboard host `eu.posthog.com`).

**Prod build needs the key from Vercel, not the root `.env`** (Vercel builds server-side and can't see the git-ignored root `.env`). Set in Vercel env: `VITE_POSTHOG_KEY` = `phc_yWEsuKMv…`, `VITE_POSTHOG_HOST` = `https://eu.i.posthog.com`. `vite.config.ts` checks `VITE_POSTHOG_KEY` (localEnv) first. Without these, prod ships an empty key and captures nothing.

To pull stats via API: personal key `POSTHOG_ANALYTICS_PERSONAL_API_KEY` (scoped to project 190111 only — list/org endpoints 403, project-scoped endpoints work). Query: `POST https://eu.posthog.com/api/projects/190111/query/` with a `HogQLQuery`.

Events: `first_visit`, `game_started`, `game_completed`, `game_abandoned`, `game_restarted`, `answer_submitted`, `song_previewed`, `song_listened`, `listen_mode_opened`, `score_submitted`, `leaderboard_viewed`.

---

## Audio

- APU master volume: `1.0` (in `GameBoyPlayer.ts` default config)
- UI default: `90%`
- Per-song gains in `songs-normalization.ts` — normalised to Efecto as reference (avgVel 50)
- Songs loop on result screen via `startResultLoop()` (polls `player.isPlaying()` every 1s)
- Beat-reactive disco grid on result screen via `APU.getAnalyserNode()`

---

## Design rules

- Game Boy palette: `--bg-dark: #0f380f`, `--gb-green: #9bbc0f`, `--gb-cream: #e0f8d0`
- Font: `Press Start 2P`
- No emoji in UI — use text labels or unicode
- Sentence case headings
- All branding: **TUNERAIDERZ** (with Z)

---

## Infrastructure gotchas

- Stripe Projects Vercel token expires ~every few days. Rotate: `stripe projects rotate vercel-project --non-interactive --yes && stripe projects env --pull --yes`
- `vercel link` must be run from inside `tuneraider/`, not from `~`
- `.vercel/project.json` = `{"projectId":"prj_q9Q4n0weErHFS8ePIrirtaVV239Y","orgId":"team_t3kcuVhaKBVV6ZMLqpOr1ntL","projectName":"tuneraider"}`
- PostHog duplicate resources exist (`posthog-analytics-2`, `posthog-plan`, `posthog-plan-2`) — harmless free-tier duplicates, don't force-remove
