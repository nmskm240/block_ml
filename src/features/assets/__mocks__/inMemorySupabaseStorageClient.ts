import { jest } from '@jest/globals';

export class InMemorySupabaseStorageClient {
  public upload = jest.fn().mockResolvedValue({ data: {}, error: null });
  public createSignedUrl = jest.fn().mockResolvedValue({
    data: { signedUrl: 'http://example.com/signed-url' },
    error: null,
  });

  from(bucket: string) {
    return {
      upload: this.upload,
      createSignedUrl: this.createSignedUrl,
    };
  }
}
