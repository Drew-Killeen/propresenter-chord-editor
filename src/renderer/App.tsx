/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import Group from './components/group';
import Libraries from './components/libraries';
import Documents from './components/documents';
import Alert from './components/alert';
import isEditValid from './components/isEditValid';

declare global {
  interface Window {
    api: any;
  }
}

function Main() {
  const [lyrics, setLyrics] = useState<any>();
  const [editableLyrics, setEditableLyrics] = useState<any>();
  const [groups, setGroups] = useState<any>({});
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

  const insertChords = (originalLyrics: any, chords: any) => {
    const tempEditableLyrics = { ...originalLyrics };
    const cueUuids = Object.keys(originalLyrics);

    for (let j = 0; j < cueUuids.length; j++) {
      if (!chords[cueUuids[j]] || chords[cueUuids[j]].length === 0) continue;

      for (let i = 0; i < chords[cueUuids[j]].length; i++) {
        if (chords[cueUuids[j]][i].chord) {
          let chordPosition = 0;
          if ('start' in chords[cueUuids[j]][i].range) {
            chordPosition = chords[cueUuids[j]][i].range.start;
          }
          tempEditableLyrics[cueUuids[j]] = `${tempEditableLyrics[
            cueUuids[j]
          ].slice(0, chordPosition)}[${
            chords[cueUuids[j]][i].chord
          }]${tempEditableLyrics[cueUuids[j]].slice(chordPosition)}`;
        }
      }
    }

    return tempEditableLyrics;
  };

  const selectDocument = async (documentName: string) => {
    const doc = await window.api.selectDocument(documentName);
    setLyrics(doc.lyrics);
    setGroups(doc.groups);
    setEditableLyrics(insertChords(doc.lyrics, doc.chords));
  };

  const updateLyrics = (newLyrics: string, cueUuid: string) => {
    if (isEditValid(lyrics[cueUuid], newLyrics)) {
      const tempEditableLyrics = { ...editableLyrics };
      tempEditableLyrics[cueUuid] = newLyrics;
      setEditableLyrics(tempEditableLyrics);
    }
  };

  const groupElements = Object.keys(groups).map((key: string) => {
    return (
      <Group
        lyrics={editableLyrics}
        key={groups[key].group.uuid.string}
        cueGroup={groups[key]}
        onEdit={updateLyrics}
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
            <div className="button-area-spacer">
              <button
                className="button button-standard"
                type="button"
                onClick={selectNewFilePath}
              >
                Change file path
              </button>
              <button
                className="button button-standard"
                type="button"
                onClick={saveDocument}
              >
                Save
              </button>
            </div>
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
