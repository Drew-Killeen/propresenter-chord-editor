import { IpcRendererEvent } from 'electron';

const { contextBridge, ipcRenderer } = require('electron');

const api = {
  selectNewFilePath: (message?: unknown) =>
    ipcRenderer.send('selectNewFilePath', message),
  saveDocument: (message: { newChords: unknown; documentName: string }) =>
    ipcRenderer.invoke('saveDocument', message),
  selectLibrary: (library: string) =>
    ipcRenderer.invoke('selectLibrary', library),
  selectDocument: (documentName: string) =>
    ipcRenderer.invoke('selectDocument', documentName),
  getLibraries: (
    callback: (event: IpcRendererEvent, value: string[]) => void
  ) => ipcRenderer.on('getLibraries', callback),
  filePath: (callback: (event: IpcRendererEvent, value: string) => void) =>
    ipcRenderer.on('filePath', callback),
  isFilepathValid: (
    callback: (event: IpcRendererEvent, value: boolean) => void
  ) => ipcRenderer.on('isFilepathValid', callback),
};

contextBridge.exposeInMainWorld('api', api);

export type ElectronAPI = typeof api;
