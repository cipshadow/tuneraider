# TUNERAIDER Session Log

## 2026-05-30 — Home swap, design-system components, first Vercel deploys

Big session. Highlights (all committed; live at https://tuneraider.vercel.app):

- **Fixed the stuck-round bug** (root cause: `startRound` wrote `.textContent` to HUD elements removed in a prior commit → null deref before the try/catch). Verified via headless Chrome (Playwright + system Chrome).
- **Result-screen UX:** EXIT → small top-right chip; NEXT centered; fixed `+-1020` sign; dropped the post-game name re-prompt (reuse `state.playerName`); replaced the browser `alert()` rank popup with an in-game modal + hopping ASCII bunny (kept on the rank page per preference).
- **Distinct result states:** wrong PICK now shows ✗ / WRONG! (was incorrectly showing TIME! / TIME'S UP!, which is now timeout-only).
- **10th song** added (Dákiti); round count derives from the song list, so it's now 10 rounds.
- **Home is now the game:** `index.html` IS the game (retired `game.html`; `/game` + `/game.html` still resolve). Removed all "chiptune" wording (UI + docs).
- **Credits:** new styled `credits.html` crediting `b1rdmania/motif` (WARIO SYNTH engine); footer link; "8-bit" not "Game Boy" wording.
- **Listen mode:** mobile-friendly (capped 600px, 3 cols → 2 on phones); ARCADE VU METER at top; song cards use 🌴; hidden backdoor (click last "S" in TOP SCORES) opens listen mode without playing.
- **Design-system components** added to `tuneraider.css`/`tuneraider.js` + documented in `DESIGN_SYSTEM.md`: `.gb-vu` (`initVUMeter`), `.bunny-stage`/`.hop-arc`, and a new `.gb-disco` (`initDiscoGrid`, mounted small atop the result screen). Footer bunny ticker kept (namespaced `footer-bun-*`).
- **Mobile answer cards:** re-enabled orbital motion (slower, ~13–16s) and capped width to 135px to cut overlap.
- **Deployment stood up** via Stripe Projects CLI → Vercel (`stripe login` → `env --pull` → `vercel deploy --prod`). Gotcha: the Stripe-vended `VERCEL_TOKEN` expired mid-session; fix = `stripe projects rotate vercel-project` → `env --pull --yes` → redeploy.
- Added `.env` to `.gitignore` (held the live token, was untracked).
- `/security-review` (sub-agent): clean. `/code-review` (medium): only a double-submit risk (fixed with an `isSubmitting` guard) + cosmetic notes.
- **Known issue:** Vercel build logs two non-blocking TS errors in `server/src/server.ts:195-196` (`catch (e)` unknown). Deploy still succeeds.

See `PROJECT_OVERVIEW.md` for the comprehensive product/architecture/UX reference.

## Date: 2026-05-29

## 2026-05-29 (late) — Result-screen UX + 10th song

- **Result screen:** EXIT moved to a small chip anchored top-right of the panel; NEXT is now a single centered button (was a 50/50 row).
- **Score sign bug:** removed the hardcoded `+` before round points so negatives no longer render as `+-1020`; sign is now derived in `showResult` (`(points>=0?'+':'')+points`).
- **No double name prompt:** removed the post-game "YOUR NAME" input on the gameover screen; we now reuse the username collected upfront (`state.playerName`) and show "Playing as <name>". `submitScore` reads `state.playerName`.
- **Rank result modal:** replaced the browser `alert("Rank: …")` with an in-game Game Boy modal (`#rank-modal`) showing rank/total plus a hopping ASCII bunny (`.bunny-hop` keyframes). ASCII over emoji per global pref.
- **How to Play:** modal body text centered (`.modal-content p { text-align:center }`).
- **10th song:** added Dákiti — copied `~/Downloads/Dakiti - Bad Bunny.mid` → `public/midi/dakiti-bad-bunny.mid`, appended to `src-v2/data/songs.ts`. Round count is derived from the song list, so it's now 10 rounds automatically; updated the "9 rounds" copy → "10 rounds". NOTE: the Dakiti MIDI is a minimal single-channel file (55 notes, ~14.9s) — plays fine but simpler than the multi-track others.
- **Dir rename:** project folder renamed `motif-bad-bunny` → `tuneraider`; stale vite procs bound to old paths were killed and the dev server restarted from `/Users/cip/personal_vibes/tuneraider`.

All verified via headless Chrome (Playwright + system Chrome): 10-song library, Dákiti plays, result/gameover/rank screens render correctly, no page errors.

## Overview
Continued development of TUNERAIDER Bad Bunny chiptune quiz game. Focused on UI refinements, user flow improvements, and fixing critical display/visibility bugs.

## 2026-05-29 (later) — Fixed game stuck on round screen

**Symptom:** After entering username and starting, the game froze on the round panel — "CURRENT POINTS 1000" / "0s" static, no answer buttons, no audio.

**Root cause:** A prior commit removed the HUD (ROUND/SCORE display), deleting elements `round-num`, `round-total`, `game-score`. But `startRound()` still set `.textContent` on them (lines 1323/1325/1326), *before* the try/catch. The first `getElementById('round-num')` returned null → `Cannot set properties of null` threw synchronously, aborting `startRound` right after `showScreen('game')`. So the screen showed its static initial HTML and nothing else ran.

**Fix:** Removed the three dead lines, kept only `round-num-title` (the surviving element). `game.html` ~line 1323.

**Verified** via headless Chrome (Playwright + system Chrome): full flow → 6 answer buttons render, timer advances, points decrement, MIDI plays (4797 notes, 82.9s). Also restarted dev server on :3000 (stale vite procs were pointing at the old emptied `/Users/cip/motif-bad-bunny` path → 404s).

## Major Issues Fixed

### 1. Username Modal Visibility Bug
**Problem**: Username input modal was showing on home page overlaid on top of landing page buttons, blocking interaction.
**Root Cause**: Conflicting inline styles - modal had `style="display: none"` followed by `display: flex` in the same element.
**Solution**: 
- Replaced inline styles with CSS class-based approach using `.username-modal-overlay`
- Added `.username-modal-overlay { display: none; }` base rule
- Added `.username-modal-overlay.active { display: flex; }` for visibility control
- Updated JavaScript to use `classList.add('active')` and `classList.remove('active')`
- Result: Modal now only appears after clicking "INSERT COIN TO START" button

### 2. Game Screen Visibility Bug
**Problem**: Game screen (VOL controls, ROUND title, CURRENT POINTS display) was showing on home page, making it impossible to play.
**Root Cause**: `#screen-game` had hardcoded `display: flex;` that overrode the base `.screen { display: none; }` rule.
**Solution**:
- Moved `display: flex;` from `#screen-game` to `#screen-game.active` selector
- Added `!important` flags to all screen display rules for consistency
- Ensured proper CSS cascade and specificity

### 3. Duplicate CSS Rule Conflict
**Problem**: Game screen still not showing after visibility fix - both home and game screens visible simultaneously.
**Root Cause**: Duplicate `#screen-home.active` rules with conflicting display values:
  - Line 55: `#screen-home.active { display: grid !important; }` 
  - Line 117: `#screen-home.active { display: block !important; }`
- CSS cascade caused block rule (later in file) to override grid rule
**Solution**: Removed the duplicate rule at line 117

## Features Implemented

### 1. UI Title Refinements
- Changed game header from separate "TUNERAIDER" and "ROUND X" to unified "TUNERAIDER: ROUND 1"
- Added colon separator for visual clarity
- Removed subtitle "Bad Bunny * 8-Bit Music Quiz" from game mode

### 2. Username Input Flow
- Created new modal screen between "How to Play" instructions and game start
- Modal only appears after clicking "INSERT COIN TO START" button
- Changed title from "ENTER YOUR NAME" to "ENTER USERNAME"
- Implemented typing animation for input placeholder:
  - Cycles through example names: Vacilator, BenitoFan, Juan, Jesus, Greg999
  - Types letter-by-letter (80ms per character)
  - Pauses 2 seconds after each name
  - Erases and moves to next name (50ms per character)
  - Loops continuously while modal is visible

### 3. Visual Improvements
- Added "VOL" label next to volume slider for clarity
- Removed border and background from marquee display (`.gb-bulbs`)
- Repositioned marquee between title and main component panel
- Removed HUD panel (ROUND and SCORE display) from game mode
- Hidden TOP SCORES leaderboard preview from home page

### 4. LISTEN MODE Controls
- Removed disabled/greyed-out button state
- Button now always appears clickable
- When clicked before playing a game, red unlock warning appears positioned directly over the button
- Warning duration reduced from 3 seconds to 1.5 seconds

## Git Commits

1. `6baf0c5` - Add username prompt and UI refinements
2. `1572f4a` - Refine game UI: combine title/round, add VOL label, remove marquee border
3. `48d27d1` - Update game mode layout: add colon, hide HUD, reposition marquee
4. `df3ed20` - Fix username modal visibility (only show after PLAY GAME click)
5. `fe69c5e` - Hide leaderboard preview, add typing animation to username input
6. `c45fa16` - Fix game screen visibility (move display:flex to .active state)
7. `742c593` - Fix game screen visibility and unlock message duration (add !important flags)
8. `7c939c5` - Fix duplicate screen-home.active CSS rule

## Known Issues (Previous Session)
- Initial design system integration issues with marquee component location
- Missing `updateVolume()` function causing game to not start
- Layout spacing issues requiring optimization to fit on single screen

## Current Status
- Game flow: Home → Instructions → Username Input → Game Screen → Result Screen → Leaderboard
- Username animation working correctly with example names
- Screen visibility working with proper CSS cascade
- All UI refinements implemented as requested
- Unlock message displays for 1.5 seconds over LISTEN MODE button

## Files Modified
- `/Users/cip/motif-bad-bunny/game.html` - Main game file with all UI and JavaScript changes

## Next Steps (If Needed)
- Test full game flow from start to finish
- Verify all answer buttons appear in game mode
- Ensure music playback triggers correctly
- Test result and leaderboard screens

## 2026-05-30 — PostHog analytics + game SFX
- Provisioned PostHog via Stripe Projects (free tier, EU region) into the `personal_vibes` project. Env vars pulled to root-managed `.env`: `POSTHOG_ANALYTICS_PROJECT_API_KEY`, `POSTHOG_ANALYTICS_HOST`, `POSTHOG_ANALYTICS_PROJECT_ID`, `POSTHOG_ANALYTICS_PROJECT_NAME`.
- Added `src-v2/analytics.ts` (posthog-js init + `track()`), gated on build-injected key (no-op without it).
- Added `src-v2/audio/sfx.ts`: `playCoin()` (two-note chiptune coin) on correct answer, `playError()` (descending buzz) on wrong answer; WebAudio, no assets.
- Wired `handleAnswer` (sound + `answer_submitted`), `init` (`initAnalytics` + `game_started` + iOS sfx unlock), `renderGameOver` (`game_completed`/`game_restarted`).
- `vite.config.ts`: reads PostHog key/host from monorepo-root `.env` via `loadEnv`, injects as `__POSTHOG_KEY__`/`__POSTHOG_HOST__` defines (project API key is public/client-side).
- `npm i posthog-js`; `vite build` OK, `tsc --noEmit` 0 errors.
- Note: `stripe config.toml` printed live rk_live_/pk_live_ keys to terminal scrollback during setup — recommended clearing scrollback.

## 2026-05-30 — PostHog analytics + coin/error SFX
- Provisioned PostHog via Stripe Projects (free plan, EU). Key env var: `POSTHOG_ANALYTICS_API_KEY` (+ `_HOST`) in monorepo-root `.env`.
- `src-v2/audio/sfx.ts`: `playCoin()` (chiptune coin) on correct, `playError()` (descending buzz) on wrong/timeout. WebAudio, no assets.
- `src-v2/analytics.ts`: posthog-js init + `track()`, gated on build-injected `__POSTHOG_KEY__`.
- Wired into real game `index.html` (`selectAnswer` ~L1691): sounds next to `fireCorrect/fireWrong`; `initAnalytics()` at load; `track('answer_submitted', …)`.
- `vite.config.ts`: `loadEnv` from root `.env` → `__POSTHOG_KEY__`/`__POSTHOG_HOST__` defines (public client key). Preserved proxy + all 9 inputs.
- `vite build` OK — verified `phc_` key + host present in `dist`.
- TODO cleanup: duplicate resources from repeated adds — `posthog-analytics-2`, `posthog-plan`, `posthog-plan-2` (remove via `stripe projects remove <resource>`).
- Process note: large parallel/background batches caused interleaved-output confusion (a false "injection" scare + one bad vite.config overwrite, restored from git). No tampering. Keep batches small.

## 2026-05-30 — Full product session: analytics, UX, infrastructure, branding

### Analytics (PostHog EU, free tier)
- Provisioned via Stripe Projects. Key: `POSTHOG_ANALYTICS_API_KEY` in monorepo-root `.env`.
- `src-v2/analytics.ts`: posthog-js init + `track()`, gated on build-injected `__POSTHOG_KEY__`.
- `vite.config.ts` updated to `loadEnv` from root `.env` and inject `__POSTHOG_KEY__`/`__POSTHOG_HOST__` defines.
- Events tracked: `first_visit`, `game_started`, `game_completed`, `game_abandoned`, `game_restarted`, `answer_submitted`, `song_previewed`, `song_listened` (with duration), `listen_mode_opened`, `score_submitted`, `leaderboard_viewed`.

### Game SFX
- `src-v2/audio/sfx.ts`: `playCoin()` (B5→E6 chiptune coin) on correct, `playError()` (descending buzz) on wrong/timeout. WebAudio synthesised, no assets.

### Scoring changes
- Starting score changed from 0 → **10000** (makes going negative much less likely).
- Server score floor (`Math.max(0, ...)` + `score < 0` guard) removed — negative scores now allowed.
- Migration endpoint `POST /api/migrate-scores-add10k` added (one-time use).

### Song looping on result screen
- Songs now loop continuously on the result screen until NEXT is hit.
- Root cause: Dákiti is only ~15s — it went silent. Fix: `startResultLoop()` polls `player.isPlaying()` every second and replays `currentMidiBuffer` if stopped.

### Audio volume
- APU master volume: `0.7` → `1.0`.
- UI volume default: `70%` → `90%`.
- Per-song gains scaled up ~40% (relative normalisation preserved). Gains now stored with comment explaining the formula.

### Audio normalization
- All songs normalized to Efecto's perceived level (avgVel=50). Gains recalculated from MIDI velocity analysis.
- Moscow Mule was loudest (gain 1.25 despite avg vel 50) — corrected to 1.00.

### Beat-reactive disco grid
- `initDiscoGrid` in `tuneraider.js` now accepts optional `analyser: AnalyserNode`.
- `APU.ts` exposes `getAnalyserNode()` — lazy-creates an AnalyserNode tapped off masterGain.
- Result screen disco grid syncs to real audio: frequency bands → columns, beat transients → full flash.

### Listen mode cleanup
- Removed disco grid from listen mode (VU meter is enough).
- "ARCADE VU METER" → "ARCADE METER".
- Artist name ("Bad Bunny") removed from song cards — title only.
- Song cards now equal height per row (`align-items: stretch` + `height: 100%`).

### Copy / branding
- "INSERT COIN" → "VAMOS!" (blinking home banner) + "START GAME" (modal CTA).
- All UI renamed **TUNERAIDERZ** (was TUNERAIDER).
- Example username "Vacilator" → "DembowKing9".

### Auto-submit score
- Removed manual "SUBMIT SCORE" button.
- Score now auto-submitted at game over; status div shows "Saving score..." → "Rank #N of N".
- Rank modal pops automatically after save.

### Persistent leaderboard (Upstash Redis)
- Provisioned `upstash/redis` via Stripe Projects (usage-based, free tier threshold).
- Server updated: `@vercel/kv` replaced with direct Upstash REST fetch (`upstash()` helper) — removes SDK version incompatibility.
- `UPSTASH_REST_URL` / `UPSTASH_REST_TOKEN` added to Vercel env vars.
- Leaderboard now survives all deploys.
- Seeded 8 plausible scores (MamiWata 4820 … Jesus −620).

### Domain & deployment
- **tuneraiderz.com** purchased on Namecheap; DNS A record `216.198.79.1` + CNAME `www → cname.vercel-dns.com`.
- Project transferred to `cipblujdea95-gmailcoms-projects` Vercel team.
- `vercel link` run from `~` accidentally — `project.json` was at `~/.vercel/`; copied to `tuneraider/.vercel/`.
- Deploy now uses personal Vercel auth (`vercel --prod --yes`) rather than Stripe-vended token (which expires frequently).
- Live at: **https://www.tuneraiderz.com** and https://tuneraider.vercel.app.

### Infrastructure notes
- Stripe Projects Vercel token expires often — rotate with `stripe projects rotate vercel-project --non-interactive --yes` then `stripe projects env --pull --yes`.
- For future deploys: `cd tuneraider && vercel --prod --yes` (personal auth, `.vercel/project.json` present).

### 2026-05-31 — Mobile readability: How to Play modal + in-game text

**Goal:** Fix mobile usability feedback (user's dad struggled to read the How to Play modal and in-game song titles). Make text larger and more readable on phones.

**What we did:**
- **How to Play modal — restructured into numbered chapters.** Replaced the four `<p><strong>…</strong><br/>…</p>` blocks with a `.howto-step` layout: a numbered badge (`.howto-num`, inverted dark-on-green chip from the design system's `.sec-num` pattern) + `.howto-title` (bright green) + `.howto-text` (cream body). This gives a real three-level visual hierarchy instead of an inline color swap.
- **Left-aligned the body text** under each title. It was centered, which is a readability anti-pattern for multi-line pixel-font text. Centering persisted at first because `.modal-content p` (specificity 0,1,1) beat `.howto-text` (0,1,0); fixed by writing the rule as `.modal-content p.howto-text` (0,2,1) across base + both media queries.
- **Tightened modal to remove scroll:** body 0.68rem desktop / 0.72rem (640px) / 0.74rem (480px), line-height 1.65–1.7, reduced step gaps. Four chapters now fit without scrolling on a phone.
- **Enlarged in-game song-title text, then decoupled from button size.** First bumped answer-btn font (desktop 0.65→0.72rem, ≤640px 0.50→0.58rem, ≤480px 0.58→0.64rem) and widened buttons to 145px. User then asked to make the buttons *smaller* while keeping the larger text, so reverted footprint: ≤640px max-width 145→125px, padding 0.85rem/0.35rem, min-height 58px; ≤480px max-width 118px, padding 0.6rem/0.3rem, min-height 54px. Font sizes kept large. This shrinks the orbit footprint and removes the overlap risk.
- Removed an em-dash ("cost you—and" → "cost you, and") per writing-style rules.
- **Deployed to production** via `vercel --prod --yes` (personal auth). Live at https://www.tuneraiderz.com. Deployment ID `dpl_5UmYQWCSy426opjKg88u7YvZhYab`, readyState READY. Note: deploy shipped the built `dist/` which bundles the ~20 uncommitted carryover files too — production is ahead of the committed repo.

**Key decisions & trade-offs:**
- **Numbered-badge chapters over bold/color-only headers.** Earlier attempts (Haiku) just swapped header color; in the Press Start 2P pixel font, bold and same-size color swaps read as identical. The inverted numbered chip is the design system's own pattern for section markers and gives unmistakable separation. **Why:** strongest "chapter vs sentence" distinction the user asked for.
- **Cream body / green title, not the reverse.** Cream (#e0f8d0) has the highest contrast on the #306230 panel, so the long explanatory text (what the dad reads most) is maximally legible; the short title can afford the slightly lower-contrast green as an accent.
- **Smaller buttons + larger text (decoupled).** User wanted both: compact orbit footprint AND readable titles. Shrank max-width/padding while keeping the enlarged font. **Trade-off:** bigger text in a smaller box means longer titles wrap onto more lines; `min-height` + `word-wrap: break-word` absorb it, but a long title (e.g. "Moscow Mule") should be eyeballed on a real phone.

**Pending:**
- Verify on a real phone that long song titles wrap cleanly in the smaller buttons (≤480px max-width 118px). If a title looks cramped, drop font a hair or widen slightly — do NOT go back to 145px (caused orbit overlap).
- Repo does not match production: today's `index.html` plus ~20 carryover files from the 2026-05-30 session are uncommitted but live. User has not asked to commit. Offer again next session.

**Files involved:**
- `/Users/cip/personal_vibes/tuneraider/index.html` — only file changed this session (modal CSS + HTML, answer-btn sizing across 3 breakpoints)

**How to continue:** Changes are deployed and live at https://www.tuneraiderz.com (NOT committed to git — repo is behind production). The modal step styles live in the `.howto-*` CSS rules; answer-btn mobile overrides are in the `@media (max-width: 640px)` and `(max-width: 480px)` blocks. To redeploy after edits: `npm run build && vercel --prod --yes`. If asked to sync the repo, `git add index.html` (and optionally the carryover files) and commit.

### 2026-05-31 — PostHog fixed in production (was silently dead)

**Goal:** Pre-Instagram launch check — confirm analytics works.

**Found:** PostHog had **never worked in production**. Deployed bundle (`main-DZYDsaZQ.js`) initialized posthog-js with an empty `__POSTHOG_KEY__` → `initAnalytics()` hit its `if (!KEY) return` guard → zero events captured. Root cause: `vercel.json` uses `@vercel/static-build` so Vercel runs `npm run build` server-side; `vite.config.ts` sourced the key from the monorepo-root `.env` (`POSTHOG_ANALYTICS_API_KEY`), which is git-ignored and absent from deployed source. `vercel env ls` confirmed only Upstash vars were set, no PostHog. Local `dist` had the key (BrJNbm2a) but that build was never what Vercel served. The 05-30 "verified key in dist" note was the local build, not prod.

**Fix:**
- Added Vercel production env vars: `VITE_POSTHOG_KEY` (= root `.env` `POSTHOG_ANALYTICS_API_KEY`, `phc_yWEs…`) and `VITE_POSTHOG_HOST` = `https://eu.i.posthog.com`. `vite.config.ts` checks `VITE_POSTHOG_KEY` first (localEnv), so Vercel builds now inject it without the root `.env`.
- **Important:** root `.env` `POSTHOG_ANALYTICS_HOST` is `https://eu.posthog.com` (the *dashboard* host, wrong for ingestion). Set the Vercel var to the `.i.` ingestion host instead.
- Redeployed: `vercel --prod --yes` (dpl `dpl_89Jz4N3iLMa8uYoZ4cr5NkjjQu3C`).
- **Verified live:** www.tuneraiderz.com now serves `main-qAxI4hvR.js` containing `phc_yWEs…` + `eu.i.posthog.com`. PostHog now captures in prod.

**Analytics dashboard:** https://eu.posthog.com (EU cloud). Empty until real traffic arrives.

**Still open before IG share:**
- Eyeball long song titles ("Moscow Mule") wrapping in the ≤480px buttons on a real phone (dad's readability feedback, carried from prior session).
- Repo still behind prod (uncommitted carryover + today no code changes — fix was Vercel env only, no file edits).

**Files involved:** none edited — Vercel env + redeploy only.

**How to continue:** PostHog is live; verify events land in https://eu.posthog.com after some real visits. If you want events from your own testing excluded, add an IP/email filter in PostHog. To share on IG: do the real-phone title check first, then post.

### 2026-05-31 — iOS Safari audio fixes (friend reported no sound on iPhone)

**Symptom:** Friend on iPhone Safari, full volume, no audio. User has Android, can't repro.

**Root causes (game uses pure WebAudio APU synthesis, no <audio> elements):**
1. **iOS silent switch** mutes WebAudio even at full volume — the dominant cause. WebAudio routes through the "ambient" session by default, which the Ring/Silent switch silences.
2. **Gesture-window loss:** `index.html` startRound() calls `player.resume()` only AFTER `await fetch(midiUrl)` — past the user-gesture window, so iOS can refuse to unlock the context.
3. **No webkitAudioContext fallback** in `APU.ts` (only `sfx.ts` had it) — `new AudioContext()` throws on iOS < 14.5, killing all audio.

**Fixes:**
- New `src-v2/audio/session.ts` → `enablePlaybackSession()`: sets `navigator.audioSession.type='playback'` (Safari 16.4+, no-op elsewhere) so WebAudio plays through silent mode. Called from `APU.resume()` and `sfx.unlock()`.
- `APU.ts` constructor: `window.AudioContext || webkitAudioContext` fallback.
- `APU.resume()`: fires a 1-sample silent buffer synchronously (before any await) to unlock iOS inside the gesture.
- `index.html` btn-start-game handler: calls `player.resume()` synchronously on the tap (kicks unlock while gesture is still live), in addition to the later await in startRound.
- Built + deployed. Verified live: APU chunk `APU-BKdfIuEC.js` contains audioSession/createBuffer/playback; PostHog key `phc_yWEsuKMv` still injected.

**Caveats / pending:**
- Neither user nor I can test on iOS — needs the friend to retest on the real iPhone (hard-reload Safari first).
- Silent-switch fix requires iOS 16.4+. On older iOS the silent buffer + resume still help, but the mute switch may still silence WebAudio.
- `src/utils/audioUnlock.ts` (legacy v1, used by play/models/embed pages only) has a similar but separate unlock; not touched. Live game is index.html → src-v2.

**Files:** `src-v2/audio/session.ts` (new), `src-v2/audio/apu/APU.ts`, `src-v2/audio/sfx.ts`, `index.html`.
