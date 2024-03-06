import parseRTF from 'rtf-parser';
import fs from 'fs';
import util from 'util';
import { load } from 'protobufjs';
import path from 'path';

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

  let protoPath = 'assets/proto/propresenter.proto';

  if (process.env.NODE_ENV === 'production') {
    protoPath = path.join(
      process.resourcesPath,
      'assets/proto/propresenter.proto'
    );
  }

  const proto = await load(protoPath);

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

    // Custom attributes are used to store chords
    const { customAttributes } =
      outputObject.cues[j].actions[0].slide.presentation.baseSlide.elements[0]
        .element.text.attributes;

    chords[cueUuid] = [];

    if (customAttributes) {
      for (let i = 0, k = 0; i < customAttributes.length; i++) {
        if ('chord' in customAttributes[i]) {
          chords[cueUuid][k] = customAttributes[i];
          if ('start' in chords[cueUuid][k].range === false) {
            chords[cueUuid][k].range.start = 0;
          }
          k++;
        }
      }
      if (Array.isArray(chords[cueUuid]) && chords[cueUuid].length > 0) {
        chords[cueUuid].sort((a: any, b: any) => b.range.start - a.range.start);
      }
    }

    // Parse RTF to retrieve lyrics
    const asyncParseRTF = util.promisify(parseRTF.string);

    let doc;

    try {
      doc = await asyncParseRTF(textElement);
    } catch {
      console.log('error');
    }

    for (let i = 0; i < doc.content.length; i++) {
      let currentLyric: string = '';

      // Figure out where the text is, if it exists at all
      if ('value' in doc.content[i]) {
        currentLyric = doc.content[i].value;
      } else if (
        'content' in doc.content[i] &&
        doc.content[i].content.length > 0
      ) {
        for (let k = 0; k < doc.content[i].content.length; k++) {
          if ('value' in doc.content[i].content[k]) {
            currentLyric += doc.content[i].content[k].value;
          }
        }
      }

      if (!lyrics[cueUuid]) {
        lyrics[cueUuid] = '';
      } else if (
        // Check for various known characters that the RTF parser doesn't handle properly
        // Not a great solution since it could cause issues in certain edge cases, but not much else can be done besides writing a custom parser
        currentLyric !== '’' &&
        currentLyric !== '‘' &&
        currentLyric !== '“' &&
        currentLyric !== '”' &&
        currentLyric !== '…' &&
        currentLyric !== '—' &&
        currentLyric !== '–' &&
        currentLyric.charAt(0) !== '?' &&
        lyrics[cueUuid][lyrics[cueUuid].length - 1] !== '“' &&
        lyrics[cueUuid][lyrics[cueUuid].length - 1] !== '‘' &&
        lyrics[cueUuid][lyrics[cueUuid].length - 1] !== '’' &&
        lyrics[cueUuid][lyrics[cueUuid].length - 1] !== '—' &&
        lyrics[cueUuid][lyrics[cueUuid].length - 1] !== '–' &&
        lyrics[cueUuid][lyrics[cueUuid].length - 1] !== '…'
      ) {
        lyrics[cueUuid] += '\n';
      }

      if (currentLyric.charAt(0) === '?') {
        currentLyric = currentLyric.slice(1);
      }
      lyrics[cueUuid] += currentLyric;
    }
  }

  return { lyrics, chords, groups };
}
