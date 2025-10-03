// UUID type for consistent string representation
export interface UUID {
  string: string;
}

// Color type representing RGBA color values
export interface Color {
  red?: number;
  green?: number;
  blue?: number;
  alpha: number;
}

// Hot key configuration
export interface HotKey {
  code?: number;
}

// Point type for path coordinates
export interface Point {
  x?: number;
  y?: number;
}

// Origin coordinates
export interface Origin {
  x: number;
  y: number;
}

// Size dimensions
export interface Size {
  width: number;
  height: number;
}

// Range type for positioning in text
export interface ChordRange {
  start?: number;
  end?: number;
}
