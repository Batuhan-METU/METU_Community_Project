/**
 * Per-scheme palette used by _layout.tsx to drive NavigationBar / StatusBar
 * dynamically whenever the OS color-scheme changes.
 */
export const palette = {
  dark: {
    background: '#0a0a0f',
    buttonStyle: 'light' as const,
    statusBarStyle: 'light' as const,
  },
  light: {
    background: '#ffffff',
    buttonStyle: 'dark' as const,
    statusBarStyle: 'dark' as const,
  },
} as const;

/* ─── Shared accent / brand tokens (identical in both schemes) ─── */
const shared = {
  metuRed: '#E30613',
  metuRedLight: '#ff3b4a',
  metuRedDim: 'rgba(227,6,19,0.15)',

  indigo: '#818cf8',
  violet: '#a78bfa',
  fuchsia: '#e879f9',
  emerald: '#34d399',
  teal: '#2dd4bf',
  cyan: '#22d3ee',
  orange: '#fb923c',
  green: '#4ade80',
  rose: '#fb7185',
  amber: '#fbbf24',
  sky: '#38bdf8',

  neutral50: '#fafafa',
  neutral100: '#f5f5f5',
  neutral200: '#e5e5e5',
  neutral300: '#d4d4d4',
  neutral400: '#a3a3a3',
  neutral500: '#737373',
  neutral600: '#525252',
  neutral700: '#404040',
  neutral800: '#262626',
  neutral900: '#171717',

  danger: '#f87171',
  success: '#34d399',
  white: '#ffffff',
  black: '#000000',
};

export const ColorsDark = {
  ...shared,
  bg: '#0a0a0f',
  bgElevated: '#12121a',
  bgCard: '#1a1a25',
  bgCardHover: '#22222f',
  bgInput: '#16161f',

  text: '#f0f0f5',
  textSecondary: '#9898a8',
  textMuted: '#5c5c6e',
  textOnAccent: '#ffffff',

  border: '#1e1e2e',
  borderSubtle: '#2a2a3a',
  borderAccent: '#818cf820',

  tabBarActive: '#ffffff',
};

export const ColorsLight = {
  ...shared,
  bg: '#ffffff',
  bgElevated: '#f5f5f5',
  bgCard: '#ffffff',
  bgCardHover: '#f0f0f0',
  bgInput: '#f0f0f2',

  text: '#111827',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  textOnAccent: '#ffffff',

  border: '#e5e7eb',
  borderSubtle: '#f3f4f6',
  borderAccent: '#818cf820',

  tabBarActive: '#111827',
};

export type ThemeColors = typeof ColorsDark;

/** Backward-compatible alias — unrefactored files keep compiling */
export const Colors = ColorsDark;

export const Gradients = {
  eventCardBg: ['#6366f1', '#a855f7', '#ec4899'] as const,
  communityCardBg: ['#10b981', '#06b6d4', '#3b82f6'] as const,
  accentBtn: ['#818cf8', '#a78bfa'] as const,
  surface: ['#12121a', '#0a0a0f'] as const,
  headerGlow: ['rgba(129,140,248,0.12)', 'rgba(168,85,247,0.06)', 'transparent'] as const,
  cardShine: ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0)'] as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const FontSize = {
  xxs: 10,
  xs: 11,
  sm: 13,
  base: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

export const FontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};
