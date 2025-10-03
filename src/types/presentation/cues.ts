// Import shared types
import type { UUID, Color, HotKey, Point, Size, Origin } from './shared';
import type { CustomAttribute, ChordPro } from './chords';

// Path point with bezier curve control points
export interface PathPoint {
  point: Point;
  q0: Point;
  q1: Point;
}

// Shape configuration
export interface Shape {
  type: number;
}

// Path definition for element bounds
export interface Path {
  closed: boolean;
  points: PathPoint[];
  shape: Shape;
}

// Bounds definition
export interface Bounds {
  origin: Origin;
  size: Size;
}

// Fill styling
export interface Fill {
  color: Color;
}

// Stroke styling
export interface Stroke {
  width: number;
  color: Color;
}

// Shadow styling
export interface Shadow {
  color: Color;
  angle?: number;
  offset?: number;
  radius?: number;
  opacity?: number;
}

// Feather effect (empty in sample data)
export interface Feather {}

// Font definition
export interface Font {
  name: string;
  size: number;
  family: string;
}

// Text list configuration (empty in sample data)
export interface TextList {}

// Paragraph style configuration
export interface ParagraphStyle {
  alignment: number;
  lineHeightMultiple: number;
  minimumLineHeight: number;
  lineSpacing: number;
  defaultTabInterval: number;
  textList: TextList;
}

// Underline style (empty in sample data)
export interface UnderlineStyle {}

// Strikethrough style (empty in sample data)
export interface StrikethroughStyle {}

// Text attributes configuration
export interface TextAttributes {
  font: Font;
  capitalization: number;
  textSolidFill: Color;
  underlineStyle: UnderlineStyle;
  underlineColor: Color;
  paragraphStyle: ParagraphStyle;
  strikethroughStyle: StrikethroughStyle;
  strokeColor: Color;
  customAttributes: CustomAttribute[];
}

// Text margins (empty in sample data)
export interface Margins {}

// Text element configuration
export interface Text {
  attributes: TextAttributes;
  shadow: Shadow;
  rtfData: Uint8Array;
  verticalAlignment: number;
  margins: Margins;
  isSuperscriptStandardized: boolean;
  transformDelimiter: string;
  chordPro: ChordPro;
}

// Text line mask (empty in sample data)
export interface TextLineMask {}

// Text scroller configuration
export interface TextScroller {
  scrollRate: number;
  shouldRepeat: boolean;
  repeatDistance: number;
}

// Element definition
export interface Element {
  uuid: UUID;
  name: string;
  bounds: Bounds;
  opacity: number;
  path: Path;
  fill: Fill;
  stroke: Stroke;
  shadow: Shadow;
  feather: Feather;
  text: Text;
  textLineMask: TextLineMask;
}

// Element wrapper with info and scroller
export interface ElementWrapper {
  element: Element;
  info: number;
  textScroller: TextScroller;
}

// Base slide definition
export interface BaseSlide {
  elements: ElementWrapper[];
  backgroundColor: Color;
  size: Size;
  uuid: UUID;
}

// Chord chart (empty in sample data)
export interface ChordChart {}

// Presentation configuration
export interface Presentation {
  baseSlide: BaseSlide;
  chordChart: ChordChart;
}

// Slide wrapper
export interface Slide {
  presentation: Presentation;
}

// Action definition
export interface Action {
  uuid: UUID;
  isEnabled: boolean;
  type: number;
  slide: Slide;
}

// Main cue type definition
export interface Cue {
  uuid: UUID;
  name: string;
  completionTargetUuid: UUID;
  completionActionType: number;
  completionActionUuid: UUID;
  hotKey: HotKey;
  actions: Action[];
  isEnabled: boolean;
}

// Processed cue data for lyrics extraction
export interface CueData {
  cueUuid: string;
  textElement: Uint8Array; // RTF data that gets processed by RTF parser
  customAttributes: CustomAttribute[];
}
