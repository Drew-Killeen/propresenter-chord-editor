import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import Slide from './slide';
import Group from './group';

function Main() {
  const [lyric, setLyric] = useState<any>();
  const [groups, setGroups] = useState<any>({});

  window.api.getLyrics((event, value) => {
    setLyric(value);
  });

  window.api.getGroups((event, value) => {
    setGroups(value);
  });

  const sendMessage = () => {
    api.sendMessage('test');
  };

  const groupElements = Object.keys(groups).map((key: any) => {
    return (
      <Group key={groups[key].uuid.string} cueGroup={groups[key]}>
        <Slide id={1} label="First Slide">
          {lyric}
        </Slide>
        <Slide id={2}>{lyric}</Slide>
        <Slide id={3}>{lyric}</Slide>
      </Group>
    );
  });

  // const groupElements = <></>;

  return (
    <div id="main">
      <div className="left-panel panel">
        <div className="libraries">
          <div className="libraries-header header">Libraries</div>
          <div className="libraries-content">Default</div>
        </div>
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
