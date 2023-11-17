/* eslint-disable no-plusplus */
/* eslint-disable react/require-default-props */

export default function Slide({
  id,
  label = '',
  lyrics,
  cueUuid,
  onEdit,
}: {
  id: number;
  label?: string;
  lyrics: string;
  cueUuid: string;
  onEdit: (newLyrics: string, cueUuid: string) => void;
}) {
  const insertNewChord = (event: any) => {
    if (event.key === '[') {
      event.preventDefault();
      const cursorPosition = event.target.selectionStart;
      const textBeforeCursor = event.target.value.substring(0, cursorPosition);
      const textAfterCursor = event.target.value.substring(cursorPosition);
      const newText = `${textBeforeCursor}[]${textAfterCursor}`;
      onEdit(newText, cueUuid);
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
        value={lyrics}
        onChange={(event) => onEdit(event.target.value, cueUuid)}
        onKeyDown={insertNewChord}
      />
    </div>
  );
}
