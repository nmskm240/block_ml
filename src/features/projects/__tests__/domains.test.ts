import Project, { ProjectStatus } from '../domains';
import { createId } from '@paralleldrive/cuid2';

describe('Project', () => {
  const baseParams = {
    id: createId(),
    title: 'Test Project',
    workspaceJson: '{"blocks":{"languageVersion":0,"blocks":[{"type":"block_type","id":"id"}]}}',
    status: ProjectStatus.Draft,
    assetIds: [createId(), createId()],
    ownerUserId: createId(),
    updatedAt: new Date(),
  };

  // ProjectTitle VOのテスト
  describe('ProjectTitle', () => {
    it('should throw error if title is empty', () => {
      expect(() => new Project({ ...baseParams, title: '' })).toThrow('Project title must not be empty.');
    });

    it('should throw error if title is over 100 characters', () => {
      const longTitle = 'a'.repeat(101);
      expect(() => new Project({ ...baseParams, title: longTitle })).toThrow('Project title must be 100 characters or less.');
    });

    it('should trim the title', () => {
      const project = new Project({ ...baseParams, title: '  Trimmed Title  ' });
      expect(project.title.value).toBe('Trimmed Title');
    });
  });

  // BlocklyJson VOのテスト
  describe('BlocklyJson', () => {
    it('should throw error if workspaceJson is empty', () => {
      expect(() => new Project({ ...baseParams, workspaceJson: ' ' })).toThrow('Blockly JSON must not be empty.');
    });
  });

  // Projectクラス本体のテスト
  describe('constructor', () => {
    it('should create a project instance with all params', () => {
      const project = new Project(baseParams);
      expect(project.id.value).toBe(baseParams.id);
      expect(project.title.value).toBe(baseParams.title);
      expect(project.workspaceJson.value).toBe(baseParams.workspaceJson);
      expect(project.status).toBe(baseParams.status);
      expect(project.assetIds.map(id => id.value)).toEqual(baseParams.assetIds);
      expect(project.ownerUserId?.value).toBe(baseParams.ownerUserId);
      expect(project.updatedAt).toBe(baseParams.updatedAt);
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
      expect(project.workspaceJson.value).toBe('{"blocks":{}}');
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
      expect(() => project.edit('{}', [])).toThrow();
    });

    it('should throw error if project is not editable', () => {
      const project = new Project({ ...baseParams, status: ProjectStatus.Archived });
      expect(() => project.edit('{}', [])).toThrow();
    });

    it('should edit workspace and assets if editable', () => {
      const project = new Project({ ...baseParams, status: ProjectStatus.Active });
      const newWorkspaceJson = '{"blocks":{"languageVersion":0,"blocks":[]}}';
      const newAssetIds = [createId()];
      project.edit(newWorkspaceJson, newAssetIds);
      expect(project.workspaceJson.value).toBe(newWorkspaceJson);
      expect(project.assetIds.map(id => id.value)).toEqual(newAssetIds);
    });
  });

  describe('isEdittable', () => {
    it('should be true if user is owner and status is Active', () => {
      const project = new Project({ ...baseParams, status: ProjectStatus.Active });
      expect(project.isEdittable(baseParams.ownerUserId)).toBe(true);
    });

    it('should be true if status is Draft', () => {
      const project = new Project({ ...baseParams, status: ProjectStatus.Draft });
      expect(project.isEdittable(baseParams.ownerUserId)).toBe(true);
    });

    it('should be false if user is not owner', () => {
      const project = new Project({ ...baseParams, status: ProjectStatus.Active });
      expect(project.isEdittable(createId())).toBe(false);
    });

    it('should be false if status is not Active or Draft', () => {
      const project = new Project({ ...baseParams, status: ProjectStatus.Archived });
      expect(project.isEdittable(baseParams.ownerUserId)).toBe(false);
    });
  });
});

describe('ProjectStatus', () => {
  describe('from', () => {
    it('should return the correct status for a valid number', () => {
      expect(ProjectStatus.from(1)).toBe(ProjectStatus.Draft);
      expect(ProjectStatus.from(2)).toBe(ProjectStatus.Active);
    });

    it('should throw an error for an invalid number', () => {
      expect(() => ProjectStatus.from(99)).toThrow('Invalid ProjectStatus: 99');
      expect(() => ProjectStatus.from(-1)).toThrow('Invalid ProjectStatus: -1');
    });
  });
});