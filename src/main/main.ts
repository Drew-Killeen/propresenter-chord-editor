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
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { load } from 'protobufjs';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const parseRTF = require('rtf-parser');
const fs = require('fs');

let data: any;

const lyrics: any = {};
let groups: any = {};

try {
  data = fs.readFileSync('Glorious Day-Chords.pro');
} catch (err) {
  console.error(err);
}

load('proto/propresenter.proto', (err, root) => {
  if (err) {
    console.log(`Error: ${err}`);
    throw err;
  }

  const messageType = root.lookupType('rv.data.Presentation');

  const message = messageType.decode(data);

  const outputObject = messageType.toObject(message);

  fs.writeFile('test.json', JSON.stringify(outputObject.cueGroups), (error) => {
    console.log(error);
  });

  // Get group names and colors
  for (let i = 0; i < outputObject.cueGroups.length; i++) {
    groups[outputObject.cueGroups[i].group.uuid.string] =
      outputObject.cueGroups[i];
  }

  console.log(groups);

  // Build lyrics object
  for (let j = 0; j < outputObject.cues.length; j++) {
    const cueUuid: string = outputObject.cues[j].uuid.string;
    const textElement: any[] =
      outputObject.cues[j].actions[0].slide.presentation.baseSlide.elements[0]
        .element.text.rtfData;

    parseRTF.string(textElement, (err, doc) => {
      if (err) throw err;

      for (let i = 0; i < doc.content.length; i++) {
        if (Object.keys(doc.content[i]).includes('value')) {
          if (!lyrics[cueUuid]) {
            lyrics[cueUuid] = doc.content[i].value;
          } else {
            lyrics[cueUuid] = lyrics[cueUuid] + '<br/>' + doc.content[i].value;
          }
        } else if (!lyrics[cueUuid]) {
          lyrics[cueUuid] = doc.content[i].content[0].value;
        } else {
          lyrics[cueUuid] =
            lyrics[cueUuid] + '<br/>' + doc.content[i].content[0].value;
        }
      }

      // fs.writeFile('test.json', JSON.stringify(doc), (error) => {
      //   console.log(error);
      // });
    });
  }
});

ipcMain.on('message', (event, args) => {
  console.log(args);
});

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

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    mainWindow.webContents.send('getLyrics', lyrics);
    mainWindow.webContents.send('getGroups', groups);
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
