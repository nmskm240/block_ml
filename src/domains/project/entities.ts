import { AssetId } from '@/domains/asset/valueObjects';
import { UserId } from '@/domains/user/valueObjects';

import {
  ProjectDescription,
  ProjectId,
  ProjectStatus,
  ProjectTitle,
  ProjectWorkspace,
} from './valueObjects';

type ProjectParams = {
  id: string;
  title: string;
  description: string;
  workspaceJson: string;
  status: ProjectStatus;
  assetIds: string[];
  ownerUserId?: string;
};

export class Project {
  public readonly id: ProjectId;
  private _title: ProjectTitle;
  private _description: ProjectDescription;
  private _workspace: ProjectWorkspace;
  public readonly ownerUserId?: UserId;
  private _assetIds: AssetId[];
  private _status: ProjectStatus;

  constructor(params: ProjectParams) {
    this.id = new ProjectId(params.id);
    this._title = new ProjectTitle(params.title);
    this._description = new ProjectDescription(params.description);
    this._workspace = new ProjectWorkspace(params.workspaceJson);
    this.ownerUserId = params.ownerUserId
      ? new UserId(params.ownerUserId)
      : undefined;
    this._assetIds = params.assetIds?.map((e) => new AssetId(e)) ?? [];
    this._status = params.status;
  }

  get title() {
    return this._title;
  }

  get description() {
    return this._description;
  }

  get workspace() {
    return this._workspace;
  }

  get status() {
    return this._status;
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
      description: '',
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
    if (this.isTemporary) {
      throw new Error('Cannot edit a temporary project.');
    }
    if (this.status !== ProjectStatus.Active && this.status !== ProjectStatus.Draft) {
      throw new Error('Only Active or Draft projects can be edited.');
    }

    this._workspace = new ProjectWorkspace(workspaceJson);
    this._assetIds = assetIds.map((e) => new AssetId(e));
  }

  isEditableBy(userId: string) {
    return this.ownerUserId?.value === userId;
  }
}
