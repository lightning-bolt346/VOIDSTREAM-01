export interface VoidStorage {
  history: any[];
  watchlist: any[];
  settings: {
    lastSourceId?: string;
  };
}

const STORAGE_KEY = 'voidstream_app_state_v1';

const defaultState: VoidStorage = {
  history: [],
  watchlist: [],
  settings: {}
};

export const storage = {
  get: (): VoidStorage => {
    if (typeof window === 'undefined') return defaultState;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse local storage', e);
    }
    return defaultState;
  },

  set: (data: Partial<VoidStorage>) => {
    if (typeof window === 'undefined') return;
    try {
      const current = storage.get();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...data }));
    } catch (e) {
      console.warn('Failed to save to local storage', e);
    }
  },

  clear: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }
};
