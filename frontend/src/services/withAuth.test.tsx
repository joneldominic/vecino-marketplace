import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import withAuth from './withAuth';
import { useAuthStore } from '../store';

// Explicitly mock the store module
vi.mock('../store', () => ({
  useAuthStore: vi.fn(),
}));

// Mock component to wrap with withAuth
const TestComponent = () => <div>Protected Content</div>;
const ProtectedComponent = withAuth(TestComponent);

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('withAuth HOC', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should render the wrapped component when user is authenticated', () => {
    // Set authentication token
    localStorageMock.setItem('token', 'valid-token');

    // Mock the auth store to return authenticated state
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      user: null,
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <ProtectedComponent />
      </MemoryRouter>,
    );

    // Check that the protected content is rendered
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login page when user is not authenticated', () => {
    // Ensure no authentication token
    localStorageMock.clear();

    // Mock the auth store to return unauthenticated state
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
      user: null,
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <ProtectedComponent />
      </MemoryRouter>,
    );

    // The component should show login message
    expect(screen.getByText('Please log in to view this content.')).toBeInTheDocument();
  });

  it('should handle token expiration', () => {
    // Set an expired token
    localStorageMock.setItem('token', 'expired-token');

    // Mock the auth store to return unauthenticated state (token expired)
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
      user: null,
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <ProtectedComponent />
      </MemoryRouter>,
    );

    // The component should show login message
    expect(screen.getByText('Please log in to view this content.')).toBeInTheDocument();
  });
});
