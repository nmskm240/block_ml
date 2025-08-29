import { createId } from '@paralleldrive/cuid2';

import { Project } from '../entities';
import { ProjectStatus } from '../valueObjects';

const baseParams = {
  id: createId(),
  title: 'Test Project',
  description: '',
  workspaceJson:
    '{"blocks":{"languageVersion":0,"blocks":[{"type":"block_type","id":"id"}]}}',
  status: ProjectStatus.Draft,
  assetIds: [createId(), createId()],
  ownerUserId: createId(),
};

// Projectクラス本体のテスト
describe('constructor', () => {
  it('should create a project instance with all params', () => {
    const project = new Project(baseParams);
    expect(project.id.value).toBe(baseParams.id);
    expect(project.title.value).toBe(baseParams.title);
    expect(project.description.value).toBe(baseParams.description);
    expect(project.workspace.value).toBe(baseParams.workspaceJson);
    expect(project.status).toBe(baseParams.status);
    expect(project.assetIds.map((id) => id.value)).toEqual(baseParams.assetIds);
    expect(project.ownerUserId?.value).toBe(baseParams.ownerUserId);
    expect(project.isTemporary).toBe(false);
  });

  it('should be temporary if ownerUserId is not provided', () => {
    const params = { ...baseParams, ownerUserId: undefined };
    const project = new Project(params);
    expect(project.isTemporary).toBe(true);
    expect(project.ownerUserId).toBeUndefined();
  });
});

describe('empty', () => {
  beforeEach(() => {
    process.env.DEFAULT_PROJECT_TITLE = 'Untitled';
    process.env.DEFAULT_PROJECT_WORKSPACE_JSON = '{"blocks":{}}';
  });

  afterEach(() => {
    delete process.env.DEFAULT_PROJECT_TITLE;
    delete process.env.DEFAULT_PROJECT_WORKSPACE_JSON;
  });

  it('should create an empty project for a specific user', () => {
    const ownerUserId = createId();
    const project = Project.empty(ownerUserId);
    expect(project.title.value).toBe('Untitled');
    expect(project.description.value).toBe('');
    expect(project.workspace.value).toBe('{"blocks":{}}');
    expect(project.ownerUserId?.value).toBe(ownerUserId);
    expect(project.assetIds).toEqual([]);
    expect(project.status).toBe(ProjectStatus.Draft);
    expect(project.isTemporary).toBe(false);
  });

  it('should create a temporary empty project if no user is specified', () => {
    const project = Project.empty();
    expect(project.isTemporary).toBe(true);
    expect(project.ownerUserId).toBeUndefined();
  });
});

describe('rename', () => {
  it('should rename the project', () => {
    const project = new Project(baseParams);
    const newTitle = 'Renamed Project';
    project.rename(newTitle);
    expect(project.title.value).toBe(newTitle);
  });
});

describe('changeStatus', () => {
  it('should change the project status', () => {
    const project = new Project(baseParams);
    project.changeStatus(ProjectStatus.Active);
    expect(project.status).toBe(ProjectStatus.Active);
  });
});

describe('edit', () => {
  beforeEach(() => {
    process.env.DEFAULT_PROJECT_TITLE = 'Untitled';
    process.env.DEFAULT_PROJECT_WORKSPACE_JSON = '{"blocks":{}}';
  });

  afterEach(() => {
    delete process.env.DEFAULT_PROJECT_TITLE;
    delete process.env.DEFAULT_PROJECT_WORKSPACE_JSON;
  });

  it('should throw error if project is temporary', () => {
    const project = Project.empty(); // ownerUserId is undefined
    expect(() => project.edit('{}', [])).toThrow('Cannot edit a temporary project.');
  });

  it('should throw error if project is not Active or Draft', () => {
    const project = new Project({
      ...baseParams,
      status: ProjectStatus.Archived,
    });
    expect(() => project.edit('{}', [])).toThrow('Only Active or Draft projects can be edited.');
  });

  it('should edit workspace and assets if editable', () => {
    const project = new Project({
      ...baseParams,
      status: ProjectStatus.Active,
    });
    const newWorkspaceJson = '{"blocks":{"languageVersion":0,"blocks":[]}}';
    const newAssetIds = [createId()];
    project.edit(newWorkspaceJson, newAssetIds);
    expect(project.workspace.value).toBe(newWorkspaceJson);
    expect(project.assetIds.map((id) => id.value)).toEqual(newAssetIds);
  });
});

describe('isEditableBy', () => {
  it('should be true if user is the owner, regardless of status', () => {
    const activeProject = new Project({ ...baseParams, status: ProjectStatus.Active });
    expect(activeProject.isEditableBy(baseParams.ownerUserId)).toBe(true);

    const draftProject = new Project({ ...baseParams, status: ProjectStatus.Draft });
    expect(draftProject.isEditableBy(baseParams.ownerUserId)).toBe(true);

    const archivedProject = new Project({ ...baseParams, status: ProjectStatus.Archived });
    expect(archivedProject.isEditableBy(baseParams.ownerUserId)).toBe(true);
  });

  it('should be false if user is not the owner, regardless of status', () => {
    const otherUserId = createId();

    const activeProject = new Project({ ...baseParams, status: ProjectStatus.Active });
    expect(activeProject.isEditableBy(otherUserId)).toBe(false);

    const draftProject = new Project({ ...baseParams, status: ProjectStatus.Draft });
    expect(draftProject.isEditableBy(otherUserId)).toBe(false);
  });

  it('should be false for any user if the project has no owner', () => {
    const project = new Project({ ...baseParams, ownerUserId: undefined });
    expect(project.isEditableBy(baseParams.ownerUserId)).toBe(false);
    expect(project.isEditableBy(createId())).toBe(false);
  });
});
