export default function Documents({
  documents,
  currentDocument,
  selectDocument,
}: {
  documents: any;
  currentDocument: string;
  selectDocument: (documentName: string) => Promise<void>;
}) {
  const documentElements = documents.map((document: string) => {
    return (
      <div key={document}>
        <button
          type="button"
          className={`${
            currentDocument === document ? 'selected-document' : ''
          } list-button`}
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
