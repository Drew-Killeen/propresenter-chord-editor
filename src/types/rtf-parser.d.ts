declare module 'rtf-parser' {
  interface RTFContent {
    value?: string;
    content?: RTFContent[];
    [key: string]: any;
  }

  interface RTFDocument {
    content: RTFContent[];
    [key: string]: any;
  }

  interface RTFParser {
    string(
      rtfString: string,
      callback: (err: Error | null, doc: RTFDocument) => void
    ): void;
  }

  const parser: RTFParser;
  export = parser;
}
