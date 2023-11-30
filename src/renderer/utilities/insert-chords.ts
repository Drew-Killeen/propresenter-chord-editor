/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
export default function insertChords(originalLyrics: any, chords: any) {
  const tempEditableLyrics = { ...originalLyrics };
  const cueUuids = Object.keys(originalLyrics);

  for (let j = 0; j < cueUuids.length; j++) {
    // If there are no chords for this cue, continue
    if (!chords[cueUuids[j]] || chords[cueUuids[j]].length === 0) continue;
    const slideText = tempEditableLyrics[cueUuids[j]]
      .replace(/\s/g, '')
      .replace(/\u200B/g, '');

    // Check if the slide contains only whitespace characters
    if (slideText.length === 0) {
      let prevChordPosition = -1;

      // Reset the slide to blank since we don't want all the extra line breaks
      tempEditableLyrics[cueUuids[j]] = '';

      // Sort the chords in order so that we can insert them from the beginning
      chords[cueUuids[j]].sort(
        (a: any, b: any) => a.range.start - b.range.start
      );

      for (let i = 0; i < chords[cueUuids[j]].length; i++) {
        if (chords[cueUuids[j]][i].chord) {
          let chordPosition = 0;
          if ('start' in chords[cueUuids[j]][i].range) {
            chordPosition = chords[cueUuids[j]][i].range.start;
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
            chordPosition = chords[cueUuids[j]][i].range.start;
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
