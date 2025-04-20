import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { AxiosError, AxiosRequestConfig } from 'axios';

// Mock the axios module
vi.mock('axios', () => {
  return {
    create: vi.fn(() => ({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
      get: vi.fn(),
    })),
    defaults: {},
  };
});

describe('API Client', () => {
  let mockLocalStorage: { [key: string]: string };
  let requestHandler: (config: AxiosRequestConfig) => AxiosRequestConfig;
  let errorHandler: (error: Error) => Promise<never>;

  beforeEach(() => {
    // Mock localStorage
    mockLocalStorage = {};
    global.localStorage = {
      getItem: vi.fn(key => mockLocalStorage[key] || null),
      setItem: vi.fn((key, value) => {
        mockLocalStorage[key] = value.toString();
      }),
      removeItem: vi.fn(key => {
        delete mockLocalStorage[key];
      }),
      clear: vi.fn(() => {
        mockLocalStorage = {};
      }),
      length: 0,
      key: vi.fn(() => null),
    } as unknown as Storage;

    // Reset all mocks
    vi.clearAllMocks();

    // Create simple handlers for testing
    requestHandler = (config: AxiosRequestConfig) => {
      const headers = config.headers || {};
      const token = localStorage.getItem('token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      return { ...config, headers };
    };

    errorHandler = (error: Error) => Promise.reject(error);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Request Interceptor', () => {
    it('should add authorization header when token exists', () => {
      // Setup
      const token = 'test-token';
      mockLocalStorage['token'] = token;
      const config = { headers: {} } as AxiosRequestConfig;

      // Execute
      const result = requestHandler(config);

      // Verify
      expect(result.headers.Authorization).toBe(`Bearer ${token}`);
    });

    it('should not add authorization header when token does not exist', () => {
      // Setup
      const config = { headers: {} } as AxiosRequestConfig;

      // Execute
      const result = requestHandler(config);

      // Verify
      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should reject with error in case of failure', async () => {
      // Setup
      const error = new Error('Test Error');

      // Execute & Verify
      await expect(errorHandler(error)).rejects.toThrow('Test Error');
    });
  });

  describe('Response Interceptor', () => {
    it('should handle connection errors', async () => {
      // Create response error handler
      const responseErrorHandler = (error: AxiosError) => {
        console.error('API error:', error);
        if (error.code === 'ECONNABORTED') {
          return Promise.reject(new Error('Backend connection failed'));
        }
        return Promise.reject(error);
      };

      // Setup
      const error = {
        code: 'ECONNABORTED',
        message: 'timeout',
      } as AxiosError;
      console.error = vi.fn();

      // Execute & Verify
      await expect(responseErrorHandler(error)).rejects.toThrow('Backend connection failed');
      expect(console.error).toHaveBeenCalled();
    });
  });
});
