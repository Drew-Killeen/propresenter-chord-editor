const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  selectNewFilePath: (message) =>
    ipcRenderer.send('selectNewFilePath', message),
  selectLibrary: (library) => ipcRenderer.send('selectLibrary', library),
  getLyrics: (callback) => ipcRenderer.on('getLyrics', callback),
  getGroups: (callback) => ipcRenderer.on('getGroups', callback),
  getLibraries: (callback) => ipcRenderer.on('getLibraries', callback),
  filePath: (callback) => ipcRenderer.on('filePath', callback),
});
