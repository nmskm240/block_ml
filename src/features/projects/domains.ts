import Id from '@/lib/domain/vo/Id';
import { AssetId } from '../assets/domains';
import { UserId } from '../users/domains';

type ProjectParams = {
  id?: string;
  title: string;
  workspaceJson: string;
  status: ProjectStatus;
  assetIds?: string[];
  ownerUserId?: string;
  updatedAt?: Date;
};

export default class Project {
  private _id?: ProjectId;
  private _title: ProjectTitle;
  private _workspaceJson: BlocklyJson;
  private _ownerUserId?: UserId;
  private _assetIds: AssetId[];
  public readonly status: ProjectStatus;
  public readonly updatedAt?: Date;

  private constructor(params: ProjectParams) {
    this._id = params.id ? new ProjectId(params.id) : undefined;
    this._title = new ProjectTitle(params.title);
    this._workspaceJson = new BlocklyJson(params.workspaceJson);
    this._ownerUserId = params.ownerUserId
      ? new UserId(params.ownerUserId)
      : undefined;
    this._assetIds = params.assetIds?.map((e) => new AssetId(e)) ?? [];
    this.status = params.status;
    this.updatedAt = params.updatedAt;
  }

  static empty(ownerUserId?: string): Project {
    return new Project({
      title: process.env.DEFAULT_PROJECT_TITLE!,
      workspaceJson: process.env.DEFAULT_PROJECT_WORKSPACE_JSON!,
      ownerUserId: ownerUserId,
      assetIds: [],
      // FIXME: Draftでは？
      status: ProjectStatus.Active,
    });
  }

  get id() {
    return this._id?.value;
  }

  get title() {
    return this._title.value;
  }

  get workspaceJson() {
    return this._workspaceJson.value;
  }

  get ownerUserId() {
    return this._ownerUserId?.value;
  }

  get assetIds() {
    return this._assetIds;
  }

  copyWith(params: Partial<ProjectParams>): Project {
    return new Project({
      id: params.id ?? this.id,
      title: params.title ?? this.title,
      workspaceJson: params.workspaceJson ?? this.workspaceJson,
      status: params.status ?? this.status,
      assetIds: params.assetIds ?? this.assetIds.map((x) => x.value),
      ownerUserId: params.ownerUserId ?? this.ownerUserId,
      updatedAt: params.updatedAt ?? this.updatedAt,
    });
  }
}

export enum ProjectStatus {
  None = 0,
  Active = 1,
  Archived = 2,
  Trashed = 3,
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

class ProjectId extends Id<ProjectId> {}

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
