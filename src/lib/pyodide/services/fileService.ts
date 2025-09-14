import type { PyodideInterface } from 'pyodide';

const BASE_PATH = process.env.NEXT_PUBLIC_PYODIDE_FS_PATH!;

type FileServiceEvent = 'change';

type Listener = () => void;

export class FileService {
  private listeners: Record<FileServiceEvent, Set<Listener>> = {
    change: new Set(),
  };

  constructor(private readonly _api: PyodideInterface) {}

  subscribe(event: FileServiceEvent, listener: Listener) {
    this.listeners[event].add(listener);
    return () => this.listeners[event].delete(listener); // unsubscribe用
  }

  private emit(event: FileServiceEvent) {
    this.listeners[event].forEach((l) => l());
  }

  async uploads(files: File[]) {
    await Promise.all(
      files.map(async (f) => {
        const buffer = await f.arrayBuffer();
        const path = `${BASE_PATH}/${f.name}`;
        this._api.FS.writeFile(path, new Uint8Array(buffer));
      }),
    );
    this.emit('change');
  }

  async remove(name: string) {
    const path = `${BASE_PATH}/${name}`;
    this._api.FS.unlink(path);
    this.emit('change');
  }

  list(dirPath: string = BASE_PATH) {
    return this._api.FS.readdir(dirPath).filter(
      (name) => name !== '.' && name !== '..',
    );
  }

  async listFiles(): Promise<File[]> {
    const fileNames: string[] = this._api.FS.readdir(BASE_PATH).filter(
      (name) => name !== '.' && name !== '..',
    );

    const files: File[] = [];
    for (const name of fileNames) {
      const uint8 = await this._api.runPythonAsync(`
import js
with open("${BASE_PATH}/${name}", "rb") as f:
    data = f.read()
js.Uint8Array.new(data)
    `);
      files.push(new File([uint8], name));
    }
    return files;
  }
}
