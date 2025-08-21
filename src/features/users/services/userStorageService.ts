import { Token } from '@/lib/di/types';
import { inject, injectable } from 'tsyringe';
import { StorageClient } from '@supabase/storage-js';

export interface IUserStorageService {
  uploadUserIcon(userId: string, file: File): Promise<string>;
}

@injectable()
export class UserStorageService implements IUserStorageService {
  private readonly BUCKET_NAME = 'user';

  constructor(
    @inject(Token.SupabaseStorageClient)
    private readonly _storageClient: StorageClient
  ) {}

  async uploadUserIcon(userId: string, file: File): Promise<string> {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}/icon.${fileExtension}`;

    const { error } = await this._storageClient
      .from(this.BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      throw new Error(`Failed to upload user icon: ${error.message}`);
    }

    const { data: publicUrlData } = this._storageClient
      .from(this.BUCKET_NAME)
      .getPublicUrl(fileName);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file.');
    }

    return publicUrlData.publicUrl;
  }
}
