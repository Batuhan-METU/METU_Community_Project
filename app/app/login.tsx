import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Warning', 'Email and password required.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert('Error', data.error || 'Login failed.');
        return;
      }
      router.replace('/');
    } catch {
      Alert.alert('Error', 'Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inner}>
        <View style={styles.logoBox}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>METU</Text>
          </View>
          <Text style={styles.title}>Login to METUCom</Text>
          <Text style={styles.subtitle}>Access events and your personal profile</Text>
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@metu.edu.tr"
              placeholderTextColor={Colors.neutral400}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={Colors.neutral400}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <Pressable style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
            <Text style={styles.loginText}>{loading ? 'Logging in...' : 'Login'}</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>Back to Home</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.xxxl },

  logoBox: { alignItems: 'center', marginBottom: Spacing.xxxl },
  logoBadge: {
    backgroundColor: Colors.black,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radius.full,
    marginBottom: Spacing.lg,
  },
  logoBadgeText: { color: Colors.white, fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 4 },

  form: { gap: Spacing.lg },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.bg,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.neutral300,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  loginBtn: {
    backgroundColor: Colors.black,
    paddingVertical: 14,
    borderRadius: Radius.full,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  loginText: { color: Colors.white, fontSize: FontSize.base, fontWeight: FontWeight.medium },

  backBtn: { alignItems: 'center', marginTop: Spacing.xxl },
  backText: { fontSize: FontSize.sm, color: Colors.textSecondary },
});
