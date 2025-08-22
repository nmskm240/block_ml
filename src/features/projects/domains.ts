import { Id } from '@/lib/domain/vo/';
import { createId } from '@paralleldrive/cuid2';
import { AssetId } from '../assets/domains';
import { UserId } from '../users/domains';

type ProjectParams = {
  id: string;
  title: string;
  workspaceJson: string;
  status: ProjectStatus;
  assetIds: string[];
  ownerUserId?: string;
  updatedAt?: Date;
};

export default class Project {
  public readonly id: ProjectId;
  private _title: ProjectTitle;
  private _workspaceJson: BlocklyJson;
  public readonly ownerUserId?: UserId;
  private _assetIds: AssetId[];
  private _status: ProjectStatus;
  public readonly updatedAt: Date;

  constructor(params: ProjectParams) {
    this.id = new ProjectId(params.id);
    this._title = new ProjectTitle(params.title);
    this._workspaceJson = new BlocklyJson(params.workspaceJson);
    this.ownerUserId = params.ownerUserId
      ? new UserId(params.ownerUserId)
      : undefined;
    this._assetIds = params.assetIds?.map((e) => new AssetId(e)) ?? [];
    this._status = params.status;
    this.updatedAt = params.updatedAt ?? new Date();
  }

  get title() {
    return this._title;
  }

  get status() {
    return this._status;
  }

  get workspaceJson() {
    return this._workspaceJson;
  }

  get assetIds(): ReadonlyArray<AssetId> {
    return this._assetIds;
  }

  get isTemporary() {
    return this.ownerUserId === undefined;
  }

  static empty(ownerUserId?: string): Project {
    return new Project({
      id: ProjectId.generate().value,
      title: process.env.DEFAULT_PROJECT_TITLE!,
      workspaceJson: process.env.DEFAULT_PROJECT_WORKSPACE_JSON!,
      ownerUserId: ownerUserId,
      assetIds: [],
      status: ProjectStatus.Draft,
    });
  }

  rename(title: string) {
    this._title = new ProjectTitle(title);
  }

  changeStatus(status: ProjectStatus) {
    this._status = status;
  }

  // FIXME: AssetはUseAassetなど分離したほうがいいかもしれない
  edit(workspaceJson: string, assetIds: string[]) {
    if (this.isTemporary || !this.isEdittable(this.ownerUserId!.value)) {
      throw new Error();
    }
    this._workspaceJson = new BlocklyJson(workspaceJson);
    this._assetIds = assetIds.map((e) => new AssetId(e));
  }

  isEdittable(userId: string) {
    return (
      (this.ownerUserId?.value === userId &&
        this.status === ProjectStatus.Active) ||
      this.status === ProjectStatus.Draft
    );
  }
}

export enum ProjectStatus {
  None = 0,
  Draft = 1,
  Active = 2,
  Archived = 3,
  Trashed = 4,
}

export namespace ProjectStatus {
  export function from(value: number): ProjectStatus {
    if (!Object.values(ProjectStatus).includes(value)) {
      throw new Error(`Invalid ProjectStatus: ${value}`);
    }
    return value;
  }
}

//#region valueObjects

class ProjectId extends Id<ProjectId> {
  static generate(): ProjectId {
    return new ProjectId(createId());
  }
}

class ProjectTitle {
  constructor(readonly value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error('Project title must not be empty.');
    }
    if (trimmed.length > 100) {
      throw new Error('Project title must be 100 characters or less.');
    }

    this.value = trimmed;
  }

  equals(other: ProjectTitle): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

class BlocklyJson {
  constructor(readonly value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error('Blockly JSON must not be empty.');
    }

    this.value = trimmed;
  }

  equals(other: BlocklyJson): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

//#endregion
