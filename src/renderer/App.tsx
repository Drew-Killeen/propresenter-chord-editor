import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function Main() {
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
        </div>
      </div>
      <div className="center-panel panel">
        <div className="group">
          <div className="group-label">
            <div className="group-label-text">Verse 1</div>
            <div className="color-marker" />
          </div>
          <div className="slides">
            <div className="slide">
              <div className="slide-header header">
                <div className="slide-header-id">1.</div>
                <div className="slide-header-label">Slide Label</div>
                <div className="empty-spacer" />
              </div>
              <div className="slide-body">
                I love you lord oh your mercy never fails me
              </div>
            </div>
            <div className="slide">
              <div className="slide-header header">
                <div className="slide-header-id">1.</div>
                <div className="slide-header-label">Slide Label</div>
                <div className="empty-spacer" />
              </div>
              <div className="slide-body">
                I love you lord oh your mercy never fails me
              </div>
            </div>
            <div className="slide">
              <div className="slide-header header">
                <div className="slide-header-id">1.</div>
                <div className="slide-header-label">Slide Label</div>
                <div className="empty-spacer" />
              </div>
              <div className="slide-body">
                I love you lord oh your mercy never fails me
              </div>
            </div>
          </div>
        </div>
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
