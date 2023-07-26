const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  sendMessage: (message) => ipcRenderer.send('message', message),
  testMessage: (callback) => ipcRenderer.on('test', callback),
});
