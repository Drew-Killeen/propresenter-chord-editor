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
export function getDirectories(source: fs.PathLike) {
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
    return Promise.resolve('');
  }
  return `${filePath.filePaths[0]}/Libraries`;
}

// TODO: Convert function to async
export function getDocuments(source: fs.PathLike) {
  const txtFiles = fs.readdirSync(source);
  return txtFiles.filter((el) => path.extname(el) === '.pro');
}
