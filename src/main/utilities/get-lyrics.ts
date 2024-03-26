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
  let lyrics: any = {};
  let chords: any = {};
  let groups: any = {};

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
  groups = getGroups(outputObject.cueGroups);

  // Parse the outputObject to get the cues for the lyrics and chords
  const cueData: any[] = getCues(outputObject.cues);

  const cues = await processCues(cueData);

  lyrics = cues.lyrics;
  chords = cues.chords;

  return { lyrics, chords, groups };
}

function getCues(cues: any): any[] {
  const cueData: any[] = [];

  for (let i = 0; i < cues.length; i++) {
    const cueUuid: string = cues[i].uuid.string;
    const textElement =
      cues[i].actions[0].slide.presentation.baseSlide.elements[0].element.text
        .rtfData;
    const { customAttributes } =
      cues[i].actions[0].slide.presentation.baseSlide.elements[0].element.text
        .attributes;

    cueData[i] = {
      cueUuid,
      textElement,
      customAttributes,
    };
  }
  return cueData;
}

async function processCues(
  cueData: { cueUuid: string; textElement: any; customAttributes: any }[]
): Promise<{ lyrics: any; chords: any }> {
  const lyrics: any = {};
  const chords: any = {};

  for (let i = 0; i < cueData.length; i++) {
    const { cueUuid } = cueData[i];
    chords[cueUuid] = getChords(cueData[i].customAttributes);

    // Parse RTF to retrieve lyrics
    const asyncParseRTF = util.promisify(parseRTF.string);

    let doc;

    try {
      doc = await asyncParseRTF(cueData[i].textElement);
    } catch {
      console.log('error');
    }

    let lastLyric = '';
    if (lyrics[cueUuid] !== undefined) {
      lastLyric = lyrics[cueUuid][lyrics[cueUuid].length - 1];
    }
    lyrics[cueUuid] = parseLyrics(doc.content, lastLyric);
  }

  return { lyrics, chords };
}

function getGroups(cueGroups: any): any {
  const groups: any = {};
  for (let i = 0; i < cueGroups.length; i++) {
    groups[cueGroups[i].group.uuid.string] = cueGroups[i];
  }
  return groups;
}

function parseLyrics(content: any[], lastLyric: any): any {
  let lyrics: string = '';
  for (let i = 0; i < content.length; i++) {
    let currentLyric: string = findText(content[i]);

    if (!lyrics) {
      lyrics = '';
    } else if (
      // Check for various known characters that the RTF parser doesn't handle properly
      // Not a great solution since it could cause issues in certain edge cases, but not much else can be done besides writing a custom parser
      !beginsWithSpecialCharacter(currentLyric) &&
      currentLyric !== '' &&
      currentLyric.charCodeAt(0) !== 8203 &&
      currentLyric.charAt(0) !== '?' &&
      lastLyric !== '“' &&
      lastLyric !== '‘' &&
      lastLyric !== '’' &&
      lastLyric !== '—' &&
      lastLyric !== '–' &&
      lastLyric !== '…'
    ) {
      lyrics += '\n';
    }

    if (currentLyric.charAt(0) === '?') {
      currentLyric = currentLyric.slice(1);
    }

    lyrics += currentLyric;
  }

  return lyrics;
}

function findText(content: any): string {
  let currentLyric: string = '';

  // Figure out where the text is, if it exists at all
  if ('value' in content) {
    if (isQuestionMarksOnly(content.value)) {
      content.value = removeQuestionMarks(content.value);
    }
    currentLyric = content.value;
  } else if ('content' in content && content.content.length > 0) {
    for (let k = 0; k < content.content.length; k++) {
      if ('value' in content.content[k]) {
        if (isQuestionMarksOnly(content.content[k].value)) {
          content.content[k].value = removeQuestionMarks(
            content.content[k].value
          );
        }
        if (
          beginsWithSpecialCharacter(currentLyric[currentLyric.length - 1]) &&
          content.content[k].value.charAt(0) === '?'
        ) {
          content.content[k].value = content.content[k].value.slice(1);
        }
        currentLyric += content.content[k].value;
      }
    }
  }
  return currentLyric;
}

function isQuestionMarksOnly(text: string): boolean {
  // Slides containing zero-width characters include a question mark character due to the RTF parser. This is a workaround to remove the question mark character.
  return /^[\u200B? ]+$/.test(text);
}

function removeQuestionMarks(text: string): string {
  return text.replace(/\?/g, '');
}

function beginsWithSpecialCharacter(text: string): boolean {
  return (
    text === '’' ||
    text === '‘' ||
    text === '“' ||
    text === '”' ||
    text === '…' ||
    text === '—' ||
    text === '–'
  );
}

function getChords(customAttributes: any[]) {
  if (!customAttributes) return [];
  const chords: any[] = [];
  for (let i = 0, k = 0; i < customAttributes.length; i++) {
    if ('chord' in customAttributes[i]) {
      chords[k] = customAttributes[i];
      if ('start' in chords[k].range === false) {
        chords[k].range.start = 0;
      }
      k++;
    }
  }
  if (Array.isArray(chords) && chords.length > 0) {
    chords.sort((a: any, b: any) => b.range.start - a.range.start);
  }
  return chords;
}
