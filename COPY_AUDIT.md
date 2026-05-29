# TUNERAIDER Copy Audit

All user-facing text, reviewed for clarity, consistency, and accuracy.

| # | Location | Current Copy | Issues | Suggested Copy | Notes |
|---|----------|--------------|--------|-----------------|-------|
| 1 | Page title | "TUNERAIDER - Bad Bunny Chiptune Quiz" | ❌ "Chiptune" is vague | "TUNERAIDER - Bad Bunny Game Boy Quiz" | Clearer what players are doing |
| 2 | Subtitle | "Bad Bunny • Game Boy Chiptune Quiz" | ❌ "Chiptune" redundant | "Bad Bunny • Game Boy Music Quiz" | Simpler, clearer |
| 3 | Home: Coin prompt | "▶ INSERT COIN ◀" | ✅ Good | Keep | Arcade nostalgia, clear call-to-action |
| 4 | Home: Play button | "🕹️ PLAY GAME" | ✅ Good | Keep | Clear intent |
| 5 | Home: Listen button | "🎧 LISTEN MODE" | ✅ Good | Keep | Matches design |
| 6 | Home: Leaderboard header | "TOP SCORES" | ✅ Good | Keep | Standard, clear |
| 7 | Home: Instructions title | "How to Play" | ✅ Good | Keep | Standard gaming UX |
| 8 | Home: Instruction line 1 | "Identify the chiptune playing and tap it from the moving buttons below the player." | ❌ "Chiptune" unclear | "Identify the Bad Bunny song playing and tap it from the moving buttons." | Direct, no jargon |
| 9 | Home: Instruction line 2 | "Speed = Points • Select within 1 second? 1000 points. Wait 30 seconds? Zero. Every millisecond counts." | ✅ Good | Keep | Clear scoring incentive |
| 10 | Home: Instruction line 3 | "Wrong picks cost you. Each mistake sets you back 1,111 points. Choose wisely." | ✅ Good | Keep | Clear penalty system |
| 11 | Home: Instruction line 4 | "9 rounds of Bad Bunny classics. Can you dominate the leaderboard?" | ✅ Good | Keep | Competitive tone |
| 12 | Home: Instruction fine print | "Keep listening between rounds—no penalty for taking your time. Just don't leave empty-handed." | ⚠️ "Don't leave empty-handed" is contradictory (they lose points for wrong answers) | "Keep listening after you guess—song won't interrupt between rounds." | Clearer what happens |
| 13 | Home: CTA button | "▶ INSERT COIN TO START" | ✅ Good | Keep | Arcade language, clear |
| 14 | Home: Footer | "TUNERAIDER v1.0 • Identify Chiptunes, Win Streaks" | ❌ "Chiptunes" (plural, weird) | "TUNERAIDER v1.0 • Identify Songs, Win Streaks" | Or: "Master the Game Boy, Win Streaks" |
| 15 | Game: Round counter | "ROUND 1/9" | ✅ Good | Keep | Standard |
| 16 | Game: Score display | "SCORE" | ✅ Good | Keep | Standard |
| 17 | Game: Now playing | "♪ ♪ ♪" | ✅ Good | Keep | Visual indicator, no text |
| 18 | Game: Live points label | "CURRENT POINTS" | ✅ Good | Keep | Clear |
| 19 | Game: Live points value | (countdown 1000→0) | ✅ Good | Keep | Visual, dynamic |
| 20 | Game: Instructions | "THE FASTER YOU SELECT THE MORE POINTS!" + "1s = 1000pts • 15s = 500pts • 30s = 0pts" | ⚠️ "15s = 500pts" is wrong (it's not 500, it's linear: 15s = 500pts is correct) | "SELECT FAST FOR MORE POINTS • 1s = 1000pts • 15s = 500pts • 30s = 0pts" | Math verified ✓ |
| 21 | Game: Timer display | "(time in seconds)" | ✅ Good | Keep | Minimal text |
| 22 | Result: Correct icon | "✓" | ✅ Good | Keep | Universal symbol |
| 23 | Result: Correct text | "Correct!" | ✅ Good | Keep | Clear feedback |
| 24 | Result: Wrong icon | "✗" (shown as "TIME!" currently) | ⚠️ Currently says "TIME!" for timeout, unclear for wrong | Keep "TIME!" for timeout, maybe clarify wrong answers say "❌ MISSED" or same as timeout | Check current code |
| 25 | Result: Score earned | "+<span id="round-points">1000</span> pts" | ✅ Good | Keep | Clear feedback |
| 26 | Result: Total score | "Total: <span>0</span>" | ✅ Good | Keep | Context for points |
| 27 | Result: Song playing | "♪ <span id="now-playing-song">Playing...</span> ♪" | ✅ Good | Keep | Shows which song played |
| 28 | Result: Continue hint | "Still listening? No problem! Click when ready for the next round." | ✅ Good | Keep | Reassuring |
| 29 | Result: Next button | "→ NEXT ROUND" | ✅ Good | Keep | Clear action |
| 30 | Game Over: Header | "GAME OVER" | ✅ Good | Keep | Standard |
| 31 | Game Over: Score label | "FINAL SCORE" | ✅ Good | Keep | Clear |
| 32 | Game Over: Name input | "YOUR NAME:" | ✅ Good | Keep | Standard |
| 33 | Game Over: Submit button | "SUBMIT SCORE" | ✅ Good | Keep | Clear |
| 34 | Game Over: Play Again | "PLAY AGAIN" | ✅ Good | Keep | Standard |
| 35 | Leaderboard: Header | "LEADERBOARD" | ✅ Good | Keep | Standard |
| 36 | Leaderboard: Ranks 1-3 | 🥇🥈🥉 | ✅ Good | Keep | Universal, visual |
| 37 | Leaderboard: Ranks 4-10 | Random emojis (horse, beer, etc.) | ✅ Good | Keep | Fun, rewarding |
| 38 | Leaderboard: Rank 11+ | Plain numbers (11. 12. etc.) | ✅ Good | Keep | Space efficient |
| 39 | Leaderboard: Back button | "← BACK" | ✅ Good | Keep | Clear |
| 40 | Listen Mode: Header | "LISTEN MODE" | ✅ Good | Keep | Clear |
| 41 | Listen Mode: Cards | (song title + artist) | ✅ Good | Keep | Minimal, clean |
| 42 | Listen Mode: Back button | "← BACK TO MENU" | ✅ Good | Keep | Clear |

---

## Summary of Changes Needed

### HIGH PRIORITY (Remove/Replace "Chiptune")
1. **Page title** (#1): Change to "Game Boy Quiz"
2. **Subtitle** (#2): Change to "Game Boy Music Quiz"
3. **Footer** (#14): Change to "Identify Songs, Win Streaks"
4. **Home instructions** (#8): Remove "chiptune," use "Bad Bunny song"

### MEDIUM PRIORITY (Clarity)
- **Home fine print** (#12): Rephrase about song continuing
- **Game instructions** (#20): Verify 15s = 500pts math is correct

### LOW PRIORITY (Keep As-Is)
- Everything else is clear and works well
- Buttons, icons, labels are good
- Tone is consistent and engaging

---

## New Unified Terminology
Use **"Game Boy version"** or **"Game Boy 8-bit version"** anywhere you need to describe the audio format.

Example: "Identify the Bad Bunny song playing in Game Boy 8-bit and tap it."

