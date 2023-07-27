const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  sendMessage: (message) => ipcRenderer.send('message', message),
  getLyrics: (callback) => ipcRenderer.on('getLyrics', callback),
  getGroups: (callback) => ipcRenderer.on('getGroups', callback),
  getLibraries: (callback) => ipcRenderer.on('getLibraries', callback),
});
