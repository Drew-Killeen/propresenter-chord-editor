/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
export default function extractChords(lyrics: any) {
  const tempChords: any = {};
  const cueUuids = Object.keys(lyrics);

  for (let j = 0; j < cueUuids.length; j++) {
    // Check if the slide contains only whitespace characters and chords
    const slideTextNoWhitespaceOrChords = lyrics[cueUuids[j]]
      .replace(/\s/g, '')
      .replace(/\[(.*?)\]/g, '');

    if (slideTextNoWhitespaceOrChords.length === 0) {
      const chordMatches = lyrics[cueUuids[j]].match(/\[(.*?)\]|(\r?\n|\r)/g);
      if (!chordMatches) continue;

      let chordCount = 0;

      tempChords[cueUuids[j]] = [];
      for (let i = 0; i < chordMatches.length; i++) {
        const chordMatch = chordMatches[i];
        if (chordMatch === '\n') {
          chordCount++;
          continue;
        }

        const chord = chordMatch.slice(1, -1);

        // Remove chords as they're found
        lyrics[cueUuids[j]] = lyrics[cueUuids[j]].replace(chordMatch, '');

        tempChords[cueUuids[j]].push({
          chord,
          range: {
            start: chordCount,
            end: chordCount + 1,
          },
        });
        chordCount++;
      }
    } else {
      // If the slide does contain text, find the positions of the chords
      // Remove new line characters
      lyrics[cueUuids[j]] = lyrics[cueUuids[j]].replace(/\n/g, ' ');

      const chordMatches = lyrics[cueUuids[j]].match(/\[(.*?)\]/g);
      if (!chordMatches) continue;

      tempChords[cueUuids[j]] = chordMatches.map((chordMatch: any) => {
        const chord = chordMatch.slice(1, -1);
        const chordPosition = lyrics[cueUuids[j]].indexOf(chordMatch);

        // Remove chords as they're found
        lyrics[cueUuids[j]] = lyrics[cueUuids[j]].replace(chordMatch, '');

        return {
          chord,
          range: {
            start: chordPosition,
            end: chordPosition + chordMatch.length,
          },
        };
      });
    }
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
