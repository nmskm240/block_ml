// MEMO: JestではFileがないため対策用
export class MockFile implements File {
  readonly name: string;
  readonly type: string;
  private _buffer: Uint8Array;
  readonly size: number;

  readonly lastModified = Date.now();
  readonly webkitRelativePath = '';

  constructor(name: string, content: string | Buffer, type = 'text/plain') {
    this.name = name;
    this.type = type;
    const buf = content instanceof Buffer ? content : Buffer.from(content);
    this._buffer = new Uint8Array(buf);
    this.size = this._buffer.length;
  }
  bytes(): Promise<Uint8Array<ArrayBuffer>> {
    const { buffer, byteOffset, byteLength } = this._buffer;
    const view = new Uint8Array(
      buffer,
      byteOffset,
      byteLength
    ) as unknown as Uint8Array<ArrayBuffer>;
    return Promise.resolve(view);
  }

  text(): Promise<string> {
    return Promise.resolve(this._buffer.toString());
  }

  arrayBuffer(): Promise<ArrayBuffer> {
    return Promise.resolve(
      this._buffer.buffer.slice(
        this._buffer.byteOffset,
        this._buffer.byteOffset + this._buffer.byteLength
      ) as ArrayBuffer
    );
  }

  slice(start?: number, end?: number, contentType?: string): Blob {
    throw new Error('slice not implemented');
  }

  stream(): any {
    throw new Error('stream not implemented in MockFile');
  }
}
