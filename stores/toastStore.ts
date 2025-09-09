import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastState {
  id: string;
  message: string;
  type: ToastType;
  isVisible: boolean;
  duration: number;
}

export interface ToastStore {
  toast: ToastState | null;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
  clearToast: () => void;
}

const useToastStore = create<ToastStore>()((set, get) => ({
  toast: null,

  showToast: (message: string, type: ToastType = 'info', duration: number = 3000) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    
    set({
      toast: {
        id,
        message,
        type,
        isVisible: true,
        duration,
      },
    });

    // Auto-dismiss after specified duration
    if (duration > 0) {
      setTimeout(() => {
        const currentToast = get().toast;
        if (currentToast && currentToast.id === id) {
          get().hideToast();
        }
      }, duration);
    }
  },

  hideToast: () => {
    set((state) => ({
      toast: state.toast ? { ...state.toast, isVisible: false } : null,
    }));

    // Clear toast completely after animation finishes
    setTimeout(() => {
      get().clearToast();
    }, 300); // Animation duration
  },

  clearToast: () => {
    set({ toast: null });
  },
}));

export default useToastStore;