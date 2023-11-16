import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import Group from './components/group';
import Libraries from './components/libraries';
import Documents from './components/documents';
import Alert from './components/alert';

declare global {
  interface Window {
    api: any;
  }
}

function Main() {
  const [lyric, setLyric] = useState<any>();
  const [groups, setGroups] = useState<any>({});
  const [chords, setChords] = useState<any>({});
  const [libraries, setLibraries] = useState<string[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);
  const [filePath, setFilePath] = useState<string>('none');
  const [showFilepathAlert, setShowFilepathAlert] = useState<boolean>(false);

  window.api.getLibraries((_event: any, value: string[]) => {
    setLibraries(value);
  });

  window.api.filePath((_event: any, value: string) => {
    setFilePath(value);
  });

  window.api.filepathIsValid((_event: any, value: string) => {
    setShowFilepathAlert(!value);
  });

  const selectNewFilePath = () => {
    window.api.selectNewFilePath();
  };

  const saveDocument = () => {
    console.log('not saved');
  };

  const selectLibrary = async (libraryName: string) => {
    const docs = await window.api.selectLibrary(libraryName);
    setDocuments(docs);
  };

  const selectDocument = async (documentName: string) => {
    const doc = await window.api.selectDocument(documentName);
    setLyric(doc.lyrics);
    setGroups(doc.groups);
    setChords(doc.chords);
  };

  const groupElements = Object.keys(groups).map((key: string) => {
    return (
      <Group
        lyrics={lyric}
        key={groups[key].group.uuid.string}
        cueGroup={groups[key]}
        chords={chords}
      />
    );
  });

  return (
    <div id="main">
      {showFilepathAlert && (
        <Alert
          onClose={() => {
            setShowFilepathAlert(false);
            selectNewFilePath();
          }}
          buttonLabel="Select"
          alertLabel="No ProPresenter folder found."
        >
          To get started, select the ProPresenter folder from your system.
        </Alert>
      )}
      <div className="left-panel panel">
        <Libraries libraries={libraries} selectLibrary={selectLibrary} />
        <Documents documents={documents} selectDocument={selectDocument} />
        <div className="button-area">
          <div className="filepath-header">Current file path: </div>
          <div className="button-area-content">
            <div className="filepath">{filePath}</div>
            <button type="button" onClick={selectNewFilePath}>
              Change file path
            </button>
            <button type="button" onClick={saveDocument}>
              Save
            </button>
          </div>
        </div>
      </div>
      <div className="center-panel panel">{groupElements}</div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}
