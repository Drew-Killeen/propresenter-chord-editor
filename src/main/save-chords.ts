/* eslint-disable no-plusplus */
import path from 'path';
import mergeChords from './merge-chords';

export default async function saveChords(
  originalPresentation: any,
  newChords: any
) {
  // Merge original presentation with new chords
  const mergedPresentation = mergeChords(originalPresentation, newChords);

  console.log(mergedPresentation);

  // Load proto files
  // let protoPath = 'assets/proto/propresenter.proto';
  // if (process.env.NODE_ENV === 'production') {
  //   protoPath = path.join(
  //     process.resourcesPath,
  //     'assets/proto/propresenter.proto'
  //   );
  // }
  // const proto = await load(protoPath);
  // const messageType = proto.lookupType('rv.data.Presentation');

  // // Verify validity of merged presentation
  // const errMsg = messageType.verify(mergedPresentation);

  // // Convert to protobuf
  // const inputProtobuf = messageType.fromObject(originalPresentation);
}
