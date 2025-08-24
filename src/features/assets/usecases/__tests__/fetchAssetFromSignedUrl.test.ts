import fetchAssetFromSignedUrl from '../fetchAssetFromSignedUrl';

describe('fetchAssetFromSignedUrl', () => {
  // 各テストの後にモックをリセット
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch a url and return a File object', async () => {
    const mockUrl = 'https://example.com/file.txt';
    const mockFileName = 'my-file.txt';
    const fileContent = 'file content';
    const mockBlob = new Blob([fileContent], { type: 'text/plain' });

    // オリジナルのFileコンストラクタを保存
    const OriginalFile = global.File;

    // Fileコンストラクタをモック
    global.File = jest.fn().mockImplementation((content, name, options) => {
      const file = new OriginalFile(content, name, options); // オリジナルを呼び出す
      // text() メソッドをモック
      Object.defineProperty(file, 'text', {
        value: jest.fn().mockResolvedValue(fileContent),
        writable: true,
      });
      return file;
    }) as any; // 型アサーションを追加

    // fetchをモック
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      blob: jest.fn().mockResolvedValue(mockBlob),
    });

    const file = await fetchAssetFromSignedUrl({
      url: mockUrl,
      fileName: mockFileName,
    });

    expect(global.fetch).toHaveBeenCalledWith(mockUrl);
    expect(file).toBeInstanceOf(OriginalFile);
    expect(file.name).toBe(mockFileName);
    expect(file.type).toBe(mockBlob.type);
    expect(await file.text()).toBe(fileContent);
  });

  it('should throw an error if fetch fails', async () => {
    const mockUrl = 'https://example.com/not-found';
    const mockFileName = 'my-file.txt';

    // fetchを失敗するようにモック
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
    });

    await expect(
      fetchAssetFromSignedUrl({ url: mockUrl, fileName: mockFileName }),
    ).rejects.toThrow(`Failed to fetch file from URL: ${mockUrl}`);
  });
});
