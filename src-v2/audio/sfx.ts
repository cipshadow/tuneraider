/**
 * TuneRaider — UI sound effects (chiptune-style, synthesized via WebAudio).
 *
 * No audio assets required: tones are generated to match the Game Boy aesthetic.
 *  - playCoin():  "cha-ching" coin reward, played on a correct answer.
 *  - playError(): short descending buzz, played on a wrong answer.
 */

import { enablePlaybackSession } from './session';

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    ctx = new AC();
  }
  return ctx;
}

/** Resume the shared AudioContext. Call from a user gesture (e.g. iOS unlock). */
export async function unlock(): Promise<void> {
  // Play through the iOS silent switch (no-op off iOS / older Safari).
  enablePlaybackSession();
  const c = getCtx();
  if (c.state === 'suspended') await c.resume();
}

/**
 * Play a single square-wave note.
 * @param freq    frequency in Hz
 * @param start   start time offset (seconds) from now
 * @param dur     duration in seconds
 * @param peak    peak gain (0..1)
 */
function note(freq: number, start: number, dur: number, peak: number, type: OscillatorType = 'square'): void {
  const c = getCtx();
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  // Quick attack, exponential decay — gives a crisp chiptune "blip".
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

/** Coin / cash reward — classic two-note rising "cha-ching" (B5 -> E6). */
export function playCoin(): void {
  void unlock();
  note(987.77, 0, 0.09, 0.25);    // B5
  note(1318.51, 0.08, 0.18, 0.25); // E6
}

/** Error — short descending buzz for a wrong answer. */
export function playError(): void {
  void unlock();
  const c = getCtx();
  const t0 = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'square';
  // Sweep down for a "wah-wah" failure feel.
  osc.frequency.setValueAtTime(220, t0);
  osc.frequency.exponentialRampToValueAtTime(80, t0 + 0.3);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(0.25, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.32);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + 0.34);
}
