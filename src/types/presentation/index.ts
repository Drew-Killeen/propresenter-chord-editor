// Re-export all types from organized modules
export * from './shared';
export * from './groups';
export * from './chords';
export * from './lyrics';
export * from './cues';

// Selectively export from presentation to avoid conflicts
export type {
  Version,
  ApplicationInfo,
  Background,
  Arrangement,
  CCLI,
  TimelineCueReference,
  URL,
  MediaMetadata,
  AudioOutput,
  AudioChannel,
  Audio,
  Transport,
  MediaElement,
  MediaAction,
  AudioAction,
  TimelineCueV2,
  Timeline,
  LongNumber,
  Timestamp,
  MultiTracksLicensing,
  MusicKeyConfig,
  Music,
  PresentationDocument,
} from './presentation';
