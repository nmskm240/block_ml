import { SupabaseClient } from '@supabase/supabase-js';
import { injectable } from 'tsyringe';

const Buckets = {
  ProjectAssets: 'project_assts',
} as const;

type Buckets = (typeof Buckets)[keyof typeof Buckets];

export interface IStorageService {
  uploadProjectAssets(
    projectId: string,
    ...files: File[]
  ): Promise<{ success: boolean; error?: string }>;
}

@injectable()
export class StorageService implements IStorageService {
  constructor(private readonly _client: SupabaseClient) {}

  async uploadProjectAssets(
    projectId: string,
    ...files: File[]
  ): Promise<{ success: boolean; error?: string }> {
    const path = this.getBucketPathFormat(Buckets.ProjectAssets).replace(
      '{0}',
      projectId
    );
    for (const file of files) {
      try {
        const content = await file.arrayBuffer();
        const encodedFileName = encodeURIComponent(file.name);

        const { error } = await this._client.storage
          .from(Buckets.ProjectAssets)
          .upload(path.replace('{1}', encodedFileName), content, {
            contentType: 'text/csv',
            cacheControl: '3600',
            upsert: true,
          });

        if (error) {
          return {
            success: false,
            error: `Failed to upload ${file.name}: ${error.message}`,
          };
        }
      } catch (err: any) {
        return {
          success: false,
          error: `Unexpected error while uploading ${file.name}: ${err.message}`,
        };
      }
    }

    return { success: true };
  }

  getBucketPathFormat(bucket: Buckets): string {
    switch (bucket) {
      case Buckets.ProjectAssets:
        return 'projects/{0}/{1}';
      default:
        throw new Error();
    }
  }
}
