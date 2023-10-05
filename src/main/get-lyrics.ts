/* eslint-disable no-plusplus */
import parseRTF from 'rtf-parser';
import fs from 'fs';
import { load } from 'protobufjs';

export default async function getLyrics(
  filepath: string,
  callback: (error: any, lyrics?: any, groups?: any) => void
) {
  let data: any;
  const lyrics: any = {};
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

  // Get lyrics
  for (let j = 0; j < outputObject.cues.length; j++) {
    const cueUuid: string = outputObject.cues[j].uuid.string;
    const textElement: any[] =
      outputObject.cues[j].actions[0].slide.presentation.baseSlide.elements[0]
        .element.text.rtfData;

    parseRTF.string(textElement, (error: any, doc: any) => {
      if (error) {
        callback(error);
        throw error;
      }

      for (let i = 0; i < doc.content.length; i++) {
        if (!lyrics[cueUuid]) {
          lyrics[cueUuid] = '';
        }

        // Figure out where the text is, if it exists at all
        if (Object.keys(doc.content[i]).includes('value')) {
          lyrics[cueUuid] += `\n${doc.content[i].value}`;
        } else if (
          'content' in doc.content[i] &&
          doc.content[i].content.length > 0 &&
          'value' in doc.content[i].content[0]
        ) {
          lyrics[cueUuid] += `\n${doc.content[i].content[0].value}`;
        }
      }

      // If on final iteration of loop, then run callback
      if (j >= outputObject.cues.length - 1) {
        callback(null, lyrics, groups);
      }
    });
  }
}
