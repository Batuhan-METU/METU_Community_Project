import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import * as SecureStore from 'expo-secure-store';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AUTH_TOKEN_KEY } from '@/lib/api';
import { ColorsDark, ColorsLight, palette } from '@/constants/theme';
import { useStore } from '@/lib/useStore';
import { ThemeContext, resolveScheme, colorsFor } from '@/hooks/useColors';

export default function RootLayout() {
  const systemScheme = useColorScheme();
  const colorSchemeSetting = useStore((s) => s.colorSchemeSetting);
  const isDark = resolveScheme(colorSchemeSetting, systemScheme);
  const colors = colorsFor(isDark);

  const [isLoading, setIsLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  /* ─── Token check ─── */
  useEffect(() => {
    let cancelled = false;
    SecureStore.getItemAsync(AUTH_TOKEN_KEY).then((token) => {
      if (!cancelled) {
        setHasToken(!!token);
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  /* ─── Android nav bar: sync with effective scheme ─── */
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    void (async () => {
      try {
        if (isDark) {
          await NavigationBar.setBackgroundColorAsync(palette.dark.background);
          await NavigationBar.setButtonStyleAsync(palette.dark.buttonStyle);
        } else {
          await NavigationBar.setBackgroundColorAsync(palette.light.background);
          await NavigationBar.setButtonStyleAsync(palette.light.buttonStyle);
        }
      } catch { /* best-effort */ }
    })();
  }, [isDark]);

  const navTheme = useMemo(
    () =>
      isDark
        ? {
            ...DarkTheme,
            colors: {
              ...DarkTheme.colors,
              background: ColorsDark.bg,
              card: ColorsDark.bg,
              text: ColorsDark.text,
              border: ColorsDark.border,
              primary: ColorsDark.indigo,
            },
          }
        : {
            ...DefaultTheme,
            colors: {
              ...DefaultTheme.colors,
              background: ColorsLight.bg,
              card: ColorsLight.bg,
              text: ColorsLight.text,
              border: ColorsLight.border,
              primary: ColorsLight.indigo,
            },
          },
    [isDark],
  );

  const statusStyle = isDark ? palette.dark.statusBarStyle : palette.light.statusBarStyle;
  const statusBg = isDark ? palette.dark.background : palette.light.background;

  const themeCtx = useMemo(() => ({ colors, isDark }), [colors, isDark]);

  if (isLoading) {
    return (
      <ThemeContext.Provider value={themeCtx}>
        <ThemeProvider value={navTheme}>
          <View style={[styles.loadingContainer, { backgroundColor: statusBg }]}>
            <ActivityIndicator size="large" color={colors.indigo} />
          </View>
          <StatusBar style={statusStyle} backgroundColor={statusBg} translucent={false} />
        </ThemeProvider>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={themeCtx}>
      <ThemeProvider value={navTheme}>
        <Stack
          screenOptions={{ headerShown: false, animation: 'fade' }}
          initialRouteName={hasToken ? '(tabs)' : '(auth)'}
        >
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" options={{ presentation: 'modal' }} />
          <Stack.Screen name="event/[id]" />
          <Stack.Screen name="community/[id]" />
          <Stack.Screen name="hype" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="profile-edit" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="edit-club" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="create-post" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        </Stack>
        <StatusBar style={statusStyle} backgroundColor={statusBg} translucent={false} />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
