export default function Documents({ documents }: any) {
  const selectDocument = (documentName: string) => {
    window.api.selectDocument(documentName);
  };

  const documentElements = documents.map((document: string) => {
    return (
      <>
        <button
          type="button"
          onClick={() => {
            selectDocument(document);
          }}
        >
          {document}
        </button>
        <br />
      </>
    );
  });

  return (
    <div className="documents">
      <div className="documents-header header">Documents</div>
      <div className="documents-content">{documentElements}</div>
    </div>
  );
}
