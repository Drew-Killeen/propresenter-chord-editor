export default function Slide({
  id,
  label = '',
  children,
}: {
  id: number;
  label?: string;
  children: any;
}) {
  return (
    <div className="slide">
      <div className="slide-header header">
        <div className="slide-header-id">{id}.</div>
        <div className="slide-header-label">{label}</div>
        <div className="empty-spacer" />
      </div>
      <div className="slide-body" contentEditable>
        {children}
      </div>
    </div>
  );
}
