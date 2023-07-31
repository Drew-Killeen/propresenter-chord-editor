export default function Documents({ children, documents }: any) {
  const selectDocument = (documentName) => {
    api.selectDocument(documentName);
  };

  const documentElements = documents.map((document) => {
    return (
      <div className="documents-content">
        <button
          type="button"
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
      {documentElements}

      <div className="documents-footer">{children}</div>
    </div>
  );
}
