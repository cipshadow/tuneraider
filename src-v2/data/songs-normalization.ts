// Audio normalization gains per song
// Values calculated from MIDI analysis (velocity ranges, polyphony, dynamics)
// Multiplied to playback volume to normalize perceived loudness across songs

// Gains normalized to match Efecto's perceived loudness (avgVel=50, gain=0.70).
// Formula: (50 / avgVelocity) * 0.70, capped at 1.50
// Gains normalized relative to each other; overall loudness driven by masterVolume + UI default.
export const SONG_GAINS: Record<string, number> = {
  'DtMF':              1.40,
  'Tití Me Preguntó':  1.00,
  'Callaíta':          2.00,
  'Mónaco':            2.40,
  'Amorfoda':          2.10,
  'Mía':               1.35,
  'Moscow Mule':       1.00,
  'Baile Inolvidable': 1.48,
  'Efecto':            1.00,
  'Dákiti':            1.00,
};

export function getNormalizationGain(songTitle: string): number {
  return SONG_GAINS[songTitle] ?? 1.0;
}
