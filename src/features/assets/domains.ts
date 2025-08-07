import Id from '@/lib/domain/vo/Id';
import { createId } from '@paralleldrive/cuid2';
import path from 'path';

type AssetParams = {
  id: string;
  name: string;
  path: string;
};

export default class Asset {
  private _id: AssetId;
  private _name: AssetName;
  private _path: AssetPath;

  constructor(params: AssetParams) {
    this._id = new AssetId(params.id);
    this._name = new AssetName(params.name);
    this._path = new AssetPath(params.path);
  }

  static from(file: File): Asset {
    const id = AssetId.generate();
    return new Asset({
      id: id.toString(),
      name: file.name,
      path: id.toString(),
    });
  }

  get id() {
    return this._id.value;
  }

  get name() {
    return this._name.value;
  }

  get path() {
    return this._path.value;
  }
}

//#region valueObjects

export class AssetId extends Id<AssetId> {
  static generate(): AssetId {
    return new AssetId(createId());
  }
}

class AssetName {
  constructor(readonly value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error('Asset name must not be empty.');
    }
    if (trimmed.length > 100) {
      throw new Error('Asset name must be 100 characters or less.');
    }

    this.value = trimmed;
  }

  equals(other: AssetName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

class AssetPath {
  constructor(readonly value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error('Asset path must not be empty.');
    }
    if (trimmed.includes('..') || path.isAbsolute(trimmed)) {
      throw new Error(`Invalid asset path: "${trimmed}"`);
    }

    this.value = trimmed;
  }

  equals(other: AssetPath): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

//#endregion
