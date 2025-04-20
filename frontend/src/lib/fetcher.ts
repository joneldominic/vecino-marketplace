/**
 * Utility for making fetch requests with standardized error handling
 */
export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  const response = await fetch(url, mergedOptions);

  if (!response.ok) {
    // Handle specific status codes with custom error messages
    if (response.status === 401) {
      throw new Error(`${response.statusText}: You need to log in`);
    } else if (response.status === 500) {
      throw new Error(`${response.statusText}: Server error occurred`);
    } else {
      throw new Error(response.statusText);
    }
  }

  return (await response.json()) as T;
}
