import { ProjectApiClient } from '../client';
import {
  CreateProjectRequest,
  GetProjectsRequest,
  SaveProjectRequest,
} from '../types';

// global.fetch のモック
global.fetch = jest.fn();

describe('ProjectApiClient', () => {
  let client: ProjectApiClient;
  const baseUrl = 'http://localhost:3000';

  beforeAll(() => {
    process.env.NEXT_PUBLIC_BASE_URL = baseUrl;
  });

  beforeEach(() => {
    client = new ProjectApiClient();
    (fetch as jest.Mock).mockClear();
  });

  describe('getProjectSummaries', () => {
    it('should fetch projects with correct params', async () => {
      const mockResponse = { projects: [] };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const request: GetProjectsRequest = { userId: 'user123' };
      await client.getProjectSummaries(request);

      const expectedUrl = `${baseUrl}/api/projects?userId=user123`;
      expect(fetch).toHaveBeenCalledWith(expectedUrl, expect.any(Object));
    });

    it('should throw error on failed response', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Error' }),
      });
      await expect(client.getProjectSummaries({})).rejects.toThrow('Error');
    });
  });

  describe('createProject', () => {
    it('should send a POST request with project data', async () => {
      const mockResponse = { id: 'proj456' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const request: CreateProjectRequest = { title: 'New Project' };
      const result = await client.createProject(request);

      expect(fetch).toHaveBeenCalledWith(`${baseUrl}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        cache: 'no-cache',
        credentials: 'include',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('saveProject', () => {
    it('should send a PUT request with FormData', async () => {
      const mockResponse = { success: true };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const request: SaveProjectRequest = {
        projectJson: '{"blocks":{}}',
        assets: [new File(['content'], 'asset.txt', { type: 'text/plain' })],
      };
      const projectId = 'proj123';

      await client.saveProject(projectId, request);

      expect(fetch).toHaveBeenCalledWith(
        `${baseUrl}/api/projects/${projectId}/edit`,
        expect.any(Object)
      );
      const fetchOptions = (fetch as jest.Mock).mock.calls[0][1];
      expect(fetchOptions.method).toBe('PUT');
      expect(fetchOptions.body).toBeInstanceOf(FormData);
    });
  });

  describe('getEditingProject', () => {
    it('should send a GET request to the edit endpoint', async () => {
      const mockResponse = { id: 'proj123', title: 'Editing Project' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const projectId = 'proj123';
      const result = await client.getProjectEditing(projectId);

      expect(fetch).toHaveBeenCalledWith(
        `${baseUrl}/api/projects/${projectId}/edit`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
