/* eslint-disable no-plusplus */
/* eslint-disable react/require-default-props */
import { useLayoutEffect, useRef } from 'react';
import isEditValid from 'renderer/isEditValid';

export default function Slide({
  id,
  label = '',
  lyricsPlusChords,
  originalLyrics,
  cueUuid,
  onEdit,
}: {
  id: number;
  label?: string;
  lyricsPlusChords: string;
  originalLyrics: string;
  cueUuid: string;
  onEdit: (newLyrics: string, cueUuid: string) => void;
}) {
  const textareaRef = useRef(null);

  useLayoutEffect(() => {
    // Reset height - important to shrink on delete
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      // Set height
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight - 20
      }px`;
    }
  }, [lyricsPlusChords]);

  const insertNewChord = (event: any) => {
    if (event.key === '[') {
      event.preventDefault();
      const cursorPosition = event.target.selectionStart;
      const textBeforeCursor = event.target.value.substring(0, cursorPosition);
      const textAfterCursor = event.target.value.substring(cursorPosition);
      const newText = `${textBeforeCursor}[]${textAfterCursor}`;
      onEdit(newText, cueUuid);

      // Preserve cursor position
      setTimeout(() => {
        event.target.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
      }, 0);
    }
  };

  const onChange = (event: any) => {
    event.preventDefault();
    const newLyrics = event.target.value;
    let cursorPosition = event.target.selectionStart - 1;
    if (isEditValid(originalLyrics, newLyrics)) {
      onEdit(newLyrics, cueUuid);
      cursorPosition += 1;
    }

    // Preserve cursor position
    setTimeout(() => {
      event.target.setSelectionRange(cursorPosition, cursorPosition);
    }, 0);
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
        ref={textareaRef}
        value={lyricsPlusChords}
        onChange={onChange}
        onKeyDown={insertNewChord}
      />
    </div>
  );
}
