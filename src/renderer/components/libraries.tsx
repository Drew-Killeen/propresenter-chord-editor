export default function Libraries({
  libraries,
  currentLibrary,
  selectLibrary,
}: {
  libraries: string[];
  currentLibrary: string;
  selectLibrary: (libraryName: string) => Promise<void>;
}) {
  const libraryElements = libraries.map((library) => {
    return (
      <div key={library}>
        <button
          type="button"
          className={`${
            currentLibrary === library ? 'selected-library' : ''
          } list-button`}
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
