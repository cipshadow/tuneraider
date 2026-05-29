# TUNERAIDER Session Log

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
