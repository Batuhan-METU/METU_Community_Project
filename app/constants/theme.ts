export const Colors = {
  // Backgrounds
  bg: '#ffffff',
  bgSecondary: '#f9fafb',       // gray-50
  bgCard: '#ffffff',
  bgDark: '#0f172a',            // slate-900
  bgDarkCard: '#020617',        // slate-950/95

  // Text
  text: '#111827',              // gray-900
  textSecondary: '#6b7280',     // gray-500
  textMuted: '#9ca3af',         // gray-400
  textOnDark: '#f8fafc',        // slate-50
  textOnDarkMuted: '#94a3b8',   // slate-400

  // Accent / brand
  indigo: '#6366f1',            // indigo-500
  violet: '#8b5cf6',            // violet-500
  fuchsia: '#d946ef',           // fuchsia-500
  emerald: '#10b981',           // emerald-500
  teal: '#14b8a6',              // teal-500
  cyan: '#06b6d4',              // cyan-500
  orange: '#f97316',            // orange-400
  green: '#22c55e',             // green-500

  // Neutrals (used for borders, inputs, filter chips)
  neutral50: '#fafafa',
  neutral100: '#f5f5f5',
  neutral200: '#e5e5e5',
  neutral300: '#d4d4d4',
  neutral400: '#a3a3a3',
  neutral500: '#737373',
  neutral700: '#404040',
  neutral800: '#262626',
  neutral900: '#171717',

  // Borders
  border: '#e5e7eb',            // gray-200
  borderDark: '#1e293b',        // slate-800

  // Status
  danger: '#ef4444',
  white: '#ffffff',
  black: '#000000',
};

export const Gradients = {
  eventCardBg: ['#6366f1', '#d946ef', '#f97316'] as const,   // indigo → fuchsia → orange
  communityCardBg: ['#10b981', '#14b8a6', '#06b6d4'] as const,    // emerald → teal → cyan
  accentBtn: ['#6366f1', '#8b5cf6'] as const,                // indigo → violet
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
  '2xl': 16,   // rounded-2xl equivalent
  full: 9999,
};

export const FontSize = {
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
