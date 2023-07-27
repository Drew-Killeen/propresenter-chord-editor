export default function Libraries({ libraries }: { libraries: string[] }) {
  const libraryElements = libraries.map((library) => {
    return <div className="libraries-content">{library}</div>;
  });

  return (
    <div className="libraries">
      <div className="libraries-header header">Libraries</div>
      {libraryElements}
    </div>
  );
}
