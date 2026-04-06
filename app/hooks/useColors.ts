import { createContext, useContext } from 'react';
import { ColorsDark, ColorsLight, type ThemeColors } from '@/constants/theme';

export type { ThemeColors };

export type ThemeContextValue = {
  colors: ThemeColors;
  isDark: boolean;
};

export const ThemeContext = createContext<ThemeContextValue>({
  colors: ColorsDark,
  isDark: true,
});

export function useColors(): ThemeContextValue {
  return useContext(ThemeContext);
}

export function resolveScheme(
  setting: 'system' | 'light' | 'dark',
  systemScheme: 'light' | 'dark' | null | undefined,
): boolean {
  if (setting === 'light') return false;
  if (setting === 'dark') return true;
  return systemScheme !== 'light';
}

export function colorsFor(isDark: boolean): ThemeColors {
  return isDark ? ColorsDark : ColorsLight;
}
