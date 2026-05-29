import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';

export type Preferences = {
  preferredGenres: number[];
  adultContent: boolean;
  contentLanguage: string;
};

const defaultPreferences: Preferences = {
  preferredGenres: [],
  adultContent: false,
  contentLanguage: 'en-US'
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

  useEffect(() => {
    const data = storage.get();
    if (data.preferences) {
      setPreferences(data.preferences);
    }
  }, []);

  const updatePreferences = (newPrefs: Partial<Preferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPrefs };
      const data = storage.get();
      data.preferences = updated;
      storage.set(data);
      return updated;
    });
  };

  return { preferences, updatePreferences };
}
