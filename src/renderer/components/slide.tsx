/* eslint-disable react/require-default-props */
import { useLayoutEffect, useRef } from 'react';
import isEditValid from 'renderer/utilities/is-edit-valid';
import findLengthToCharacter from '../utilities/find-length-to-character';

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

  // TODO: Refactor messy code
  const editChord = (event: any) => {
    let cursorPosition = event.target.selectionStart;

    if (event.key === '[') {
      event.preventDefault();
      const textBeforeCursor = event.target.value.substring(0, cursorPosition);
      const textAfterCursor = event.target.value.substring(cursorPosition);
      const newText = `${textBeforeCursor}[]${textAfterCursor}`;
      onEdit(newText, cueUuid);

      // Preserve cursor position
      setTimeout(() => {
        event.target.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
      }, 0);
    } else if (event.keyCode === 8) {
      // Check if we're deleting a chord via backspace key
      const textBeforeCursor = event.target.value.substring(0, cursorPosition);
      const textAfterCursor = event.target.value.substring(cursorPosition);

      if (textBeforeCursor.endsWith('[')) {
        event.preventDefault();
        const chordLength = findLengthToCharacter({
          text: textAfterCursor,
          character: ']',
          index: 0,
        });

        const newText = `${textBeforeCursor.substring(
          0,
          textBeforeCursor.length - 1
        )}${textAfterCursor.substring(
          chordLength + 1,
          textAfterCursor.length
        )}`;

        onEdit(newText, cueUuid);
        cursorPosition -= 1;
      } else if (textBeforeCursor.endsWith(']')) {
        event.preventDefault();
        const chordLength = findLengthToCharacter({
          text: textBeforeCursor,
          character: '[',
          direction: 'backward',
          index: textBeforeCursor.length - 2,
        });

        const newText = `${textBeforeCursor.substring(
          0,
          textBeforeCursor.length - chordLength - 2
        )}${textAfterCursor}`;

        onEdit(newText, cueUuid);
        cursorPosition = cursorPosition - chordLength - 2;
      }

      // Preserve cursor position
      setTimeout(() => {
        event.target.setSelectionRange(cursorPosition, cursorPosition);
      }, 0);
    } else if (event.keyCode === 46) {
      // Check if we're deleting a chord via delete key
      const textBeforeCursor = event.target.value.substring(0, cursorPosition);
      const textAfterCursor = event.target.value.substring(cursorPosition);

      if (textAfterCursor.startsWith(']')) {
        event.preventDefault();
        const chordLength = findLengthToCharacter({
          text: textBeforeCursor,
          character: '[',
          direction: 'backward',
          index: textBeforeCursor.length - 1,
        });

        const newText = `${textBeforeCursor.substring(
          0,
          textBeforeCursor.length - chordLength - 1
        )}${textAfterCursor.substring(1, textAfterCursor.length)}`;

        onEdit(newText, cueUuid);
        cursorPosition = cursorPosition - chordLength - 1;
      } else if (textAfterCursor.startsWith('[')) {
        event.preventDefault();
        const chordLength = findLengthToCharacter({
          text: textAfterCursor,
          character: ']',
          index: 1,
        });

        const newText = `${textBeforeCursor}${textAfterCursor.substring(
          chordLength + 2,
          textAfterCursor.length
        )}`;

        onEdit(newText, cueUuid);
      }

      // Preserve cursor position
      setTimeout(() => {
        event.target.setSelectionRange(cursorPosition, cursorPosition);
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
        onKeyDown={editChord}
      />
    </div>
  );
}
