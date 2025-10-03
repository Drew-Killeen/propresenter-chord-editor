/* eslint global-require: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import fs from 'fs';
import os from 'os';
import Store from 'electron-store';
import MenuBuilder from './menu';
import {
  getDirectories,
  getDocuments,
  resolveHtmlPath,
  selectFilePath,
} from './utilities/util';
import getLyrics from './utilities/get-lyrics';
import saveChords from './utilities/save-chords';
import getOriginalPresentation from './utilities/get-original-presentation';
import doLyricsContainBracket from './utilities/does-lyric-contain-bracket';

const store = new Store();

let mainWindow: BrowserWindow | null = null;

let filePath = store.get('filePath') as string;

if (!filePath) {
  filePath = `${os.homedir()}/Documents/ProPresenter/Libraries`;
}

let currentLibrary = '';

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  ipcMain.on('selectNewFilePath', () => {
    selectFilePath()
      .then((newFilePath) => {
        if (!newFilePath.includes('ProPresenter')) {
          mainWindow?.webContents.send('isFilepathValid', false);
        } else {
          store.set('filePath', newFilePath);
          filePath = newFilePath;
          const libraryList: string[] = getDirectories(filePath);
          mainWindow?.webContents.send('filePath', filePath);
          mainWindow?.webContents.send('getLibraries', libraryList);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  ipcMain.handle('saveDocument', async (event, { newChords, documentName }) => {
    let originalPresentation;
    try {
      originalPresentation = await getOriginalPresentation(
        `${filePath}/${currentLibrary}/${documentName}`
      );
    } catch (err: unknown) {
      console.log(err);
      return false;
    }

    try {
      await saveChords({
        originalPresentation,
        newChords,
        filePath: `${filePath}/${currentLibrary}/${documentName}`,
      });
    } catch (err: unknown) {
      console.log(err);
      return false;
    }

    return true;
  });

  ipcMain.handle('selectLibrary', async (event, library) => {
    currentLibrary = library;
    const documents = getDocuments(`${filePath}/${currentLibrary}`);
    return documents;
  });

  ipcMain.handle('selectDocument', async (event, document) => {
    const doc = await getLyrics(`${filePath}/${currentLibrary}/${document}`);

    if (doLyricsContainBracket(doc.lyrics)) {
      return { doc, error: 'Lyric contains bracket' };
    }

    const response = { doc };
    return response;
  });

  mainWindow.on('ready-to-show', () => {
    let libraryList: string[];

    if (fs.existsSync(filePath)) {
      console.log('Directory exists.');
      libraryList = getDirectories(filePath);
      mainWindow?.webContents.send('filePath', filePath);
      mainWindow?.webContents.send('getLibraries', libraryList);
    } else {
      console.log('Directory does not exist.');
      mainWindow?.webContents.send('isFilepathValid', false);
    }

    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
