const createClient = jest.fn(() => ({
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(() => ({ data: { session: null } })),
  },
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(() => ({ data: { path: 'mock-path' }, error: null })),
      download: jest.fn(() => ({ data: new ArrayBuffer(0), error: null })),
      remove: jest.fn(() => ({ data: [], error: null })),
      createSignedUrl: jest.fn(() => ({
        data: { signedUrl: 'mock-url' },
        error: null,
      })),
    })),
  },
}));

const client = createClient();

export default client;
