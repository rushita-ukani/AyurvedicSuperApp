import { create } from 'zustand';
import { ThemeMode, Language, FeatureFlags, ToastMessage } from '../types';
import { apiClient } from '../api/apiClient';

interface AppState {
  themeMode: ThemeMode;
  language: Language;
  featureFlags: FeatureFlags;
  isOffline: boolean;
  simulateSlowNetwork: boolean;
  simulateRandomFailures: boolean;
  toasts: ToastMessage[];

  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  setLanguage: (lang: Language) => void;
  toggleOfflineMode: (force?: boolean) => void;
  toggleSlowNetwork: (enable?: boolean) => void;
  toggleRandomFailures: (enable?: boolean) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  toggleFeatureFlag: (flagKey: keyof FeatureFlags) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  themeMode: 'light',
  language: 'en',
  featureFlags: {
    enableBiometrics: true,
    enableOfflineQueue: true,
    enableDevMenu: true,
    enableHindiLanguage: true,
  },
  isOffline: false,
  simulateSlowNetwork: false,
  simulateRandomFailures: false,
  toasts: [],

  setThemeMode: (mode: ThemeMode) => set({ themeMode: mode }),

  setLanguage: (lang: Language) => set({ language: lang }),

  toggleOfflineMode: (force?: boolean) => {
    const nextState = force !== undefined ? force : !get().isOffline;
    apiClient.updateConfig({ simulateOffline: nextState });
    set({ isOffline: nextState });
    get().addToast({
      type: nextState ? 'warning' : 'success',
      message: nextState ? 'Offline Mode Enabled' : 'Back Online!',
      description: nextState ? 'Bookings & cart changes will be queued locally.' : 'Syncing pending offline queue...',
    });
  },

  toggleSlowNetwork: (enable?: boolean) => {
    const nextState = enable !== undefined ? enable : !get().simulateSlowNetwork;
    apiClient.updateConfig({ simulateSlowNetwork: nextState });
    set({ simulateSlowNetwork: nextState });
  },

  toggleRandomFailures: (enable?: boolean) => {
    const nextState = enable !== undefined ? enable : !get().simulateRandomFailures;
    apiClient.updateConfig({ simulateRandomFailures: nextState });
    set({ simulateRandomFailures: nextState });
  },

  addToast: (toast) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastMessage = { id, durationMs: 4000, ...toast };
    set(state => ({ toasts: [...state.toasts, newToast] }));

    setTimeout(() => {
      get().removeToast(id);
    }, newToast.durationMs);
  },

  removeToast: (id: string) => {
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
  },

  toggleFeatureFlag: (flagKey) => {
    set(state => ({
      featureFlags: {
        ...state.featureFlags,
        [flagKey]: !state.featureFlags[flagKey],
      },
    }));
  },
}));
