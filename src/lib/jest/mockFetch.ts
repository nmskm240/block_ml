type MockResponseConfig = {
  json?: object;
  text?: string;
  blob?: Blob;
  status?: number;
  ok?: boolean;
  headers?: HeadersInit;
};

// Map to store URL -> MockResponseConfig
const mockResponses = new Map<string, MockResponseConfig>();

class MockResponse {
  private _blob: Blob;
  public ok: boolean;
  public status: number;

  constructor(blob: Blob, init?: ResponseInit) {
    this._blob = blob;
    this.ok = init?.status ? init.status >= 200 && init.status < 300 : true;
    this.status = init?.status || 200;
  }

  async blob(): Promise<Blob> {
    return this._blob;
  }
}

global.fetch = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.Response = MockResponse as any;

export const setupFetchMock = () => {
  jest
    .spyOn(global, 'fetch')
    .mockImplementation((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();

      // Check if a specific mock response is registered for this URL
      if (mockResponses.has(url)) {
        const config = mockResponses.get(url)!;
        const responseInit: ResponseInit = {
          status: config.status ?? 200,
          headers: config.headers,
        };

        let body: BodyInit | null = null;
        if (config.json) {
          body = JSON.stringify(config.json);
          responseInit.headers = {
            'Content-Type': 'application/json',
            ...responseInit.headers,
          };
        } else if (config.text) {
          body = config.text;
          responseInit.headers = {
            'Content-Type': 'text/plain',
            ...responseInit.headers,
          };
        } else if (config.blob) {
          body = config.blob;
          responseInit.headers = {
            'Content-Type': config.blob.type,
            ...responseInit.headers,
          };
        }

        return Promise.resolve(new Response(body, responseInit));
      }

      // Default behavior: throw an error for unmocked requests
      return Promise.reject(
        new Error(`Unhandled fetch request for URL: ${url}`),
      );
    });
};

export const tearDownFetchMock = () => {
  jest.restoreAllMocks();
  mockResponses.clear(); // Clear registered mocks for the next test
};

export const mockFetchResponse = (url: string, config: MockResponseConfig) => {
  mockResponses.set(url, config);
};

export const clearFetchMocks = () => {
  mockResponses.clear();
};
