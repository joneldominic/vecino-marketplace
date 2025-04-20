import { describe, it, expect, vi, beforeEach } from 'vitest';
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
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
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
      result.current.login('test@example.com', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should set isAuthenticated to false when logout is called', () => {
    // Setup initial authenticated state
    localStorageMock.setItem('token', 'valid-token');

    const { result } = renderHook(() => useAuth());

    // Simulate login
    act(() => {
      result.current.login('test@example.com', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
  });
});
