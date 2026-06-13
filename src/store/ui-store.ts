import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  isModalOpen: boolean;
  activeModal: string | null;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  mobileMenuOpen: false,
  isModalOpen: false,
  activeModal: null,

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) =>
    set({ sidebarOpen: open }),

  toggleMobileMenu: () =>
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

  setMobileMenuOpen: (open) =>
    set({ mobileMenuOpen: open }),

  openModal: (modalId) =>
    set({ isModalOpen: true, activeModal: modalId }),

  closeModal: () =>
    set({ isModalOpen: false, activeModal: null }),
}));
