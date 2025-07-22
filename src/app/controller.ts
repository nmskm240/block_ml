import { apiClient } from '@/lib/api';

export async function saveProject(json: string) {
  await apiClient.postSaveProject({ data: json });
}
