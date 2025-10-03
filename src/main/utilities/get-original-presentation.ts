import fs from 'fs';
import { load } from 'protobufjs';
import path from 'path';
import type { PresentationDocument } from '../../types/presentation';

export default async function getOriginalPresentation(
  filepath: string
): Promise<PresentationDocument> {
  let presentationBuffer: Uint8Array;

  try {
    const buffer = fs.readFileSync(filepath);
    presentationBuffer = new Uint8Array(buffer);
  } catch (err: unknown) {
    console.log(err);
    throw new Error('Failed to read presentation file');
  }

  let protoPath = 'assets/proto/propresenter.proto';

  if (process.env.NODE_ENV === 'production') {
    protoPath = path.join(
      process.resourcesPath,
      'assets/proto/propresenter.proto'
    );
  }

  const proto = await load(protoPath);

  const messageType = proto.lookupType('rv.data.Presentation');

  const message = messageType.decode(presentationBuffer);

  const outputObject = messageType.toObject(message);

  return outputObject as PresentationDocument;
}
