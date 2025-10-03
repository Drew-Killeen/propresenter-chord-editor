import {
  Chords,
  Cue,
  CustomAttribute,
  PresentationDocument,
} from 'types/presentation';

export default function mergeChords(
  presentation: PresentationDocument,
  chords: Chords
) {
  if (!presentation.cues) {
    return presentation;
  }

  for (let i = 0; i < Object.keys(chords).length; i++) {
    const cueUuid = Object.keys(chords)[i];

    // Find the index of the cue in the presentation that matches the chord UUID
    const cueIndex = presentation.cues.findIndex(
      (cue: Cue) => cue.uuid.string === cueUuid
    );

    // If no matching cue is found, skip to the next iteration
    if (cueIndex === -1) continue;

    // Get the custom attributes of the cue
    let { customAttributes } =
      presentation.cues[cueIndex].actions[0].slide.presentation.baseSlide
        .elements[0].element.text.attributes;

    // If no custom attributes are found, create the custom attributes array
    if (!customAttributes) {
      customAttributes = [];
    }

    // Remove all existing chord custom attributes
    customAttributes = customAttributes.filter(
      (attribute: CustomAttribute) => !('chord' in attribute)
    );

    // Add the chord custom attributes
    customAttributes.push(...chords[cueUuid]);

    // Sort the custom attributes by start position. If no start position is found, default to 0
    customAttributes.sort((a: CustomAttribute, b: CustomAttribute) => {
      return (a.range.start ?? 0) - (b.range.start ?? 0);
    });

    presentation.cues[
      cueIndex
    ].actions[0].slide.presentation.baseSlide.elements[0].element.text.attributes.customAttributes =
      customAttributes;
  }

  return presentation;
}
