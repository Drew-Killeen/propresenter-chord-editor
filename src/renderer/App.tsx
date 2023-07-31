import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import Slide from './components/slide';
import Group from './components/group';
import Libraries from './components/libraries';
import Documents from './components/documents';

function Main() {
  const [lyric, setLyric] = useState<any>();
  const [groups, setGroups] = useState<any>({});
  const [libraries, setLibraries] = useState<string[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);
  const [filePath, setFilePath] = useState<string>('none');

  window.api.getLyrics((event, value) => {
    setLyric(value);
  });

  window.api.getGroups((event, value) => {
    setGroups(value);
  });

  window.api.getLibraries((event, value) => {
    setLibraries(value);
  });
  window.api.getDocuments((event, value) => {
    setDocuments(value);
    console.log(value);
  });

  window.api.filePath((event, value) => {
    setFilePath(value);
  });

  const sendMessage = () => {
    api.selectNewFilePath();
  };

  const groupElements = Object.keys(groups).map((key: any) => {
    return (
      <Group
        lyrics={lyric}
        key={groups[key].group.uuid.string}
        cueGroup={groups[key]}
      />
    );
  });

  return (
    <div id="main">
      <div className="left-panel panel">
        <Libraries libraries={libraries} />
        <Documents documents={documents}>
          <div className="button-area">
            <div className="file-path">Current file path: {filePath}</div>
            <button type="button" onClick={sendMessage}>
              Change file path
            </button>
            <button type="button" onClick={sendMessage}>
              Save
            </button>
          </div>
        </Documents>
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
