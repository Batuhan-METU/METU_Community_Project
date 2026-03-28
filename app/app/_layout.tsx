import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import * as SecureStore from 'expo-secure-store';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AUTH_TOKEN_KEY } from '@/lib/api';
import { Colors, palette } from '@/constants/theme';

/* ─── Navigation (React-Navigation) themes ─── */
const darkNavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.bg,
    card: Colors.bg,
    text: Colors.text,
    border: Colors.border,
    primary: Colors.indigo,
  },
};

const lightNavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.light.background,
    card: palette.light.background,
    text: '#111827',
    border: '#e5e7eb',
    primary: Colors.indigo,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme !== 'light';

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

  /* ─── Android nav bar: force dark immediately on cold start ─── */
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    void (async () => {
      try {
        await NavigationBar.setBackgroundColorAsync('#0a0a0f');
        await NavigationBar.setButtonStyleAsync('light');
      } catch { /* best-effort */ }
    })();
  }, []); // empty dep → runs once at mount, before any frame is painted

  /* ─── Android nav bar: keep in sync when OS scheme changes ─── */
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    void (async () => {
      try {
        if (isDark) {
          await NavigationBar.setBackgroundColorAsync('#0a0a0f');
          await NavigationBar.setButtonStyleAsync('light');
        } else {
          await NavigationBar.setBackgroundColorAsync(palette.light.background);
          await NavigationBar.setButtonStyleAsync(palette.light.buttonStyle);
        }
      } catch { /* best-effort */ }
    })();
  }, [isDark]);

  const navTheme = isDark ? darkNavTheme : lightNavTheme;
  const statusStyle = isDark ? palette.dark.statusBarStyle : palette.light.statusBarStyle;
  const statusBg = isDark ? palette.dark.background : palette.light.background;

  if (isLoading) {
    return (
      <ThemeProvider value={navTheme}>
        <View style={[styles.loadingContainer, { backgroundColor: statusBg }]}>
          <ActivityIndicator size="large" color={Colors.indigo} />
        </View>
        <StatusBar style={statusStyle} backgroundColor={statusBg} translucent={false} />
      </ThemeProvider>
    );
  }

  return (
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
      </Stack>
      <StatusBar style={statusStyle} backgroundColor={statusBg} translucent={false} />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
