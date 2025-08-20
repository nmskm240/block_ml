import { createId } from '@paralleldrive/cuid2';

export interface IUserStorageService {
  uploadUserIcon(userId: string, file: File): Promise<string>;
}

@injectable()
export class UserStorageService implements IUserStorageService {
  private readonly BUCKET_NAME = 'user-icons'; // バケット名

  constructor(
    @inject(Token.SupabaseStorageClient)
    private readonly _storageClient: StorageClient
  ) {}

  async uploadUserIcon(userId: string, file: File): Promise<string> {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}/${createId()}.${fileExtension}`; // createId を使用

    const { data, error } = await this._storageClient
      .from(this.BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true, // 既存のファイルを上書き
      });

    if (error) {
      throw new Error(`Failed to upload user icon: ${error.message}`);
    }

    // アップロードされたファイルの公開URLを取得
    const { data: publicUrlData } = this._storageClient
      .from(this.BUCKET_NAME)
      .getPublicUrl(fileName);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file.');
    }

    return publicUrlData.publicUrl;
  }
}