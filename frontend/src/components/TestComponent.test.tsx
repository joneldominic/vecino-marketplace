import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TestComponent from './TestComponent';

// Mock the zustand stores
vi.mock('../store', () => ({
  useUiStore: () => ({
    isDarkMode: false,
    toggleDarkMode: vi.fn(),
  }),
  useAuthStore: () => ({
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

describe('TestComponent', () => {
  const queryClient = new QueryClient();

  it('renders correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent />
      </QueryClientProvider>,
    );

    expect(screen.getByText('Component Test')).toBeInTheDocument();
    expect(screen.getByText('Zustand Store Test:')).toBeInTheDocument();
    expect(screen.getByText('Backend API Test:')).toBeInTheDocument();
  });

  it('displays dark mode status correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent />
      </QueryClientProvider>,
    );

    expect(screen.getByText('Dark Mode: Off')).toBeInTheDocument();
  });

  it('displays auth status correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent />
      </QueryClientProvider>,
    );

    expect(screen.getByText('Auth Status: Logged Out')).toBeInTheDocument();
    expect(screen.getByText('Mock Login')).toBeInTheDocument();
  });
});
