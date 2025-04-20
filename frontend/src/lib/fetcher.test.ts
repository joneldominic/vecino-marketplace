import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetcher } from './fetcher';

// Define MockResponse type for better type safety
type MockResponse = {
  ok: boolean;
  status?: number;
  statusText?: string;
  json?: () => Promise<unknown>;
};

// Mock fetch function
global.fetch = vi.fn();

describe('fetcher', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch data successfully', async () => {
    const mockData = { test: 'data' };
    const mockResponse: MockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await fetcher('/test-url');

    expect(global.fetch).toHaveBeenCalledWith('/test-url', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(mockResponse.json).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it('should throw an error when response is not ok', async () => {
    const mockResponse: MockResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found',
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(fetcher('/test-url')).rejects.toThrow('Not Found');
    expect(global.fetch).toHaveBeenCalledWith('/test-url', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should throw an error with custom error message for 401 status', async () => {
    const mockResponse: MockResponse = {
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(fetcher('/test-url')).rejects.toThrow('Unauthorized: You need to log in');
    expect(global.fetch).toHaveBeenCalledWith('/test-url', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should throw an error with custom error message for 500 status', async () => {
    const mockResponse: MockResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(fetcher('/test-url')).rejects.toThrow(
      'Internal Server Error: Server error occurred',
    );
    expect(global.fetch).toHaveBeenCalledWith('/test-url', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should pass options to fetch when provided', async () => {
    const mockData = { test: 'data' };
    const mockResponse: MockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    };
    const customOptions = {
      method: 'POST',
      body: JSON.stringify({ key: 'value' }),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await fetcher('/test-url', customOptions);

    expect(global.fetch).toHaveBeenCalledWith('/test-url', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ key: 'value' }),
    });
    expect(mockResponse.json).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it('should throw a network error when fetch fails', async () => {
    const networkError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValue(networkError);

    await expect(fetcher('/test-url')).rejects.toThrow('Network error');
    expect(global.fetch).toHaveBeenCalledWith('/test-url', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
});
