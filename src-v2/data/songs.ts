export interface CuratedSong {
  title: string;
  artist: string;
  midiUrl: string;
  cover?: string;
}

// Add a song: drop the .mid in public/midi/ and append one entry here.
export const SONGS: CuratedSong[] = [
  { title: 'DtMF', artist: 'Bad Bunny', midiUrl: '/midi/dtmf-bad-bunny-full.mid' },
  { title: 'Tití Me Preguntó', artist: 'Bad Bunny', midiUrl: '/midi/titi-me-pregunto.mid' },
  { title: 'Callaíta', artist: 'Bad Bunny', midiUrl: '/midi/callaita-bad-bunny.mid' },
  { title: 'Mónaco', artist: 'Bad Bunny', midiUrl: '/midi/monaco-bad-bunny.mid' },
  { title: 'Amorfoda', artist: 'Bad Bunny', midiUrl: '/midi/amorfoda-bad-bunny.mid' },
  { title: 'Mía', artist: 'Bad Bunny feat. Drake', midiUrl: '/midi/bad-bunny-feat.-drake---mia.mid' },
  { title: 'Moscow Mule', artist: 'Bad Bunny', midiUrl: '/midi/moscow-mule-bad-bunny.mid' },
  { title: 'Baile Inolvidable', artist: 'Bad Bunny', midiUrl: '/midi/debrayume_bad-bunny---baile-inolvidable.mid' },
  { title: 'Efecto', artist: 'Bad Bunny', midiUrl: '/midi/bad-bunny---efecto.mid' },
  { title: 'Dákiti', artist: 'Bad Bunny', midiUrl: '/midi/dakiti-bad-bunny.mid' },
];
