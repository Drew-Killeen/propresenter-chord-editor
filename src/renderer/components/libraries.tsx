export default function Libraries({
  libraries,
  selectLibrary,
}: {
  libraries: string[];
  selectLibrary: (libraryName: string) => Promise<void>;
}) {
  const libraryElements = libraries.map((library) => {
    return (
      <div key={library}>
        <button
          type="button"
          className="list-button"
          onClick={() => selectLibrary(library)}
        >
          {library}
        </button>
        <br />
      </div>
    );
  });

  return (
    <div className="libraries">
      <div className="libraries-header header">Libraries</div>
      <div className="libraries-content">{libraryElements}</div>
    </div>
  );
}
