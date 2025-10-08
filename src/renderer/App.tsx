import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import { Chords, Groups, Lyrics } from 'types/presentation';
import { IpcRendererEvent } from 'electron';
import Group from './components/group';
import Libraries from './components/libraries';
import Documents from './components/documents';
import Alert from './components/alert';
import insertChords from './utilities/insert-chords';
import extractChords from './utilities/extract-chords';

type AlertType = 'filepath' | 'save' | 'bracket' | null;

function Main() {
  const [lyrics, setLyrics] = useState<Lyrics>();
  const [editableLyrics, setEditableLyrics] = useState<Lyrics>();
  const [groups, setGroups] = useState<Groups>({});
  const [libraries, setLibraries] = useState<string[]>([]);
  const [documentNames, setDocumentNames] = useState<string[]>([]);
  const [filePath, setFilePath] = useState<string>('none');
  const [alert, setAlert] = useState<{ type: AlertType; success?: boolean }>({
    type: null,
  });
  const [currentDocumentName, setCurrentDocumentName] = useState<string>('');
  const [currentLibraryName, setCurrentLibraryName] = useState<string>('');

  useEffect(() => {
    window.api.getLibraries((_event: IpcRendererEvent, value: string[]) => {
      setLibraries(value);
    });

    window.api.filePath((_event: IpcRendererEvent, value: string) => {
      setFilePath(value);
    });

    window.api.isFilepathValid((_event: IpcRendererEvent, value: boolean) => {
      if (!value) setAlert({ type: 'filepath' });
    });
  }, []);

  const selectNewFilePath = () => {
    window.api.selectNewFilePath();
  };

  const saveDocument = async () => {
    if (!currentDocumentName) return;
    const lyricsToProcess = { ...editableLyrics };
    const newChords: Chords = extractChords(lyricsToProcess);
    const response = await window.api.saveDocument({
      newChords,
      documentName: currentDocumentName,
    });
    setAlert({ type: 'save', success: response });
  };

  const selectLibrary = async (libraryName: string) => {
    const docs = await window.api.selectLibrary(libraryName);
    setCurrentLibraryName(libraryName);
    setDocumentNames(docs);
  };

  const selectDocument = async (documentName: string) => {
    const response = await window.api.selectDocument(documentName);

    if (response.error) {
      console.error(response.error);
      setCurrentDocumentName('');
      setLyrics({});
      setGroups({});
      setEditableLyrics({});

      if (response.error === 'Lyric contains bracket') {
        setAlert({ type: 'bracket' });
      }

      return;
    }

    const { doc } = response;
    setCurrentDocumentName(documentName);
    setLyrics(doc.lyrics);
    setGroups(doc.groups);
    setEditableLyrics(insertChords(doc.lyrics, doc.chords));
  };

  const updateLyrics = (newLyrics: string, cueUuid: string) => {
    setEditableLyrics((prev) => ({ ...prev, [cueUuid]: newLyrics }));
  };

  const groupElements =
    lyrics && editableLyrics
      ? Object.values(groups).map((cueGroup) => (
          <Group
            lyricsPlusChords={editableLyrics}
            originalLyrics={lyrics}
            key={cueGroup.group.uuid.string}
            cueGroup={cueGroup}
            onEdit={updateLyrics}
          />
        ))
      : [];

  const alertConfig = {
    filepath: {
      label: 'No ProPresenter folder found.',
      buttonLabel: 'Select',
      content:
        'To get started, select the ProPresenter folder from your system.',
      onClose: () => {
        setAlert({ type: null });
        selectNewFilePath();
      },
    },
    save: {
      label: alert.success ? 'Save successful!' : 'Save failed.',
      buttonLabel: 'Dismiss',
      content: alert.success
        ? 'Your changes have been saved.'
        : 'Error saving file. Please try again.',
      onClose: () => setAlert({ type: null }),
    },
    bracket: {
      label: 'Error loading document',
      buttonLabel: 'Dismiss',
      content:
        'This document contains a bracket. Documents with brackets are not currently supported. Please remove the bracket and try again.',
      onClose: () => setAlert({ type: null }),
    },
  };

  const currentAlert = alert.type ? alertConfig[alert.type] : null;

  return (
    <div id="main">
      {currentAlert && (
        <Alert
          onClose={currentAlert.onClose}
          buttonLabel={currentAlert.buttonLabel}
          alertLabel={currentAlert.label}
        >
          {currentAlert.content}
        </Alert>
      )}
      <div className="left-panel panel">
        <Libraries
          libraries={libraries}
          currentLibrary={currentLibraryName}
          selectLibrary={selectLibrary}
        />
        <Documents
          documentNames={documentNames}
          currentDocument={currentDocumentName}
          selectDocument={selectDocument}
        />
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
