import path from 'path';
import { load, Type } from 'protobufjs';
import fs from 'fs';
import { PresentationDocument } from 'types/presentation';

export class PresentationManager {
  private protoMessageType: Type | null = null;

  private readonly protoPath: string;

  constructor() {
    this.protoPath =
      process.env.NODE_ENV === 'production'
        ? path.join(process.resourcesPath, 'assets/proto/propresenter.proto')
        : 'assets/proto/propresenter.proto';
  }

  private async loadProto(): Promise<Type> {
    if (this.protoMessageType) {
      return this.protoMessageType;
    }

    const proto = await load(this.protoPath);
    this.protoMessageType = proto.lookupType('rv.data.Presentation');
    return this.protoMessageType;
  }

  async load(filepath: string): Promise<PresentationDocument> {
    const buffer = fs.readFileSync(filepath);
    const presentationBuffer = new Uint8Array(buffer);

    const messageType = await this.loadProto();
    const message = messageType.decode(presentationBuffer);

    return messageType.toObject(message) as PresentationDocument;
  }

  async save(
    presentation: PresentationDocument,
    filepath: string
  ): Promise<void> {
    const messageType = await this.loadProto();

    const errMsg = messageType.verify(presentation);
    if (errMsg) {
      throw new Error(`Presentation validation failed: ${errMsg}`);
    }

    const buffer = messageType.encode(presentation).finish();

    return new Promise((resolve, reject) => {
      fs.writeFile(filepath, buffer, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
