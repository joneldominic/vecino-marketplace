import { create } from 'zustand';

// UI store for theme and preferences
interface UiState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useUiStore = create<UiState>(set => ({
  isDarkMode: false,
  toggleDarkMode: () => set(state => ({ isDarkMode: !state.isDarkMode })),
}));

// Auth store for authentication state
interface AuthState {
  isAuthenticated: boolean;
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: false,
  user: null,
  login: async (email: string, _password: string) => {
    // Simulate login
    set({ isAuthenticated: true, user: { email } });
    localStorage.setItem('token', 'test-token');
    return true;
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
    localStorage.removeItem('token');
  },
}));
