// Import shared types
import type { UUID, Color } from './shared';
import type { GroupData } from './groups';
import type { Cue, ChordChart } from './cues';

// Platform and application version information
export interface Version {
  majorVersion: number;
  minorVersion: number;
  patchVersion?: number;
  build?: string;
}

// Application information
export interface ApplicationInfo {
  platform: number;
  platformVersion: Version;
  application: number;
  applicationVersion: Version;
}

// Background configuration
export interface Background {
  color: Color;
}

// Arrangement configuration
export interface Arrangement {
  uuid: UUID;
  name: string;
  groupIdentifiers: UUID[];
}

// CCLI licensing information
export interface CCLI {
  author?: string;
  artistCredits?: string;
  songTitle?: string;
  songNumber?: number;
  artwork?: Uint8Array;
}

// Timeline cue reference
export interface TimelineCueReference {
  cueId: UUID;
  name: string;
  triggerTime?: number;
}

// URL configuration
export interface URL {
  absoluteString: string;
  platform: number;
  local?: {
    root: number;
    path: string;
  };
}

// Media metadata
export interface MediaMetadata {
  artist?: string;
  format?: string;
}

// Audio output configuration
export interface AudioOutput {
  channelIndex?: number;
}

// Audio channel configuration
export interface AudioChannel {
  index?: number;
  outputs: AudioOutput[];
}

// Audio configuration
export interface Audio {
  volume: number;
  audioChannels: AudioChannel[];
}

// Transport controls
export interface Transport {
  playRate: number;
  outPoint?: number;
  shouldFadeIn?: boolean;
  shouldFadeOut?: boolean;
  endPoint?: number;
  timesToLoop?: number;
}

// Media element
export interface MediaElement {
  uuid: UUID;
  url: URL;
  metadata?: MediaMetadata;
  audio?: {
    audio: Audio;
    transport: Transport;
  };
}

// Media action configuration
export interface MediaAction {
  element: MediaElement;
  audio?: {};
}

// Audio action (for timeline)
export interface AudioAction {
  uuid: UUID;
  name: string;
  isEnabled: boolean;
  duration: number;
  type: number;
  media: MediaAction;
}

// Timeline cue V2 reference
export interface TimelineCueV2 {
  cueId?: UUID;
  name: string;
  action?: AudioAction;
}

// Timeline configuration
export interface Timeline {
  cues?: TimelineCueReference[];
  duration?: number;
  audioAction?: AudioAction;
  timecodeOffset?: number;
  cuesV2?: TimelineCueV2[];
}

// Long number representation
export interface LongNumber {
  low: number;
  high: number;
  unsigned: boolean;
}

// Timestamp configuration
export interface Timestamp {
  seconds: LongNumber;
}

// MultiTracks licensing information
export interface MultiTracksLicensing {
  songIdentifier?: LongNumber;
  customerIdentifier?: string;
  expirationDate?: Timestamp;
  licenseExpiration?: Timestamp;
  subscription?: number;
}

// Music key configuration
export interface MusicKeyConfig {
  musicKey: number;
}

// Music configuration
export interface Music {
  original?: MusicKeyConfig;
  user?: MusicKeyConfig;
}

// Main Presentation type
export interface PresentationDocument {
  applicationInfo?: ApplicationInfo;
  uuid: UUID;
  name: string;
  background?: Background;
  chordChart?: ChordChart;
  selectedArrangement?: UUID;
  arrangements?: Arrangement[];
  cueGroups?: GroupData[];
  cues?: Cue[];
  ccli?: CCLI;
  timeline?: Timeline;
  multiTracksLicensing?: MultiTracksLicensing;
  music?: Music;
}
