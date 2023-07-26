export default function Group({
  cueGroup,
  children,
}: {
  cueGroup: any;
  children: any;
}) {
  const label: string = cueGroup.name;

  return (
    <div className="group">
      <div className="group-label">
        <div className="group-label-text">{label}</div>
        <div className="color-marker" />
      </div>
      <div className="slides">{children}</div>
    </div>
  );
}
