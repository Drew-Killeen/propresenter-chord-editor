import { Lyrics } from 'types/presentation';

export default function doLyricsContainBracket(lyrics: Lyrics): boolean {
  const lyricsValues = Object.values(lyrics);
  for (let i = 0; i < lyricsValues.length; i++) {
    if (lyricsValues[i].includes('[') || lyricsValues[i].includes(']')) {
      return true;
    }
  }
  return false;
}
