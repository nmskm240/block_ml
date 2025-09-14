import {
  clearFetchMocks,
  mockFetchResponse,
  setupFetchMock,
  tearDownFetchMock,
} from '@/lib/jest/mockFetch';

class StorageBucket {
  private _name: string;
  private _fileMap: Map<string, File>;

  constructor(name: string) {
    this._name = name;
    this._fileMap = new Map<string, File>();
  }

  get name() {
    return this._name;
  }

  get fileMap(): ReadonlyMap<string, File> {
    return this._fileMap;
  }

  add(path: string, file: File) {
    this._fileMap.set(path, file);
  }
}

const buckets: StorageBucket[] = [];

function getOrCreateBucket(bucketName: string): StorageBucket {
  let bucket = buckets.find((e) => e.name === bucketName);

  if (!bucket) {
    bucket = new StorageBucket(bucketName);
    buckets.push(bucket);
  }

  return bucket;
}

const createClient = jest.fn(() => ({
  storage: {
    from: jest.fn((bucketName: string) => {
      const bucket = getOrCreateBucket(bucketName);

      return {
        upload: jest.fn(
          (path: string, file: File, options: { upsert: boolean }) => {
            let error: string | null = null;
            const isExists = bucket.fileMap.has(path);
            if (isExists && !options.upsert) {
              error = 'Exist';
            } else {
              bucket.add(path, file);
            }
            return {
              data: { path: path },
              error: error,
            };
          },
        ),
        createSignedUrl: jest.fn((path: string, expiresIn: number) => {
          let error: string | null = null;
          if (!bucket.fileMap.has(path)) {
            error = 'Is not exsits';
          }
          const signedUrl = `${bucketName}/${path}?expires=${expiresIn}`;
          mockFetchResponse(signedUrl, {
            ok: true,
            blob: bucket.fileMap.get(path),
          });
          return {
            data: { signedUrl },
            error: error,
          };
        }),
        exists: jest.fn((path: string) => {
          const isExists = bucket.fileMap.has(path);
          const error = isExists ? null : 'Is not exists.';
          return { data: isExists, error: error };
        }),
      };
    }),
  },
}));

beforeAll(() => {
  setupFetchMock();
});

beforeEach(() => {
  clearFetchMocks();
  buckets.splice(0);
});

afterAll(() => {
  tearDownFetchMock();
});

const client = createClient();

export default client;
