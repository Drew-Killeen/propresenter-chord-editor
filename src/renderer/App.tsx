import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import Group from './components/group';
import Libraries from './components/libraries';
import Documents from './components/documents';

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

  window.api.getLibraries((_event: any, value: string[]) => {
    setLibraries(value);
  });

  window.api.filePath((_event: any, value: string) => {
    setFilePath(value);
  });

  const sendMessage = () => {
    window.api.selectNewFilePath();
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
      <div className="left-panel panel">
        <Libraries libraries={libraries} selectLibrary={selectLibrary} />
        <Documents documents={documents} selectDocument={selectDocument} />
        <div className="button-area">
          <div className="filepath-header">Current file path: </div>
          <div className="button-area-content">
            <div className="filepath">{filePath}</div>
            <button type="button" onClick={sendMessage}>
              Change file path
            </button>
            <button type="button" onClick={sendMessage}>
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
