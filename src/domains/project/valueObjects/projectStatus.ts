import { DomainValidationError } from '@/domains/errors';

export enum ProjectStatus {
  None = 0,
  Draft = 1,
  Active = 2,
  Archived = 3,
  Trashed = 4,
}

export function fromProjectStatus(value: number): ProjectStatus {
  if (!Object.values(ProjectStatus).includes(value)) {
    throw new ProjectStatusInvalidError(value);
  }
  return value;
}

export class ProjectStatusInvalidError extends DomainValidationError {
  constructor(value: number) {
    super(`Invalid ProjectStatus: ${value}`);
  }
}
