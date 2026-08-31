import { useEffect } from 'react';
import { useProgress, type ThemeMode } from '../state/progress';

/**
 * Keeps the <html> `dark` class in sync with the persisted theme preference,
 * and updates the browser chrome color to match. Light is the default; a
 * matching inline script in index.html applies the stored value before first
 * paint so there is never a flash of the wrong theme.
 */
export function useThemeSync(): void {
  const theme = useProgress((s) => s.theme);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    const meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0E0F12' : '#F4F5F7');
  }, [theme]);
}

/** Current theme plus a setter/toggle, for settings UI. */
export function useTheme(): { theme: ThemeMode; setTheme: (t: ThemeMode) => void; toggle: () => void } {
  const theme = useProgress((s) => s.theme);
  const setTheme = useProgress((s) => s.setTheme);
  return { theme, setTheme, toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark') };
}
