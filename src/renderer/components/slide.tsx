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

  const checkEdit = (text: string) => {
    if (isEditValid(lyrics, text)) {
      setEditableText(text);
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
        onChange={(e) => checkEdit(e.target.value)}
      />
    </div>
  );
}
