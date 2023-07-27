import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import Slide from './components/slide';
import Group from './components/group';
import Libraries from './components/libraries';

function Main() {
  const [lyric, setLyric] = useState<any>();
  const [groups, setGroups] = useState<any>({});
  const [libraries, setLibraries] = useState<string[]>([]);

  window.api.getLyrics((event, value) => {
    setLyric(value);
  });

  window.api.getGroups((event, value) => {
    setGroups(value);
  });

  window.api.getLibraries((event, value) => {
    setLibraries(value);
  });

  const sendMessage = () => {
    api.sendMessage('test');
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
        <div className="documents">
          <div className="documents-header header">Documents</div>
          <div className="documents-content">Default</div>
          <div className="button-area">
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
