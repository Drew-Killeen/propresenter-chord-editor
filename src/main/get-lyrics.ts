/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
import parseRTF from 'rtf-parser';
import fs from 'fs';
import util from 'util';
import { load } from 'protobufjs';

export default async function getLyrics(filepath: string): Promise<{
  lyrics: any;
  chords: any;
  groups: any;
}> {
  let data: any;
  const lyrics: any = {};
  const chords: any = {};
  const groups: any = {};

  try {
    data = fs.readFileSync(filepath);
  } catch (err) {
    console.log(err);
  }

  const proto = await load('proto/propresenter.proto');

  const messageType = proto.lookupType('rv.data.Presentation');

  const message = messageType.decode(data);

  const outputObject = messageType.toObject(message);

  if (!outputObject.cueGroups) return { lyrics, chords, groups };

  // Get group names and colors
  for (let i = 0; i < outputObject.cueGroups.length; i++) {
    groups[outputObject.cueGroups[i].group.uuid.string] =
      outputObject.cueGroups[i];
  }

  // Get lyrics and chords
  for (let j = 0; j < outputObject.cues.length; j++) {
    let textElement: any[];
    try {
      textElement =
        outputObject.cues[j].actions[0].slide.presentation.baseSlide.elements[0]
          .element.text.rtfData;
    } catch {
      continue;
    }

    const cueUuid: string = outputObject.cues[j].uuid.string;

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

    const asyncParseRTF = util.promisify(parseRTF.string);

    let doc;

    try {
      doc = await asyncParseRTF(textElement);
    } catch {
      console.log('error');
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
  }

  return { lyrics, chords, groups };
}
