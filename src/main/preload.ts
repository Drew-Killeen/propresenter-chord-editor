import { IpcRendererEvent } from 'electron';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  selectNewFilePath: (message: any) =>
    ipcRenderer.send('selectNewFilePath', message),
  saveDocument: (message: any) => ipcRenderer.invoke('saveDocument', message),
  selectLibrary: (library: any) => ipcRenderer.invoke('selectLibrary', library),
  selectDocument: (document: any) =>
    ipcRenderer.invoke('selectDocument', document),
  getLibraries: (callback: (event: IpcRendererEvent, ...args: any[]) => void) =>
    ipcRenderer.on('getLibraries', callback),
  filePath: (callback: (event: IpcRendererEvent, ...args: any[]) => void) =>
    ipcRenderer.on('filePath', callback),
  filepathIsValid: (
    callback: (event: IpcRendererEvent, ...args: any[]) => void
  ) => ipcRenderer.on('filepathIsValid', callback),
});
