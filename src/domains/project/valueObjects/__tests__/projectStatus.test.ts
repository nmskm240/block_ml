import {
  ProjectStatus,
  ProjectStatusInvalidError,
  fromProjectStatus,
} from '../projectStatus';

describe('ProjectStatus', () => {
  describe('from', () => {
    it('should return the correct status for a valid number', () => {
      expect(fromProjectStatus(1)).toBe(ProjectStatus.Draft);
      expect(fromProjectStatus(2)).toBe(ProjectStatus.Active);
    });

    it('should throw an error for an invalid number', () => {
      expect(() => fromProjectStatus(99)).toThrow(ProjectStatusInvalidError);
      expect(() => fromProjectStatus(-1)).toThrow(ProjectStatusInvalidError);
    });
  });
});
