/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import { UserRole } from 'shared/types/user.types';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, _password: string, role: UserRole) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // This is a mock implementation
      // In a real app, you would call your API here
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock successful login
      const mockUser = {
        id: '1',
        name: 'Test User',
        email,
        role: UserRole.BUYER,
      };
      const mockToken = 'mock-jwt-token';

      localStorage.setItem('token', mockToken);
      set({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (_error) {
      set({
        error: 'Invalid email or password',
        isLoading: false,
        isAuthenticated: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  register: async (name, email, _password, role) => {
    set({ isLoading: true, error: null });
    try {
      // This is a mock implementation
      // In a real app, you would call your API here
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock successful registration
      const mockUser = {
        id: '1',
        name,
        email,
        role,
      };
      const mockToken = 'mock-jwt-token';

      localStorage.setItem('token', mockToken);
      set({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (_error) {
      set({
        error: 'Registration failed',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
