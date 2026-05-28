import type { SearchAdapter, MIDICandidate } from '../types.js';
import { ScoreUtils } from '../utils/ScoreUtils.js';

// Easy to configure: add your curated songs here with MIDI URLs
const CURATED_SONGS = [
  {
    title: 'DtMF - Bad Bunny',
    midiUrl: '/midi/dtmf-bad-bunny.mid',
    pageUrl: 'https://mididb.com/bad-bunny/dtmf'
  },
  // Add more songs here:
  // { title: 'Song Name - Artist', midiUrl: 'https://...', pageUrl: 'https://...' }
];

export class CustomAdapter implements SearchAdapter {
  name = 'custom';

  async search(query: string): Promise<MIDICandidate[]> {
    const results: MIDICandidate[] = [];

    for (const song of CURATED_SONGS) {
      // Skip if no MIDI URL configured yet
      if (!song.midiUrl) continue;

      const confidence = ScoreUtils.calculateConfidence(song.title, query, this.name);

      if (confidence > 0.1) {
        results.push({
          id: `custom_${Buffer.from(song.midiUrl).toString('base64').slice(0, 16)}`,
          title: song.title,
          source: 'custom',
          pageUrl: song.pageUrl,
          midiUrl: song.midiUrl,
          confidence
        });
      }
    }

    return results
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 10);
  }
}
