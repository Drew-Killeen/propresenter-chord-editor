/* eslint-disable no-plusplus */
import parseRTF from 'rtf-parser';
import fs from 'fs';
import { load } from 'protobufjs';

export default async function getLyrics(
  filepath: string,
  callback: (error: any, lyrics?: any, groups?: any, chords?: any) => void
) {
  let data: any;
  const lyrics: any = {};
  const chords: any = {};
  const groups: any = {};

  try {
    data = fs.readFileSync(filepath);
  } catch (err) {
    callback(err);
  }

  const proto = await load('proto/propresenter.proto');

  const messageType = proto.lookupType('rv.data.Presentation');

  const message = messageType.decode(data);

  const outputObject = messageType.toObject(message);

  // Get group names and colors
  for (let i = 0; i < outputObject.cueGroups.length; i++) {
    groups[outputObject.cueGroups[i].group.uuid.string] =
      outputObject.cueGroups[i];
  }

  // Get lyrics and chords
  for (let j = 0; j < outputObject.cues.length; j++) {
    const cueUuid: string = outputObject.cues[j].uuid.string;
    const textElement: any[] =
      outputObject.cues[j].actions[0].slide.presentation.baseSlide.elements[0]
        .element.text.rtfData;

    const { customAttributes } =
      outputObject.cues[j].actions[0].slide.presentation.baseSlide.elements[0]
        .element.text.attributes;

    chords[cueUuid] = [];

    if (customAttributes) {
      for (let i = 0, k = 0; i < customAttributes.length; i++) {
        if ('chord' in customAttributes[i]) {
          chords[cueUuid][k] = customAttributes[i];
          k++;
        }
      }
      if (Array.isArray(chords[cueUuid]) && chords[cueUuid].length > 0) {
        chords[cueUuid].sort((a, b) => b.range.end - a.range.end);
      }
    }

    parseRTF.string(textElement, (error: any, doc: any) => {
      if (error) {
        callback(error);
        throw error;
      }

      for (let i = 0; i < doc.content.length; i++) {
        if (!lyrics[cueUuid]) {
          lyrics[cueUuid] = '';
        } else {
          lyrics[cueUuid] += '\n';
        }

        // Figure out where the text is, if it exists at all
        if ('value' in doc.content[i]) {
          lyrics[cueUuid] += doc.content[i].value;
        } else if (
          'content' in doc.content[i] &&
          doc.content[i].content.length > 0 &&
          'value' in doc.content[i].content[0]
        ) {
          lyrics[cueUuid] += doc.content[i].content[0].value;
        }
      }

      // If on final iteration of loop, then run callback
      if (j >= outputObject.cues.length - 1) {
        callback(null, lyrics, groups, chords);
      }
    });
  }
}
