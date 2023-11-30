/* eslint-disable no-plusplus */
import path from 'path';
import { load } from 'protobufjs';
import fs from 'fs';
import mergeChords from './merge-chords';

export default async function saveChords({
  originalPresentation,
  newChords,
  filePath,
}: {
  originalPresentation: any;
  newChords: any;
  filePath: string;
}) {
  // Merge original presentation with new chords
  const mergedPresentation = mergeChords(originalPresentation, newChords);

  // Load proto files
  let protoPath = 'assets/proto/propresenter.proto';
  if (process.env.NODE_ENV === 'production') {
    protoPath = path.join(
      process.resourcesPath,
      'assets/proto/propresenter.proto'
    );
  }
  const proto = await load(protoPath);
  const messageType = proto.lookupType('rv.data.Presentation');

  // Verify validity of merged presentation
  const errMsg = messageType.verify(mergedPresentation);
  if (errMsg) throw Error(errMsg);

  // Convert to protobuf and write to file
  const buffer = messageType.encode(mergedPresentation).finish();

  fs.writeFile(filePath, buffer, (err) => {
    if (err) console.log(err);
    else {
      console.log('File written successfully');
    }
  });
}
