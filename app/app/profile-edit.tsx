import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { useStore } from '@/lib/useStore';

const BIO_MAX = 150;
const AVATAR_SIZE = 100;

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const profile = useStore((s) => s.userProfile);
  const updateProfile = useStore((s) => s.updateProfile);

  const [name, setName] = useState(profile.name);
  const [department, setDepartment] = useState(profile.department);
  const [bio, setBio] = useState(profile.bio);

  const canSave =
    name.trim().length > 0 &&
    (name !== profile.name || department !== profile.department || bio !== profile.bio);

  const handleSave = () => {
    updateProfile({
      name: name.trim(),
      department: department.trim(),
      bio: bio.trim(),
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={12}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Avatar ── */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarRing}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {name.trim().charAt(0).toUpperCase() || 'E'}
                </Text>
              </View>
              <Pressable
                style={styles.cameraOverlay}
                onPress={() => Alert.alert('Coming Soon', 'Photo picker will be available in a future update.')}
              >
                <Ionicons name="camera" size={16} color={Colors.white} />
              </Pressable>
            </View>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </View>

          {/* ── Form fields ── */}
          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={16} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="words"
                  returnKeyType="next"
                  maxLength={40}
                />
              </View>
            </View>

            {/* Department */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Department</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="school-outline" size={16} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder="e.g. Computer Engineering"
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="words"
                  returnKeyType="next"
                  maxLength={60}
                />
              </View>
            </View>

            {/* Bio */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldLabelRow}>
                <Text style={styles.fieldLabel}>Bio</Text>
                <Text style={[styles.charCount, bio.length >= BIO_MAX && styles.charCountMax]}>
                  {bio.length}/{BIO_MAX}
                </Text>
              </View>
              <View style={[styles.inputWrap, styles.inputWrapMultiline]}>
                <TextInput
                  style={[styles.input, styles.inputMultiline]}
                  value={bio}
                  onChangeText={(t) => setBio(t.slice(0, BIO_MAX))}
                  placeholder="Tell people a bit about yourself..."
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  maxLength={BIO_MAX}
                />
              </View>
            </View>
          </View>

          {/* ── Save button ── */}
          <Pressable
            style={({ pressed }) => [
              styles.saveBtn,
              !canSave && styles.saveBtnDisabled,
              pressed && canSave && { opacity: 0.85 },
            ]}
            onPress={handleSave}
            disabled={!canSave}
          >
            <Ionicons name="checkmark-circle" size={18} color={canSave ? Colors.white : Colors.textMuted} />
            <Text style={[styles.saveBtnText, !canSave && styles.saveBtnTextDisabled]}>
              Save Changes
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },

  scroll: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxl,
  },

  /* ── Avatar ── */
  avatarSection: {
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xxxl,
  },
  avatarRing: {
    width: AVATAR_SIZE + 8,
    height: AVATAR_SIZE + 8,
    borderRadius: (AVATAR_SIZE + 8) / 2,
    borderWidth: 2.5,
    borderColor: Colors.metuRed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: Colors.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.bold,
    color: Colors.metuRed,
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.metuRed,
    borderWidth: 3,
    borderColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.metuRed,
  },

  /* ── Form ── */
  form: {
    gap: Spacing.xl,
    marginBottom: Spacing.xxxl,
  },
  fieldGroup: {
    gap: Spacing.sm,
  },
  fieldLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    fontSize: FontSize.xxs,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  charCountMax: {
    color: Colors.danger,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
  },
  inputWrapMultiline: {
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    paddingVertical: Spacing.lg,
  },
  inputMultiline: {
    minHeight: 100,
    paddingVertical: 0,
    lineHeight: 22,
  },

  /* ── Save ── */
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.metuRed,
    paddingVertical: 16,
    borderRadius: Radius.md,
  },
  saveBtnDisabled: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  saveBtnText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  saveBtnTextDisabled: {
    color: Colors.textMuted,
  },
});
