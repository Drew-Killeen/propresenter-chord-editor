export default function Libraries({ libraries }: { libraries: string[] }) {
  const selectLibrary = (libraryName) => {
    api.selectLibrary(libraryName);
  };

  const libraryElements = libraries.map((library) => {
    return (
      <div className="libraries-content">
        <button type="button" onClick={() => selectLibrary(library)}>
          {library}
        </button>
      </div>
    );
  });

  return (
    <div className="libraries">
      <div className="libraries-header header">Libraries</div>
      {libraryElements}
    </div>
  );
}
