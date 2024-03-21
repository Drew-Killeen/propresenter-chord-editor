/* eslint-disable react/require-default-props */
import { useLayoutEffect, useRef } from 'react';
import editChord from 'renderer/utilities/edit-chord';

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

  const onChange = (event: any) => {
    editChord(event, lyricsPlusChords, originalLyrics, cueUuid, onEdit);

    // Preserve cursor position
    // setTimeout(() => {
    //   event.target.setSelectionRange(cursorPosition, cursorPosition);
    // }, 0);
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
      />
    </div>
  );
}
