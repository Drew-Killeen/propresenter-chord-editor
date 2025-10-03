import { Chord, Chords, Lyrics } from 'types/presentation';

export default function insertChords(
  originalLyrics: Lyrics,
  chords: Chords
): Lyrics {
  const tempEditableLyrics = { ...originalLyrics };
  const cueUuids = Object.keys(originalLyrics);

  for (let j = 0; j < cueUuids.length; j++) {
    // If there are no chords for this cue, continue
    if (!chords[cueUuids[j]] || chords[cueUuids[j]].length === 0) continue;
    const slideText = tempEditableLyrics[cueUuids[j]];

    // Check if the slide contains only whitespace characters
    if (slideText.length === 0) {
      let prevChordPosition = -1;

      // Reset the slide to blank since we don't want all the extra line breaks
      tempEditableLyrics[cueUuids[j]] = '';

      // Sort the chords in order so that we can insert them from the beginning
      chords[cueUuids[j]].sort(
        (a: Chord, b: Chord) => (a.range.start ?? 0) - (b.range.start ?? 0)
      );

      for (let i = 0; i < chords[cueUuids[j]].length; i++) {
        if (chords[cueUuids[j]][i].chord) {
          let chordPosition = 0;
          if ('start' in chords[cueUuids[j]][i].range) {
            chordPosition = chords[cueUuids[j]][i].range.start ?? 0;
          }

          // If there is a gap between chords, insert a new line
          if (
            prevChordPosition !== -1 &&
            prevChordPosition + 1 !== chordPosition
          ) {
            tempEditableLyrics[cueUuids[j]] += '\n';
          }

          // Insert chord at the end of the slide
          tempEditableLyrics[cueUuids[j]] += `[${
            chords[cueUuids[j]][i].chord
          }]`;

          prevChordPosition = chordPosition;
        }
      }
    } else {
      // If the slide isn't blank, insert chords into the text
      for (let i = 0; i < chords[cueUuids[j]].length; i++) {
        if (chords[cueUuids[j]][i].chord) {
          let chordPosition = 0;
          if ('start' in chords[cueUuids[j]][i].range) {
            chordPosition = chords[cueUuids[j]][i].range.start ?? 0;
          }
          tempEditableLyrics[cueUuids[j]] = `${tempEditableLyrics[
            cueUuids[j]
          ].slice(0, chordPosition)}[${
            chords[cueUuids[j]][i].chord
          }]${tempEditableLyrics[cueUuids[j]].slice(chordPosition)}`;
        }
      }
    }
  }

  return tempEditableLyrics;
}
