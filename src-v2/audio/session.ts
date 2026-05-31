/**
 * iOS audio-session fix.
 *
 * On iOS, WebAudio (synthesized sound, like our 8-bit APU) is routed through
 * the "ambient" audio session by default. That session is muted by the phone's
 * physical Ring/Silent switch — even at full volume. Switching the session to
 * "playback" lets generated audio play through silent mode, the way a music app
 * does.
 *
 * Uses the AudioSession API (Safari 16.4+, March 2023). Older iOS and every
 * other browser silently lack `navigator.audioSession`, so this is a safe no-op
 * there. Call it from a user gesture (where we already resume the context).
 */
let applied = false;

export function enablePlaybackSession(): void {
  if (applied) return;
  try {
    const session = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
    if (session && 'type' in session) {
      session.type = 'playback';
      applied = true;
    }
  } catch {
    // Unsupported — ignore. WebAudio still works; it just respects silent mode.
  }
}
