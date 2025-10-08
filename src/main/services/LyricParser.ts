import parseRTF, { RTFParagraph, RTFSpan } from 'rtf-parser';
import util from 'util';
import {
  Lyrics,
  Chords,
  Groups,
  Cue,
  CustomAttribute,
  GroupData,
  Chord,
} from 'types/presentation';

export class LyricParser {
  private asyncParseRTF = util.promisify(parseRTF.string);

  async parse(
    cues: Cue[],
    cueGroups?: GroupData[]
  ): Promise<{
    lyrics: Lyrics;
    chords: Chords;
    groups: Groups;
  }> {
    const groups = cueGroups ? LyricParser.extractGroups(cueGroups) : {};
    const lyrics: Lyrics = {};
    const chords: Chords = {};

    await Promise.all(
      cues.map(async (cue) => {
        const cueUuid = cue.uuid.string;
        const textElement =
          cue.actions[0].slide.presentation.baseSlide.elements[0].element.text;

        chords[cueUuid] = LyricParser.extractChords(
          textElement.attributes.customAttributes
        );
        lyrics[cueUuid] = await this.extractLyrics(textElement.rtfData);
      })
    );

    return { lyrics, chords, groups };
  }

  private static extractGroups(cueGroups: GroupData[]): Groups {
    const groups: Groups = {};
    cueGroups.forEach((group) => {
      groups[group.group.uuid.string] = group;
    });
    return groups;
  }

  private static extractChords(customAttributes?: CustomAttribute[]): Chord[] {
    if (!customAttributes) return [];

    const chords = customAttributes
      .filter((attr): attr is Chord => 'chord' in attr)
      .map((chord) => ({
        ...chord,
        range: {
          ...chord.range,
          start: chord.range.start ?? 0,
        },
      }));

    return chords.sort((a, b) => (b.range.start ?? 0) - (a.range.start ?? 0));
  }

  private async extractLyrics(rtfData: Uint8Array): Promise<string> {
    try {
      const rtfString = new TextDecoder().decode(rtfData);
      const doc = await this.asyncParseRTF(rtfString);
      return this.parseLyricContent(doc.content);
    } catch (error: unknown) {
      console.error('Failed to parse RTF:', error);
      return '';
    }
  }

  private parseLyricContent(content: (RTFParagraph | RTFSpan)[]): string {
    let lyrics = '';
    let lastChar = '';

    content.forEach((item) => {
      let currentLyric = LyricParser.extractText(item);

      if (lyrics && LyricParser.needsLineBreak(currentLyric, lastChar)) {
        lyrics += '\n';
      }

      currentLyric = LyricParser.cleanText(currentLyric);
      lyrics += currentLyric;

      if (currentLyric) {
        lastChar = currentLyric[currentLyric.length - 1];
      }
    });

    return lyrics;
  }

  private static extractText(content: RTFParagraph | RTFSpan): string {
    if ('value' in content) {
      return LyricParser.cleanQuestionMarks(content.value);
    }

    if ('content' in content && content.content.length > 0) {
      return content.content
        .map((item) => {
          if ('value' in item) {
            return LyricParser.cleanQuestionMarks(item.value);
          }
          return '';
        })
        .join('');
    }

    return '';
  }

  private static needsLineBreak(
    currentLyric: string,
    lastChar: string
  ): boolean {
    const specialChars = [
      '"',
      '\u2018',
      '\u2019',
      '\u2014',
      '\u2013',
      '\u2026',
    ];
    return (
      currentLyric !== '' &&
      !LyricParser.beginsWithSpecialCharacter(currentLyric) &&
      currentLyric.charAt(0) !== '?' &&
      !specialChars.includes(lastChar)
    );
  }

  private static beginsWithSpecialCharacter(text: string): boolean {
    const specialChars = [
      '\u2018',
      '\u2019',
      '"',
      '\u201C',
      '\u2026',
      '\u2014',
      '\u2013',
    ];
    return specialChars.includes(text.charAt(0));
  }

  private static cleanQuestionMarks(text: string): string {
    if (/^[\u200B? ]+$/.test(text)) {
      return text.replace(/\?/g, '');
    }
    return text;
  }

  private static cleanText(text: string): string {
    const cleanedStr = text.replace(/\u200B/g, '');
    if (cleanedStr.charAt(0) === '?') {
      const index = text.indexOf('?');
      return text.slice(0, index) + text.slice(index + 1);
    }
    return text;
  }

  containsBrackets(lyrics: Lyrics): boolean {
    return Object.values(lyrics).some(
      (lyric) => lyric.includes('[') || lyric.includes(']')
    );
  }
}
