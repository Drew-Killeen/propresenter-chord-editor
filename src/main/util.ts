/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import fs from 'fs';
import { dialog } from 'electron';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

// TODO: Convert function to async
export function getDirectories(source) {
  return fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

export async function selectFilePath(): Promise<string> {
  const filePath = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  if (filePath.canceled) {
    await dialog.showMessageBox({
      message: 'ProPresenter directory not found.',
      type: 'error',
    });
    return selectFilePath();
  }
  if (!filePath.filePaths[0].includes('ProPresenter')) {
    await dialog.showMessageBox({
      message: 'Directory does not contain any ProPresenter files.',
      type: 'error',
    });
    return selectFilePath();
  }
  return filePath.filePaths[0] + '/Libraries';
}
