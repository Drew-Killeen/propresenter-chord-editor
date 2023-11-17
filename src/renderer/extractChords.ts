/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
export default function extractChords(lyrics: any) {
  const tempChords: any = {};
  const cueUuids = Object.keys(lyrics);

  for (let j = 0; j < cueUuids.length; j++) {
    const chordMatches = lyrics[cueUuids[j]].match(/\[(.*?)\]/g);
    if (!chordMatches) continue;

    // Keep track of the length of the chords we've already found
    let chordLengthOffset = 0;

    tempChords[cueUuids[j]] = chordMatches.map((chordMatch: any) => {
      const chord = chordMatch.slice(1, -1);
      const chordPosition = lyrics[cueUuids[j]].indexOf(chordMatch);
      chordLengthOffset += chordMatch.length;

      return {
        chord,
        range: {
          start: chordPosition - chordLengthOffset + chordMatch.length,
          end: chordPosition + chordMatch.length * 2 - chordLengthOffset,
        },
      };
    });
  }

  // Reverse the order of chords in each cue in order to match ProPresenter's order
  for (let i = 0; i < cueUuids.length; i++) {
    if (
      Array.isArray(tempChords[cueUuids[i]]) &&
      tempChords[cueUuids[i]].length > 0
    ) {
      tempChords[cueUuids[i]].sort((a, b) => b.range.start - a.range.start);
    }
  }

  return tempChords;
}
