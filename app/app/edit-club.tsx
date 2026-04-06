import { useMemo, useState } from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { MOCK_CLUBS } from '@/constants/mockClubs';
import { useStore } from '@/lib/useStore';

const CATEGORIES = ['music', 'technology', 'art', 'science', 'sports', 'business'];
const COVER_SIZE = 120;

export default function EditClubScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const overrides = useStore((s) => s.clubOverrides[id ?? '']);
  const updateClub = useStore((s) => s.updateClub);
  const userRoles = useStore((s) => s.userRoles);

  const canEdit = useMemo(() => {
    const r = userRoles.find((ur) => ur.clubId === id);
    return r?.role === 'ADMIN' || r?.role === 'EDITOR';
  }, [userRoles, id]);

  const adminRole = useMemo(() => {
    const r = userRoles.find((ur) => ur.clubId === id);
    return r?.role ?? null;
  }, [userRoles, id]);

  const base = useMemo(() => MOCK_CLUBS.find((c) => c.id === id) ?? null, [id]);

  const merged = useMemo(() => ({
    name: overrides?.name ?? base?.name ?? '',
    desc: overrides?.desc ?? base?.desc ?? '',
    category: overrides?.category ?? base?.category ?? '',
    aboutUs: overrides?.aboutUs ?? base?.aboutUs ?? '',
    instagram: overrides?.socialLinks?.instagram ?? '',
    twitter: overrides?.socialLinks?.twitter ?? '',
    website: overrides?.socialLinks?.website ?? '',
  }), [overrides, base]);

  const [name, setName] = useState(merged.name);
  const [desc, setDesc] = useState(merged.desc);
  const [category, setCategory] = useState(merged.category);
  const [aboutUs, setAboutUs] = useState(merged.aboutUs);
  const [instagram, setInstagram] = useState(merged.instagram);
  const [twitter, setTwitter] = useState(merged.twitter);
  const [website, setWebsite] = useState(merged.website);

  const hasChanges =
    name !== merged.name ||
    desc !== merged.desc ||
    category !== merged.category ||
    aboutUs !== merged.aboutUs ||
    instagram !== merged.instagram ||
    twitter !== merged.twitter ||
    website !== merged.website;

  const handleSave = () => {
    if (!id || !name.trim()) return;
    updateClub(id, {
      name: name.trim(),
      desc: desc.trim(),
      category,
      aboutUs: aboutUs.trim(),
      socialLinks: {
        instagram: instagram.trim() || undefined,
        twitter: twitter.trim() || undefined,
        website: website.trim() || undefined,
      },
    });
    Alert.alert('Saved', 'Community page updated successfully.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  if (!base || !canEdit) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.centered}>
          <Ionicons name="lock-closed-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>Access Denied</Text>
          <Text style={styles.emptyText}>You don't have permission to edit this community.</Text>
          <Pressable style={styles.backLink} onPress={() => router.back()}>
            <Text style={styles.backLinkText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerBtn} hitSlop={12}>
            <Ionicons name="close" size={20} color={Colors.text} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Edit Community</Text>
            <View style={styles.rolePill}>
              <Ionicons name="shield-checkmark" size={10} color={Colors.amber} />
              <Text style={styles.rolePillText}>{adminRole}</Text>
            </View>
          </View>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Cover + Avatar placeholders ── */}
          <View style={styles.mediaSection}>
            <Pressable
              style={styles.coverPlaceholder}
              onPress={() => Alert.alert('Coming Soon', 'Cover image picker will be available in a future update.')}
            >
              <LinearGradient
                colors={['#1a1a2a', '#0d0d14']}
                style={StyleSheet.absoluteFill}
              />
              <Ionicons name="image-outline" size={28} color={Colors.textMuted} />
              <Text style={styles.coverText}>Change Cover</Text>
            </Pressable>
            <Pressable
              style={styles.avatarPlaceholder}
              onPress={() => Alert.alert('Coming Soon', 'Profile picture picker will be available in a future update.')}
            >
              <Text style={styles.avatarInitial}>{name.charAt(0).toUpperCase()}</Text>
              <View style={styles.avatarCameraBadge}>
                <Ionicons name="camera" size={12} color={Colors.white} />
              </View>
            </Pressable>
          </View>

          {/* ── Form ── */}
          <View style={styles.form}>
            <Field label="Club Name" icon="text-outline">
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Community name"
                placeholderTextColor={Colors.textMuted}
                maxLength={60}
              />
            </Field>

            <Field label="Short Description" icon="document-text-outline">
              <TextInput
                style={[styles.input, styles.inputMulti]}
                value={desc}
                onChangeText={setDesc}
                placeholder="One-liner description..."
                placeholderTextColor={Colors.textMuted}
                multiline
                maxLength={120}
              />
            </Field>

            {/* Category selector */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Category</Text>
              <View style={styles.catRow}>
                {CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat}
                    style={[styles.catChip, category === cat && styles.catChipActive]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[styles.catChipText, category === cat && styles.catChipTextActive]}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Field label="About Us" icon="information-circle-outline">
              <TextInput
                style={[styles.input, styles.inputLarge]}
                value={aboutUs}
                onChangeText={setAboutUs}
                placeholder="Tell people about your community..."
                placeholderTextColor={Colors.textMuted}
                multiline
                textAlignVertical="top"
              />
            </Field>

            {/* Social links */}
            <View style={styles.socialSection}>
              <Text style={styles.socialTitle}>Social Links</Text>
              <SocialField
                icon="logo-instagram"
                placeholder="instagram.com/yourclub"
                value={instagram}
                onChangeText={setInstagram}
              />
              <SocialField
                icon="logo-twitter"
                placeholder="twitter.com/yourclub"
                value={twitter}
                onChangeText={setTwitter}
              />
              <SocialField
                icon="globe-outline"
                placeholder="https://yourclub.com"
                value={website}
                onChangeText={setWebsite}
              />
            </View>
          </View>

          {/* ── Save ── */}
          <Pressable
            style={({ pressed }) => [
              styles.saveBtn,
              !hasChanges && styles.saveBtnDisabled,
              pressed && hasChanges && { opacity: 0.85 },
            ]}
            onPress={handleSave}
            disabled={!hasChanges || !name.trim()}
          >
            <Ionicons name="checkmark-circle" size={18} color={hasChanges ? Colors.black : Colors.textMuted} />
            <Text style={[styles.saveBtnText, !hasChanges && styles.saveBtnTextDisabled]}>
              Save Changes
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ── Field wrapper ── */
function Field({ label, icon, children }: { label: string; icon: string; children: React.ReactNode }) {
  return (
    <View style={styles.fieldGroup}>
      <View style={styles.fieldLabelRow}>
        <Ionicons name={icon as any} size={14} color={Colors.textMuted} />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      <View style={styles.inputWrap}>{children}</View>
    </View>
  );
}

/* ── Social field ── */
function SocialField({
  icon,
  placeholder,
  value,
  onChangeText,
}: {
  icon: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
}) {
  return (
    <View style={styles.socialRow}>
      <Ionicons name={icon as any} size={18} color={Colors.textSecondary} />
      <TextInput
        style={styles.socialInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        autoCapitalize="none"
        keyboardType="url"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: Colors.bg },

  centered: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    padding: Spacing.xxl, gap: Spacing.md,
  },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text },
  emptyText: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', maxWidth: 260 },
  backLink: { marginTop: Spacing.md },
  backLinkText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.indigo },

  /* ── Header ── */
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.bgElevated, borderWidth: 1, borderColor: Colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: { alignItems: 'center', gap: 4 },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  rolePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(251,191,36,0.1)', borderRadius: Radius.full,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  rolePillText: { fontSize: 9, fontWeight: FontWeight.bold, color: Colors.amber, letterSpacing: 0.5 },

  scroll: { paddingHorizontal: Spacing.xxl, paddingTop: Spacing.lg },

  /* ── Media ── */
  mediaSection: { alignItems: 'center', marginBottom: Spacing.xxl },
  coverPlaceholder: {
    width: '100%', height: COVER_SIZE, borderRadius: Radius.lg,
    backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border,
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden', gap: 6,
  },
  coverText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textMuted },
  avatarPlaceholder: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.bgCard, borderWidth: 3, borderColor: Colors.bg,
    justifyContent: 'center', alignItems: 'center',
    marginTop: -36,
  },
  avatarInitial: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Colors.metuRed },
  avatarCameraBadge: {
    position: 'absolute', bottom: -2, right: -2,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.metuRed, borderWidth: 2, borderColor: Colors.bg,
    justifyContent: 'center', alignItems: 'center',
  },

  /* ── Form ── */
  form: { gap: Spacing.xl },
  fieldGroup: { gap: Spacing.sm },
  fieldLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  fieldLabel: {
    fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  inputWrap: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border, paddingHorizontal: Spacing.lg,
  },
  input: {
    fontSize: FontSize.base, fontWeight: FontWeight.medium, color: Colors.text,
    paddingVertical: Spacing.lg,
  },
  inputMulti: { minHeight: 60, textAlignVertical: 'top' },
  inputLarge: { minHeight: 120, textAlignVertical: 'top', lineHeight: 22 },

  /* Category chips */
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  catChip: {
    backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.full, paddingHorizontal: Spacing.lg, paddingVertical: 7,
  },
  catChipActive: { backgroundColor: 'rgba(251,191,36,0.12)', borderColor: 'rgba(251,191,36,0.35)' },
  catChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  catChipTextActive: { color: Colors.amber },

  /* Social */
  socialSection: { gap: Spacing.md, marginTop: Spacing.md },
  socialTitle: {
    fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  socialRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.bgCard, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border, paddingHorizontal: Spacing.lg,
  },
  socialInput: {
    flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.text,
    paddingVertical: Spacing.md,
  },

  /* ── Save ── */
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.amber, paddingVertical: 16, borderRadius: Radius.md,
    marginTop: Spacing.xxxl,
  },
  saveBtnDisabled: {
    backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border,
  },
  saveBtnText: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.black },
  saveBtnTextDisabled: { color: Colors.textMuted },
});
