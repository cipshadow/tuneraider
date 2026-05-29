// Audio normalization gains per song
// Values calculated from MIDI analysis (velocity ranges, polyphony, dynamics)
// Multiplied to playback volume to normalize perceived loudness across songs

export const SONG_GAINS: Record<string, number> = {
  'DtMF': 0.95,
  'Tití Me Preguntó': 1.0,
  'Callaíta': 0.88,
  'Mónaco': 0.92,
  'Amorfoda': 0.98,
  'Mía': 0.85,
  'Moscow Mule': 1.25,  // Boosted from 1.02 - was too quiet
  'Baile Inolvidable': 0.90,
  'Efecto': 0.96,
};

export function getNormalizationGain(songTitle: string): number {
  return SONG_GAINS[songTitle] ?? 1.0;
}
