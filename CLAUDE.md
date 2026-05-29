# TUNERAIDER — Game Boy Quiz

**GitHub**: https://github.com/cipshadow/tuneraider  
**Live**: [localhost:3000](http://localhost:3000)  
**Creator**: cipshadow  

## Project Overview

A **dexterity-based music quiz game** that converts Bad Bunny MIDI files into Game Boy 8-bit audio in the browser. Players identify songs by ear, earning points based on speed. Global leaderboard powered by Redis.

## Tech Stack

- **Frontend**: Vite (TypeScript), v2.html (Game Boy player)
- **Synthesis**: `src-v2/core/GameBoyPlayer.ts` — 8-channel APU (4 pulse, 2 wave, 2 noise)
- **Backend**: Express (Node.ts), Redis/Vercel KV leaderboard
- **Audio**: Web Audio API, @tonejs/midi parsing
- **Design**: Press Start 2P font, Game Boy palette (green #9bbc0f, dark #0f380f)

## Game Mechanics

1. **Arcade Button Panel** (2×3 grid)
   - 6 random buttons from 9-song library selected per round
   - Buttons **swap positions** continuously with staggered animations
   - Players click the correct song button

2. **Scoring**
   - Speed-based: `points = Math.max(0, 1000 * (1 - elapsed/30))`
   - Max 1000 pts at 1 second
   - 0 pts if no selection by 30s or wrong answer
   - 9 rounds (9 songs) = max 9000 pts

3. **Features**
   - Volume control (top-right, 0-100%)
   - Global leaderboard (Redis/Vercel KV)
   - Listen mode (browse all songs anytime)
   - Local dev fallback (in-memory storage)

## Library (9 Bad Bunny Tracks)

All full-length MIDIs in `/public/midi/`:
1. DtMF (1:23)
2. Tití Me Preguntó (1:08)
3. Callaíta (3:30)
4. Mónaco (4:06)
5. Amorfoda (2:22)
6. Mía ft. Drake (song)
7. Moscow Mule (song)
8. Baile Inolvidable (song)
9. Efecto (song)

See `MIDI_CREDITS.md` for attribution.

## Dev Setup

```bash
npm install
npm run dev              # Vite on :3000
npm run dev:backend     # Backend on :3001 (in server/)
npm run build           # Production build
```

Backend uses Vite proxy: `/api/*` → localhost:3001

## File Structure

```
.
├── index.html             # Quiz game (home)
├── v2.html                # Gallery/listen mode
├── src-v2/                # v2 synthesis engine
│   ├── core/GameBoyPlayer.ts
│   ├── audio/apu/APU.ts   # 8-channel hardware sim
│   └── data/songs.ts      # Curated library
├── server/src/
│   ├── server.ts          # Express app
│   └── src/               # MIDI parsing, search adapters
├── public/midi/           # Local MIDI files
└── MIDI_CREDITS.md        # Attribution

```

## Design System (Game Boy Palette)

```css
--bg-dark: #0f380f          /* deep green */
--bg-panel: #306230         /* medium green */
--gb-green: #9bbc0f         /* bright green (primary text) */
--gb-light-green: #8bac0f   /* dim green (labels) */
--gb-cream: #e0f8d0         /* light off-white */
```

Scanlines overlay: `repeating-linear-gradient(transparent 0px, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)`

## Guidelines

- **Game Boy aesthetic first**: Pixel font, retro colors, scanlines, blinking text
- **Dexterity challenge**: Button animations must be unpredictable and fluid
- **Replayability**: All 9 songs appear in every game; no elimination
- **Responsive**: Works on desktop and mobile (game buttons are large tap targets)
- **Accessibility**: Clear scoring rules in UI, no timer surprises
- **Sound design**: Authentic v2 synthesis; volume control always visible

## Deployment

To Vercel:
1. Push to `github.com/cipshadow/tuneraider`
2. Connect Vercel to GitHub
3. Set env: `REDIS_URL` (or leave empty for in-memory fallback)
4. Vite frontend builds to `dist/`; backend at `/api/*`

## Recent Work

- ✅ 9-song library (full-length MIDIs)
- ✅ Arcade button panel with swapping animation
- ✅ Volume control integration
- ✅ Global leaderboard (Redis + local fallback)
- ✅ Game Boy v2 synthesis engine integration
- ✅ MIDI attribution credits
- 🎨 Next: Claude Design for visual improvements

## Known Issues / TODOs

- Mobile button sizing could be tweaked for thumb comfort
- Leaderboard name length validation (20 chars)
- Potential for difficulty levels (snippet length, button count)

---

**Status**: MVP complete, ready for design polish and Vercel deploy.
