import { ProjectId, UserId } from '@/lib/domain/vo/Id';

export class Project {
  private _id?: ProjectId;
  private _title: ProjectTitle;
  private _blocklyJson: BlocklyJson;
  private _ownerUserId?: UserId;

  private constructor(
    title: string,
    workspaceJson: string,
    readonly status: ProjectStatus,

    id?: string,
    ownerUserId?: string
  ) {
    this._id = id ? new ProjectId(id) : undefined;
    this._title = new ProjectTitle(title);
    this._blocklyJson = new BlocklyJson(workspaceJson);
    this._ownerUserId = ownerUserId ? new UserId(ownerUserId) : undefined;
  }

  static empty(ownerUserId?: string): Project {
    return new Project(
      process.env.DEFAULT_PROJECT_TITLE!,
      process.env.DEFAULT_PROJECT_WORKSPACE_JSON!,
      ProjectStatus.Active,
      undefined,
      ownerUserId
    );
  }

  get id() {
    return this._id?.value;
  }

  get title() {
    return this._title.value;
  }

  get blocklyJson() {
    return this._blocklyJson.value;
  }

  get ownerUserId() {
    return this._ownerUserId?.value;
  }

  copyWith(params: {
    id?: string;
    title?: string;
    blocklyJson?: string;
    status?: ProjectStatus;
    ownerUserId?: string;
  }): Project {
    return new Project(
      params.title ?? this.title,
      params.blocklyJson ?? this.blocklyJson,
      params.status ?? this.status,
      params.id ?? this.id,
      params.ownerUserId ?? this.ownerUserId
    );
  }
}

export const ProjectStatus = {
  None: 0,
  Active: 1,
  Archived: 2,
  Trashed: 3,
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

//#region valueObjects

class ProjectTitle {
  constructor(readonly value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error('Project title must not be empty.');
    }
    if (trimmed.length > 100) {
      throw new Error('Project title must be 100 characters or less.');
    }
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
  }

  equals(other: BlocklyJson): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

//#endregion
