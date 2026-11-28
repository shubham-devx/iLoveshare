'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  resolvedTheme: 'light',
  setTheme: () => {},
});

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(resolved: 'light' | 'dark') {
  const root = document.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  root.style.colorScheme = resolved;
}

function resolveTheme(t: Theme, enableSystem: boolean): 'light' | 'dark' {
  if (t === 'system') return enableSystem ? getSystemTheme() : 'light';
  return t;
}

/** Read stored theme preference without calling setState — safe for lazy state initializer */
function readStoredTheme(defaultTheme: Theme): Theme {
  if (typeof window === 'undefined') return defaultTheme;
  try {
    return (localStorage.getItem('theme') as Theme | null) ?? defaultTheme;
  } catch {
    return defaultTheme;
  }
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  attribute?: string; // kept for API compat — always uses 'class'
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  // Lazy initialisers — read from localStorage before first render, never setState in effect
  const [theme, setThemeState] = useState<Theme>(() => readStoredTheme(defaultTheme));
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() =>
    resolveTheme(readStoredTheme(defaultTheme), enableSystem)
  );

  const setTheme = useCallback(
    (t: Theme) => {
      try {
        localStorage.setItem('theme', t);
      } catch {}
      const resolved = resolveTheme(t, enableSystem);
      setThemeState(t);
      setResolvedTheme(resolved);

      if (disableTransitionOnChange) {
        const style = document.createElement('style');
        style.textContent =
          '*,*::before,*::after{-webkit-transition:none!important;transition:none!important}';
        document.head.appendChild(style);
        applyTheme(resolved);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => document.head.removeChild(style))
        );
      } else {
        applyTheme(resolved);
      }
    },
    [enableSystem, disableTransitionOnChange]
  );

  // Apply theme to DOM once on mount (and whenever theme changes externally via system preference)
  useEffect(() => {
    applyTheme(resolvedTheme);

    if (!enableSystem) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setThemeState((prev) => {
        if (prev === 'system') {
          const r = e.matches ? 'dark' : 'light';
          setResolvedTheme(r);
          applyTheme(r);
        }
        return prev;
      });
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Drop-in replacement for `import { useTheme } from 'next-themes'` */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
