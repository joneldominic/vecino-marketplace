import { renderHook, act } from '@testing-library/react';
import useAuth from './useAuth';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('useAuth hook', () => {
  beforeEach(() => {
    localStorageMock.clear();
    mockNavigate.mockClear();
  });

  it('should return isAuthenticated as false when no token exists', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should return isAuthenticated as true when token exists', () => {
    localStorageMock.setItem('token', 'valid-token');

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should store token and set isAuthenticated to true when login is called', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login('test-token', '/dashboard');
    });

    expect(localStorageMock.getItem('token')).toBe('test-token');
    expect(result.current.isAuthenticated).toBe(true);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should remove token and set isAuthenticated to false when logout is called', () => {
    // Setup initial authenticated state
    localStorageMock.setItem('token', 'valid-token');

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(localStorageMock.getItem('token')).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should update isAuthenticated when token state changes', () => {
    const { result, rerender } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);

    // Simulate token being added externally
    act(() => {
      localStorageMock.setItem('token', 'new-token');
    });

    rerender();

    expect(result.current.isAuthenticated).toBe(true);

    // Simulate token being removed externally
    act(() => {
      localStorageMock.removeItem('token');
    });

    rerender();

    expect(result.current.isAuthenticated).toBe(false);
  });
});
