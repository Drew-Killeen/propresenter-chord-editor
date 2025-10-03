// Lyrics type - collection of lyric text indexed by cue UUID
export interface Lyrics {
  [cueUuid: string]: string;
}
