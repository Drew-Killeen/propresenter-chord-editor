import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import Slide from './slide';
import Group from './group';

function Main() {
  const [lyric, setLyric] = useState<string>('');

  window.api.testMessage((event, value) => {
    console.log(value);
    setLyric(value);
  });

  const sendMessage = () => {
    api.sendMessage('test');
  };
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
      <div className="center-panel panel">
        <Group>
          <Slide id={1} label="First Slide">
            {lyric}
          </Slide>
          <Slide id={2}>{lyric}</Slide>
          <Slide id={3}>{lyric}</Slide>
        </Group>
      </div>
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
