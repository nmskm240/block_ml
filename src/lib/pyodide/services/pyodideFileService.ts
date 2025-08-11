import type { PyodideAPI } from 'pyodide';

const BASE_PATH = process.env.NEXT_PUBLIC_PYODIDE_FS_PATH!;

export default class PyodideFileService {
  constructor(private readonly _api: PyodideAPI) {}

  async uploads(files: File[]) {
    await Promise.all(
      files.map(async (f) => {
        const buffer = await f.arrayBuffer();
        const path = `${BASE_PATH}/${f.name}`;
        this._api.FS.writeFile(path, new Uint8Array(buffer));
      })
    );
  }

  async remove(name: string) {
    const path = `${BASE_PATH}/${name}`;
    this._api.FS.unlink(path);
  }

  list(dirPath: string = BASE_PATH) {
    return this._api.FS.readdir(dirPath).filter(
      (name) => name !== '.' && name !== '..'
    );
  }
}
