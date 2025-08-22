type StoredFile = { path: string; data: Uint8Array; options?: any };

export const createMockSupabaseClient = () => {
  const memory: Record<string, StoredFile[]> = {};

  const from = jest.fn((bucket: string) => {
    if (!memory[bucket]) memory[bucket] = [];
    const files = memory[bucket];

    return {
      upload: jest.fn(
        async (
          path: string,
          file: File | Buffer | ArrayBuffer,
          options?: any
        ) => {
          let data: Uint8Array;
          if ('arrayBuffer' in file && typeof file.arrayBuffer === 'function')
            data = new Uint8Array(await file.arrayBuffer());
          else if (file instanceof Buffer || file instanceof ArrayBuffer)
            data = new Uint8Array(file);
          else throw new Error('Unsupported file type');

          const idx = files.findIndex((f) => f.path === path);
          const stored: StoredFile = { path, data, options };
          if (idx >= 0) files[idx] = stored;
          else files.push(stored);

          return { data: { path }, error: null };
        }
      ),

      download: jest.fn(async (path: string) => {
        const f = files.find((f) => f.path === path);
        if (!f) return { data: null, error: { message: 'File not found' } };
        return { data: f.data, error: null };
      }),

      remove: jest.fn(async (paths: string[]) => {
        paths.forEach((p) => {
          const idx = files.findIndex((f) => f.path === p);
          if (idx >= 0) files.splice(idx, 1);
        });
        return { data: paths, error: null };
      }),

      createSignedUrl: jest.fn(async (path: string, expiresIn: number) => {
        const f = files.find((f) => f.path === path);
        if (!f) return { data: null, error: { message: 'File not found' } };
        return {
          data: {
            signedUrl: `https://example.com/${bucket}/${path}?expiresIn=${expiresIn}`,
          },
          error: null,
        };
      }),
    };
  });

  return { storage: { from } };
};
