import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Appearance} from 'react-native';

export const THEME_STORAGE_KEY = 'theme';

export type ThemeColors = {
  background: string;
  surface: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  onPrimary: string;
  button: string;
  onButton: string;
  switchTrackOff: string;
  ripple: string;
  overlay: string;
  shadow: string;
  selection: string;
};

export const lightColors: ThemeColors = {
  background: '#F3F4F6',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  text: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  primary: '#2563EB',
  onPrimary: '#FFFFFF',
  button: '#111827',
  onButton: '#FFFFFF',
  switchTrackOff: '#D1D5DB',
  ripple: 'rgba(17, 24, 39, 0.12)',
  overlay: 'rgba(17, 24, 39, 0.35)',
  shadow: '#000000',
  selection: 'rgba(37, 99, 235, 0.25)',
};

export const darkColors: ThemeColors = {
  background: '#111827',
  surface: '#1F2937',
  border: '#374151',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  primary: '#3B82F6',
  onPrimary: '#FFFFFF',
  button: '#374151',
  onButton: '#F9FAFB',
  switchTrackOff: '#4B5563',
  ripple: 'rgba(249, 250, 251, 0.12)',
  overlay: 'rgba(0, 0, 0, 0.6)',
  shadow: '#000000',
  selection: 'rgba(59, 130, 246, 0.35)',
};

type ThemeContextValue = {
  isDark: boolean;
  colors: ThemeColors;
  setDarkTheme: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyNativeScheme(isDark: boolean) {
  Appearance.setColorScheme(isDark ? 'dark' : 'light');
}

export function ThemeProvider({children}: {children: ReactNode}) {
  const [isDark, setIsDark] = useState(
    () => Appearance.getColorScheme() === 'dark',
  );

  useEffect(() => {
    let cancelled = false;

    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then(stored => {
        if (cancelled || stored == null) {
          return;
        }

        const dark = stored === 'dark';
        setIsDark(dark);
        applyNativeScheme(dark);
      })
      .catch(error => {
        console.error('Failed to load theme', error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const setDarkTheme = useCallback((value: boolean) => {
    setIsDark(value);
    applyNativeScheme(value);
  }, []);

  const value = useMemo(
    () => ({
      isDark,
      colors: isDark ? darkColors : lightColors,
      setDarkTheme,
    }),
    [isDark, setDarkTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return ctx;
}
