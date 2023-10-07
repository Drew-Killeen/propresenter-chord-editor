export default function Slide({
  id,
  label = '',
  chords = [{}],
  lyrics,
}: {
  id: number;
  label?: string;
  chords?: any;
  lyrics: any;
}) {
  let editableText = lyrics;

  for (let i = 0; i < chords.length; i++) {
    if (chords[i].chord) {
      editableText = `${editableText.slice(0, chords[i].range.end)}[${
        chords[i].chord
      }]${editableText.slice(chords[i].range.end)}`;
    }
  }

  return (
    <div className="slide">
      <div className="slide-header header">
        <div className="slide-header-id">{id}.</div>
        <div className="slide-header-label">{label}</div>
        <div className="empty-spacer" />
      </div>
      <div className="slide-body" contentEditable>
        {editableText}
      </div>
    </div>
  );
}
