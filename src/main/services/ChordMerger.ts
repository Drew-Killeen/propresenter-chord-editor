import {
  Chords,
  Cue,
  CustomAttribute,
  PresentationDocument,
} from 'types/presentation';

export class ChordMerger {
  merge(
    presentation: PresentationDocument,
    chords: Chords
  ): PresentationDocument {
    if (!presentation.cues) {
      return presentation;
    }

    Object.keys(chords).forEach((cueUuid) => {
      this.mergeCueChords(presentation, cueUuid, chords[cueUuid]);
    });

    return presentation;
  }

  private mergeCueChords(
    presentation: PresentationDocument,
    cueUuid: string,
    chordAttributes: CustomAttribute[]
  ): void {
    const cueIndex = ChordMerger.findCueIndex(presentation.cues!, cueUuid);
    if (cueIndex === -1) return;

    const cue = presentation.cues![cueIndex];
    const textAttributes =
      cue.actions[0].slide.presentation.baseSlide.elements[0].element.text
        .attributes;

    let customAttributes = textAttributes.customAttributes || [];

    // Remove existing chord attributes
    customAttributes = ChordMerger.removeChordAttributes(customAttributes);

    // Add new chord attributes
    customAttributes.push(...chordAttributes);

    // Sort by position
    customAttributes.sort(ChordMerger.compareByStartPosition);

    textAttributes.customAttributes = customAttributes;
  }

  private static findCueIndex(cues: Cue[], cueUuid: string): number {
    return cues.findIndex((cue: Cue) => cue.uuid.string === cueUuid);
  }

  private static removeChordAttributes(
    attributes: CustomAttribute[]
  ): CustomAttribute[] {
    return attributes.filter((attr: CustomAttribute) => !('chord' in attr));
  }

  private static compareByStartPosition(
    a: CustomAttribute,
    b: CustomAttribute
  ): number {
    return (a.range.start ?? 0) - (b.range.start ?? 0);
  }
}
