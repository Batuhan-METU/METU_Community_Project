import { useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import { Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { api, AUTH_TOKEN_KEY } from '@/lib/api';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Warning', 'Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      const data = await api.login(email, password);
      const accessToken = data?.session?.access_token;
      if (accessToken) {
        await SecureStore.setItemAsync(AUTH_TOKEN_KEY, accessToken);
      }
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert(
        'Error',
        e instanceof Error ? e.message : 'Could not connect to server.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/kapak.jpg')}
      style={styles.bg}
      resizeMode="cover">
      {/* Light icons on this dark background */}
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.center}>
        <View style={styles.card}>
          {/* Glassmorphism blur layer */}
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.cardInner}>
            {/* Logo */}
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>METU</Text>
            </View>
            <Text style={styles.title}>Login to METUHub</Text>
            <Text style={styles.subtitle}>
              Access events and your personal profile
            </Text>

            {/* Form */}
            <View style={styles.form}>
              <View>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="you@metu.edu.tr"
                  placeholderTextColor="rgba(107,114,128,1)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              <View>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="rgba(107,114,128,1)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                />
              </View>

              <Pressable
                style={({ pressed }) => [styles.loginBtn, pressed && styles.loginBtnPressed]}
                onPress={handleLogin}
                disabled={loading}>
                <Text style={styles.loginBtnText}>
                  {loading ? 'Logging in...' : 'Login'}
                </Text>
              </Pressable>
            </View>

            {/* Footer link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <Pressable onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.footerLink}>Register</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },

  card: {
    borderRadius: Radius['2xl'],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  cardInner: {
    padding: Spacing.xxxl,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  logoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginBottom: Spacing.xl,
  },
  logoText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: '#000000',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.85)',
    marginTop: Spacing.xs,
    marginBottom: Spacing.xxl,
  },

  form: {
    gap: Spacing.lg,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: '#ffffff',
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(209,213,219,1)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: FontSize.sm,
    color: '#111827',
  },
  loginBtn: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: Radius.full,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  loginBtnPressed: {
    backgroundColor: '#e5e7eb',
  },
  loginBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: '#000000',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  footerText: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.85)',
  },
  footerLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: '#ffffff',
    textDecorationLine: 'underline',
  },
});
