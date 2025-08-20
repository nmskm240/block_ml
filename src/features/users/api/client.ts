import { UploadUserIconRequest, UploadUserIconResponse } from './types';

export interface IUserApiClient {
  uploadUserIcon(userId: string, file: File): Promise<UploadUserIconResponse>;
}

export class UserApiClient implements IUserApiClient {
  async uploadUserIcon(userId: string, file: File): Promise<UploadUserIconResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/icon`,
      {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? 'Failed to upload user icon');
    }

    return (await response.json()) as UploadUserIconResponse;
  }
}