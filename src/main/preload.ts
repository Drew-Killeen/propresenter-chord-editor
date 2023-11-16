const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  selectNewFilePath: (message) =>
    ipcRenderer.send('selectNewFilePath', message),
  selectLibrary: (library) => ipcRenderer.invoke('selectLibrary', library),
  selectDocument: (document) => ipcRenderer.invoke('selectDocument', document),
  getLibraries: (callback) => ipcRenderer.on('getLibraries', callback),
  filePath: (callback) => ipcRenderer.on('filePath', callback),
  filepathIsValid: (callback) => ipcRenderer.on('filepathIsValid', callback),
});
