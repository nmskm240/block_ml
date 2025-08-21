import {
  EditUserInfoRequest,
  EdituserInfoResponse,
  EditUserInfoResponseSchema,
} from './types';

export interface IUserApiClient {
  editUserInfo(
    userId: string,
    request: EditUserInfoRequest
  ): Promise<EdituserInfoResponse>;
}

export class UserApiClient implements IUserApiClient {
  async editUserInfo(
    userId: string,
    request: EditUserInfoRequest
  ): Promise<EdituserInfoResponse> {
    const formData = new FormData();
    formData.append('name', request.name);
    formData.append('file', request.icon);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}`,
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

    return EditUserInfoResponseSchema.parse(await response.json());
  }
}
