/* eslint-disable no-unused-vars */
declare module 'rtf-parser' {
  export interface RTFSpan {
    style: RTFStyle;
    value: string;
  }

  export interface RTFParagraph {
    content: RTFSpan[];
    style: RTFStyle;
  }

  export interface RTFColor {
    red: number;
    blue: number;
    green: number;
  }

  export interface RTFFont {
    family: string;
    charset: string;
    name: string;
    pitch: number;
  }

  export interface RTFStyle {
    font?: RTFFont;
    foreground?: RTFColor;
    background?: RTFColor;
    align?: 'left' | 'center' | 'right' | 'justify';
    fontSize?: number;
  }

  export interface RTFDocument {
    parent?: RTFDocument;
    content: (RTFParagraph | RTFSpan)[];
    fonts: RTFFont[];
    colors: RTFColor[];
    style: RTFStyle;
    ignorable: boolean;
    charset: string;
    marginLeft: number;
    marginRight: number;
    marginBottom: number;
    marginTop: number;
    type: string;
  }

  interface RTFParser {
    string(
      rtfString: string,
      callback: (err: Error | null, doc: RTFDocument) => void
    ): void;

    // Additional methods that might be available
    parseString?: (rtfString: string) => Promise<RTFDocument>;
    file?: (
      filePath: string,
      callback: (err: Error | null, doc: RTFDocument) => void
    ) => void;
  }

  const parser: RTFParser;
  export default parser;
}
