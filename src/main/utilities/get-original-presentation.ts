import fs from 'fs';
import { load } from 'protobufjs';
import path from 'path';

export default async function getLyrics(filepath: string): Promise<{
  [k: string]: any;
}> {
  let data: any;

  try {
    data = fs.readFileSync(filepath);
  } catch (err: unknown) {
    console.log(err);
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

  const message = messageType.decode(data);

  const outputObject = messageType.toObject(message);

  return outputObject;
}
