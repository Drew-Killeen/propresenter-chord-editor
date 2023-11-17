/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
export default function extractChords(lyrics: any) {
  const tempChords: any = {};
  const cueUuids = Object.keys(lyrics);

  for (let j = 0; j < cueUuids.length; j++) {
    const chordMatches = lyrics[cueUuids[j]].match(/\[(.*?)\]/g);
    if (!chordMatches) continue;

    tempChords[cueUuids[j]] = chordMatches.map((chordMatch: any) => {
      const chord = chordMatch.slice(1, -1);
      const chordPosition = lyrics[cueUuids[j]].indexOf(chordMatch);
      return {
        chord,
        range: {
          start: chordPosition,
          end: chordPosition + chordMatch.length,
        },
      };
    });
  }

  return tempChords;
}
