# TUNERAIDER — Bad Bunny Game Boy Chiptune Quiz

A Game Boy-style chiptune quiz game where players identify Bad Bunny songs by listening to 8-bit synthesized versions and earn points based on speed.

**Live**: https://tuneraider.vercel.app  
**GitHub**: https://github.com/cipshadow/tuneraider  
**Forked from**: [b1rdmania/motif](https://github.com/b1rdmania/motif)

---

## Game Overview

- **9 Bad Bunny songs** converted to Game Boy 8-bit chiptune audio
- **Arcade-style gameplay**: 9 rounds, 6 random buttons per round
- **Scoring system**:
  - ✅ Correct answer: 1000 points at 1s, 0 points at 30s (linear)
  - ❌ Wrong answer: −1111 points per mistake
  - Max positive score: 9000 (all correct at 1s each)
  - Worst case: −9999 (all wrong)
- **Global leaderboard** with friend sharing (ranks 4-10 get random emoji icons 🐴🍺🎸👑)
- **Listen mode** for casual song browsing
- **Retro Game Boy aesthetic** with Press Start 2P font, scanlines, and #9bbc0f palette

---

## Features

- ✅ Real-time live points countdown (1000 → 0)
- ✅ Floating musical note animations during playback
- ✅ Smooth orbital button animations (smaller, slower radius)
- ✅ Audio normalization across all songs (consistent perceived loudness)
- ✅ Persistent global leaderboard (Redis/Vercel KV, in-memory fallback)
- ✅ DtMF always plays first, remaining 8 songs shuffled
- ✅ Responsive design (desktop + mobile)
- ✅ Negative scoring for wrong answers (difficulty kept high)

---

## Song List (9 Total)

1. **DtMF** (1:23) — Always first
2. Tití Me Preguntó (1:08)
3. Callaíta (3:30)
4. Mónaco (4:06)
5. Amorfoda (2:22)
6. Mía ft. Drake
7. Moscow Mule
8. Baile Inolvidable
9. Efecto

All songs randomly shuffled after DtMF. The game plays all 9 in one session.

---

## Tech Stack

- **Frontend**: Vite, TypeScript, vanilla CSS/JS
- **Synthesis**: Game Boy 8-channel APU via `src-v2/core/GameBoyPlayer.ts`
- **Backend**: Node.js/Express
- **Leaderboard**: Redis/Vercel KV (+ in-memory fallback for dev)
- **Deployment**: Vercel

---

## Development

```bash
npm install
npm run dev              # Vite on :3000
npm run dev:backend     # Backend on :3001 (in server/)
```

Open http://localhost:3000/game.html

---

## Credits & Acknowledgments

### Original Project
**[b1rdmania/motif](https://github.com/b1rdmania/motif)** — Game Boy sound synthesis engine (v2 core) and MIDI playback infrastructure. This quiz game builds entirely on their excellent synthesis work.

### Music
- **Original compositions**: Bad Bunny (Sony Music, Rimas Entertainment)
- **MIDI transcriptions**: Various transcribers via public MIDI databases (see `MIDI_CREDITS.md`)
- **Game design & chiptune quiz concept**: @cipshadow

---

## Legal & Disclaimers ⚠️

### Educational Use Only
This project is created for **educational and entertainment purposes only**. It synthesizes existing MIDI arrangements into Game Boy-style chiptune audio.

### Copyright Notice
- Bad Bunny songs are copyrighted by their respective copyright holders (Sony Music, Rimas Entertainment, Bad Bunny)
- MIDI files are transcriptions of copyrighted works from public MIDI databases
- This game does NOT include original audio files, only synthesized MIDI-to-chiptune conversions

### Fair Use Statement
Use of MIDI transcriptions and chiptune synthesis falls under **fair use** for:
- Educational demonstration of music synthesis techniques
- Non-commercial transformative work (Game Boy chiptune conversion)
- Personal/non-commercial entertainment

### Limitations
- **No commercial use**: This game cannot be sold, monetized, or used for profit without explicit permission from copyright holders
- **No commercial licensing**: Hosting on free/educational servers only
- **Attribution required**: Original artists, transcribers, and b1rdmania are credited

### Liability Waiver
Users of this software acknowledge that:
1. They understand the copyright implications of MIDI transcriptions
2. They will not use this game for commercial purposes
3. They will respect intellectual property rights of Bad Bunny and all music creators
4. The creators are not liable for copyright claims from third parties

### DMCA & Copyright Compliance
- This project complies with DMCA safe harbor provisions for non-commercial educational use
- For copyright concerns: open a GitHub issue or contact maintainer
- For licensing inquiries: contact Bad Bunny's copyright holders directly

---

## License

MIT License (code only) — **The music content and MIDI files are NOT MIT licensed.**

- **Code/Framework**: MIT (see `LICENSE`)
- **Bad Bunny MIDI & Derivatives**: © Sony Music, Rimas Entertainment, Bad Bunny (all rights reserved)

---

## Deployment to Vercel

1. Push to GitHub
2. Go to **https://vercel.com** → "New Project"
3. Select repo `cipshadow/tuneraider`
4. Deploy (Vite auto-detected)
5. Optional: Add `REDIS_URL` for persistent leaderboard

---

**Enjoy identifying the chiptunes!** 🎮♪
