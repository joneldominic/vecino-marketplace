import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import api, { testApi as _testApi } from './api';
import type { AxiosError, AxiosRequestConfig } from 'axios';

// Mock the axios module
jest.mock('axios', () => {
  return {
    create: jest.fn(() => ({
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
      get: jest.fn(),
    })),
    defaults: {},
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };
});

describe('API Client', () => {
  let mockLocalStorage: { [key: string]: string };
  let requestInterceptor: [
    (config: AxiosRequestConfig) => AxiosRequestConfig,
    (error: Error) => Promise<never>,
  ];
  let responseInterceptor: [(response: unknown) => unknown, (error: AxiosError) => Promise<never>];
  let mockAxios: MockAdapter;

  beforeEach(() => {
    // Mock localStorage
    mockLocalStorage = {};
    global.localStorage = {
      getItem: jest.fn(key => mockLocalStorage[key] || null),
      setItem: jest.fn((key, value) => {
        mockLocalStorage[key] = value.toString();
      }),
      removeItem: jest.fn(key => {
        delete mockLocalStorage[key];
      }),
      clear: jest.fn(() => {
        mockLocalStorage = {};
      }),
      length: 0,
      key: jest.fn(() => null),
    };

    // Reset all mocks
    jest.clearAllMocks();

    // Re-import the module to get fresh instances with our mocks
    jest.isolateModules(() => {
      // Use type assertion on import() instead of require()
      const _apiModule = jest.requireActual('./api');
      requestInterceptor = (axios.create().interceptors.request.use as jest.Mock).mock.calls[0];
      responseInterceptor = (axios.create().interceptors.response.use as jest.Mock).mock.calls[0];
    });

    // Create a mock for axios to use in specific tests
    mockAxios = new MockAdapter(api);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  describe('Request Interceptor', () => {
    it('should add authorization header when token exists', () => {
      // Setup
      const token = 'test-token';
      mockLocalStorage['token'] = token;
      const config = { headers: {} } as AxiosRequestConfig;

      // Execute
      const result = requestInterceptor[0](config);

      // Verify
      expect(result.headers.Authorization).toBe(`Bearer ${token}`);
    });

    it('should not add authorization header when token does not exist', () => {
      // Setup
      const config = { headers: {} } as AxiosRequestConfig;

      // Execute
      const result = requestInterceptor[0](config);

      // Verify
      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should reject with error in case of failure', () => {
      // Setup
      const error = new Error('Test Error');

      // Execute & Verify
      expect(() => requestInterceptor[1](error)).rejects.toThrow('Test Error');
    });
  });

  describe('Response Interceptor', () => {
    it('should return response directly on success', () => {
      // Setup
      const response = { data: { success: true } };

      // Execute
      const result = responseInterceptor[0](response);

      // Verify
      expect(result).toBe(response);
    });

    it('should handle connection errors', () => {
      // Setup
      const error = {
        code: 'ECONNABORTED',
        message: 'timeout',
      } as AxiosError;
      console.error = jest.fn();

      // Execute & Verify
      expect(() => responseInterceptor[1](error)).rejects.toThrow('Backend connection failed');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle 401 unauthorized errors', () => {
      // Setup
      const error = {
        response: { status: 401 },
      } as AxiosError;
      console.error = jest.fn();

      // Execute & Verify
      expect(() => responseInterceptor[1](error)).rejects.toThrow();
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle 403 forbidden errors', () => {
      // Setup
      const error = {
        response: { status: 403 },
      } as AxiosError;
      console.error = jest.fn();

      // Execute & Verify
      expect(() => responseInterceptor[1](error)).rejects.toThrow();
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle 404 not found errors', () => {
      // Setup
      const error = {
        response: { status: 404 },
      } as AxiosError;
      console.error = jest.fn();

      // Execute & Verify
      expect(() => responseInterceptor[1](error)).rejects.toThrow();
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle 500 server errors', () => {
      // Setup
      const error = {
        response: { status: 500 },
      } as AxiosError;
      console.error = jest.fn();

      // Execute & Verify
      expect(() => responseInterceptor[1](error)).rejects.toThrow();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('API Endpoints', () => {
    it('testApi.getTestData should call api.get with the correct endpoint', async () => {
      // Setup
      const getMock = jest.fn().mockResolvedValue({ data: { message: 'success' } });
      (axios.create as jest.Mock).mockReturnValue({
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
        get: getMock,
      });

      // Re-import to use our new mock
      // Use dynamic import with type assertion
      const { testApi } = (await import('./api')) as { testApi: typeof _testApi };

      // Execute
      await testApi.getTestData();

      // Verify
      expect(getMock).toHaveBeenCalledWith('/test');
    });

    it('testApi.getTestData should handle errors', async () => {
      // Setup
      const error = new Error('API Error');
      const getMock = jest.fn().mockRejectedValue(error);
      console.error = jest.fn();

      (axios.create as jest.Mock).mockReturnValue({
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
        get: getMock,
      });

      // Re-import to use our new mock
      // Use dynamic import with type assertion
      const { testApi } = (await import('./api')) as { testApi: typeof _testApi };

      // Execute & Verify
      await expect(testApi.getTestData()).rejects.toThrow('API Error');
      expect(console.error).toHaveBeenCalled();
    });
  });
});
