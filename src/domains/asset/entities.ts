import { AssetId, AssetName, AssetPath } from './valueObjects';

type AssetParams = {
  id: string;
  name: string;
  path: string;
};

export class Asset {
  private _id: AssetId;
  private _name: AssetName;
  private _path: AssetPath;

  constructor(params: AssetParams) {
    this._id = new AssetId(params.id);
    this._name = new AssetName(params.name);
    this._path = new AssetPath(params.path);
  }

  public get id() {
    return this._id;
  }

  public get name() {
    return this._name;
  }

  public get path() {
    return this._path;
  }

  static from(file: File): Asset {
    const id = AssetId.generate();
    return new Asset({
      id: id.value,
      name: file.name,
      path: id.value,
    });
  }

  move(path: string) {
    this._path = new AssetPath(path);
  }
}
