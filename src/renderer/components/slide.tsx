import { useState } from 'react';
import isEditValid from './isEditValid';

export default function Slide({
  id,
  label = '',
  chords = [{}],
  lyrics,
}: {
  id: number;
  label?: string;
  chords?: any;
  lyrics: string;
}) {
  let defaultText = lyrics;

  // Insert chord in lyrics
  for (let i = 0; i < chords.length; i++) {
    if (chords[i].chord) {
      let chordPosition = 0;
      if ('start' in chords[i].range) {
        chordPosition = chords[i].range.start;
      }
      defaultText = `${defaultText.slice(0, chordPosition)}[${
        chords[i].chord
      }]${defaultText.slice(chordPosition)}`;
    }
  }

  const [editableText, setEditableText] = useState<string>(defaultText);

  const checkEdit = (event: any) => {
    if (isEditValid(lyrics, event.target.value)) {
      setEditableText(event.target.value);
    }
  };

  const insertNewChord = (event: any) => {
    if (event.key === '[') {
      event.preventDefault();
      const cursorPosition = event.target.selectionStart;
      const textBeforeCursor = event.target.value.substring(0, cursorPosition);
      const textAfterCursor = event.target.value.substring(cursorPosition);
      const newText = `${textBeforeCursor}[]${textAfterCursor}`;
      setEditableText(newText);
    }
  };

  return (
    <div className="slide">
      <div className="slide-header header">
        <div className="slide-header-id">{id}.</div>
        <div className="slide-header-label">{label}</div>
        <div className="empty-spacer" />
      </div>
      <textarea
        className="slide-body"
        value={editableText}
        onChange={checkEdit}
        onKeyDown={insertNewChord}
      />
    </div>
  );
}
