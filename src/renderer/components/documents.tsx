export default function Documents({
  documents,
  selectDocument,
}: {
  documents: any;
  selectDocument: (documentName: string) => Promise<void>;
}) {
  const documentElements = documents.map((document: string) => {
    return (
      <div key={document}>
        <button
          type="button"
          className="list-button"
          onClick={() => {
            selectDocument(document);
          }}
        >
          {document}
        </button>
      </div>
    );
  });

  return (
    <div className="documents">
      <div className="documents-header header">Documents</div>
      <div className="documents-content">{documentElements}</div>
    </div>
  );
}
