import { ElectronAPI } from '../main/preload';

declare global {
  interface Window {
    api: ElectronAPI;
  }
}
