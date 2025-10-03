// Import shared types
import type { UUID, Color, HotKey } from './shared';

// Individual group configuration
export interface Group {
  uuid: UUID;
  name: string;
  color: Color;
  hotKey?: HotKey;
  applicationGroupIdentifier?: UUID;
}

// Cue identifier reference
export interface CueIdentifier {
  string: string;
}

// Group data structure containing group info and associated cues
export interface GroupData {
  group: Group;
  cueIdentifiers: CueIdentifier[];
}

// Collection of all groups indexed by UUID string
export interface Groups {
  [uuid: string]: GroupData;
}
