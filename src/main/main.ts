/* eslint-disable no-plusplus */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import fs from 'fs';
import os from 'os';
import MenuBuilder from './menu';
import { getDirectories, resolveHtmlPath, selectFilePath } from './util';
import getLyrics from './get-lyrics';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

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
      preload: path.join(__dirname, 'preload.ts'),
    },
  });

  ipcMain.on('selectNewFilePath', () => {
    selectFilePath()
      .then((filePath) => {
        const libraryList: string[] = getDirectories(filePath);
        mainWindow?.webContents.send('filePath', filePath);
        mainWindow?.webContents.send('getLibraries', libraryList);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  ipcMain.on('selectLibrary', (event, library) => {
    console.log(library);
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    let filePath = `${os.homedir()}\\Documents\\ProPresenter\\Libraries`;

    let libraryList: string[];

    if (fs.existsSync(filePath)) {
      console.log('Directory exists.');
      libraryList = getDirectories(filePath);
      mainWindow?.webContents.send('filePath', filePath);
      mainWindow?.webContents.send('getLibraries', libraryList);
    } else {
      console.log('Directory does not exist.');
      selectFilePath()
        .then((value) => {
          filePath = value;
          libraryList = getDirectories(filePath);
          mainWindow?.webContents.send('filePath', filePath);
          mainWindow?.webContents.send('getLibraries', libraryList);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    getLyrics('path', (err, lyrics, groups) => {
      mainWindow?.webContents.send('getLyrics', lyrics);
      mainWindow?.webContents.send('getGroups', groups);
    });

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

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
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
