// Import shared types
import type { Color, ChordRange } from './shared';

// Individual chord with position and name
export interface Chord {
  range: ChordRange;
  chord: string;
}

// Collection of chords for a specific cue
export interface CueChords extends Array<Chord> {}

// Chords type - collection of chord arrays indexed by cue UUID
export interface Chords {
  [cueUuid: string]: CueChords;
}

// Custom attribute with range and properties (includes chord data)
export interface CustomAttribute {
  range: ChordRange;
  capitalization?: number;
  chord?: string;
}

// Chord Pro styling
export interface ChordPro {
  color: Color;
}
