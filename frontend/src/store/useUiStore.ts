import { create } from 'zustand';

interface UiState {
  isDarkMode: boolean;
  sidebarOpen: boolean;
  activeModal: string | null;
  
  // Actions
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isDarkMode: localStorage.getItem('darkMode') === 'true',
  sidebarOpen: false,
  activeModal: null,
  
  toggleDarkMode: () => {
    set((state) => {
      const newDarkMode = !state.isDarkMode;
      localStorage.setItem('darkMode', newDarkMode.toString());
      return { isDarkMode: newDarkMode };
    });
  },
  
  toggleSidebar: () => set((state) => ({ 
    sidebarOpen: !state.sidebarOpen 
  })),
  
  openModal: (modalId) => set({ 
    activeModal: modalId 
  }),
  
  closeModal: () => set({ 
    activeModal: null 
  }),
})); 