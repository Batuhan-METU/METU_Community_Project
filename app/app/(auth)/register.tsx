import { useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { api } from '@/lib/api';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Warning', 'All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Warning', 'Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await api.register(email, password, fullName);
      Alert.alert('Success', 'Account created! Please verify your email, then log in.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') },
      ]);
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
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.cardInner}>
              {/* Logo */}
              <View style={styles.logoBadge}>
                <Text style={styles.logoText}>METU</Text>
              </View>
              <Text style={styles.title}>Create your METUHub account</Text>
              <Text style={styles.subtitle}>
                Join communities, discover events, and build your campus profile
              </Text>

              {/* Form */}
              <View style={styles.form}>
                <View>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Your full name"
                    placeholderTextColor="rgba(107,114,128,1)"
                    value={fullName}
                    onChangeText={setFullName}
                    autoComplete="name"
                  />
                </View>

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
                    placeholder="Create a password"
                    placeholderTextColor="rgba(107,114,128,1)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoComplete="password-new"
                  />
                </View>

                <View>
                  <Text style={styles.label}>Confirm Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Re-enter your password"
                    placeholderTextColor="rgba(107,114,128,1)"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoComplete="password-new"
                  />
                </View>

                <Pressable
                  style={({ pressed }) => [styles.registerBtn, pressed && styles.registerBtnPressed]}
                  onPress={handleRegister}
                  disabled={loading}>
                  <Text style={styles.registerBtnText}>
                    {loading ? 'Creating account...' : 'Register'}
                  </Text>
                </Pressable>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <Pressable onPress={() => router.push('/(auth)/login')}>
                  <Text style={styles.footerLink}>Back to Login</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
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
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxxxl,
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
    lineHeight: 20,
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
  registerBtn: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: Radius.full,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  registerBtnPressed: {
    backgroundColor: '#e5e7eb',
  },
  registerBtnText: {
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
