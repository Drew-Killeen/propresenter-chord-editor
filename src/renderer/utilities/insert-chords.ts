/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
export default function insertChords(originalLyrics: any, chords: any) {
  const tempEditableLyrics = { ...originalLyrics };
  const cueUuids = Object.keys(originalLyrics);

  for (let j = 0; j < cueUuids.length; j++) {
    if (!chords[cueUuids[j]] || chords[cueUuids[j]].length === 0) continue;

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

  return tempEditableLyrics;
}
