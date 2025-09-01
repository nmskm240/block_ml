export class ProjectNotFoundError extends Error {
  constructor(projectId: string) {
    super(`Project not found. id: ${projectId}`);
  }
}

