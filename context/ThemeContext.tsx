import React, { createContext, useContext, useEffect, useState } from 'react';
import { getDarkMode, setDarkMode, LightColors, DarkColors, ThemeColors } from '../lib/theme';

type ThemeContextType = {
  isDark: boolean;
  colors: ThemeColors;
  toggleDark: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: LightColors,
  toggleDark: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    getDarkMode().then(setIsDark);
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    setDarkMode(next);
  };

  return (
    <ThemeContext.Provider value={{ isDark, colors: isDark ? DarkColors : LightColors, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
