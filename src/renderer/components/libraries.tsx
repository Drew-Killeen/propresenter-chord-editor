export default function Libraries({ libraries }: { libraries: string[] }) {
  const selectLibrary = (libraryName: string) => {
    window.api.selectLibrary(libraryName);
  };

  const libraryElements = libraries.map((library) => {
    return (
      <>
        <button type="button" onClick={() => selectLibrary(library)}>
          {library}
        </button>
        <br />
      </>
    );
  });

  return (
    <div className="libraries">
      <div className="libraries-header header">Libraries</div>
      <div className="libraries-content">{libraryElements}</div>
    </div>
  );
}
