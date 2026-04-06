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
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { MOCK_CLUBS } from '@/constants/mockClubs';
import { useStore, type AdminRole } from '@/lib/useStore';

type PostType = 'event' | 'announcement';

const DATE_PRESETS = [
  { label: 'Tomorrow', offset: 1 },
  { label: 'In 3 days', offset: 3 },
  { label: 'Next week', offset: 7 },
  { label: 'In 2 weeks', offset: 14 },
];

const CATEGORY_OPTIONS = ['Technology', 'Science', 'Art', 'Music', 'Sports', 'Business', 'Entertainment', 'Social'];

export default function CreatePostScreen() {
  const params = useLocalSearchParams<{ clubId?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const userRoles = useStore((s) => s.userRoles);
  const createEvent = useStore((s) => s.createEvent);
  const getUserRoleForClub = useStore((s) => s.getUserRoleForClub);

  const editableClubIds = useMemo(
    () => userRoles.filter((ur) => ur.role === 'ADMIN' || ur.role === 'EDITOR').map((ur) => ur.clubId),
    [userRoles],
  );

  const editableClubs = useMemo(
    () => MOCK_CLUBS.filter((c) => editableClubIds.includes(c.id)),
    [editableClubIds],
  );

  const [postType, setPostType] = useState<PostType>('event');
  const [selectedClubId, setSelectedClubId] = useState(params.clubId ?? editableClubs[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Technology');
  const [datePreset, setDatePreset] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState('');
  const [showClubPicker, setShowClubPicker] = useState(false);

  const selectedClub = MOCK_CLUBS.find((c) => c.id === selectedClubId);
  const selectedRole = getUserRoleForClub(selectedClubId);

  const canPublish = title.trim().length > 0 && selectedClubId.length > 0;

  function buildDateISO(daysFromNow: number): string {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    d.setHours(18, 0, 0, 0);
    return d.toISOString();
  }

  const handlePublish = () => {
    if (!canPublish) return;

    if (postType === 'event') {
      const newEvent = {
        id: `custom-${Date.now()}`,
        title: title.trim(),
        starts_at: buildDateISO(DATE_PRESETS[datePreset].offset),
        location: location.trim() || 'TBD',
        description: description.trim(),
        is_paid: isPaid,
        ticket_price: isPaid ? Number(price) || null : null,
        community: selectedClub?.name ?? '',
        communityId: selectedClubId,
        category,
      };
      createEvent(newEvent);
    }

    Alert.alert(
      'Published!',
      `Your ${postType} "${title.trim()}" has been published to ${selectedClub?.name ?? 'the community'}.`,
      [{ text: 'Great', onPress: () => router.back() }],
    );
  };

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
          <Text style={styles.headerTitle}>Create Content</Text>
          <Pressable
            style={[styles.publishHeaderBtn, !canPublish && styles.publishHeaderBtnDisabled]}
            onPress={handlePublish}
            disabled={!canPublish}
          >
            <Text style={[styles.publishHeaderText, !canPublish && styles.publishHeaderTextDisabled]}>
              Publish
            </Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Type selector ── */}
          <View style={styles.typeRow}>
            <TypeChip
              label="Event"
              icon="calendar"
              active={postType === 'event'}
              onPress={() => setPostType('event')}
            />
            <TypeChip
              label="Announcement"
              icon="megaphone"
              active={postType === 'announcement'}
              onPress={() => setPostType('announcement')}
            />
          </View>

          {/* ── Club targeting ── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Publishing as</Text>
            <Pressable
              style={styles.clubSelector}
              onPress={() => setShowClubPicker(!showClubPicker)}
            >
              <View style={styles.clubSelectorLeft}>
                <View style={styles.clubInitialCircle}>
                  <Text style={styles.clubInitialText}>
                    {selectedClub?.name.charAt(0).toUpperCase() ?? '?'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.clubSelectorName}>{selectedClub?.name ?? 'Select a club'}</Text>
                  {selectedRole && (
                    <RoleBadgeInline role={selectedRole} />
                  )}
                </View>
              </View>
              <Ionicons name={showClubPicker ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.textMuted} />
            </Pressable>

            {showClubPicker && (
              <View style={styles.clubDropdown}>
                {editableClubs.map((club) => (
                  <Pressable
                    key={club.id}
                    style={[styles.clubDropdownItem, club.id === selectedClubId && styles.clubDropdownItemActive]}
                    onPress={() => { setSelectedClubId(club.id); setShowClubPicker(false); }}
                  >
                    <View style={styles.clubInitialSmall}>
                      <Text style={styles.clubInitialSmallText}>{club.name.charAt(0)}</Text>
                    </View>
                    <Text style={[styles.clubDropdownText, club.id === selectedClubId && styles.clubDropdownTextActive]}>
                      {club.name}
                    </Text>
                    {club.id === selectedClubId && (
                      <Ionicons name="checkmark-circle" size={16} color={Colors.amber} />
                    )}
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* ── Title ── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Title</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder={postType === 'event' ? 'Event title...' : 'Announcement title...'}
                placeholderTextColor={Colors.textMuted}
                maxLength={80}
              />
            </View>
          </View>

          {/* ── Description ── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Description</Text>
            <View style={[styles.inputWrap, styles.inputWrapLarge]}>
              <TextInput
                style={[styles.input, styles.inputLarge]}
                value={description}
                onChangeText={setDescription}
                placeholder="Write a detailed description..."
                placeholderTextColor={Colors.textMuted}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* ── Event-specific fields ── */}
          {postType === 'event' && (
            <>
              {/* Date / time picker simulation */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Date</Text>
                <View style={styles.dateRow}>
                  {DATE_PRESETS.map((preset, i) => (
                    <Pressable
                      key={i}
                      style={[styles.dateChip, datePreset === i && styles.dateChipActive]}
                      onPress={() => setDatePreset(i)}
                    >
                      <Text style={[styles.dateChipText, datePreset === i && styles.dateChipTextActive]}>
                        {preset.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Location */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Location</Text>
                <View style={styles.inputWrap}>
                  <View style={styles.inputInner}>
                    <Ionicons name="location-outline" size={16} color={Colors.textMuted} />
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      value={location}
                      onChangeText={setLocation}
                      placeholder="e.g. METU Informatics Institute"
                      placeholderTextColor={Colors.textMuted}
                    />
                  </View>
                </View>
              </View>

              {/* Category */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.catRow}>
                    {CATEGORY_OPTIONS.map((cat) => (
                      <Pressable
                        key={cat}
                        style={[styles.catChip, category === cat && styles.catChipActive]}
                        onPress={() => setCategory(cat)}
                      >
                        <Text style={[styles.catChipText, category === cat && styles.catChipTextActive]}>
                          {cat}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Paid toggle */}
              <View style={styles.paidRow}>
                <View style={styles.paidLeft}>
                  <Ionicons name="ticket-outline" size={16} color={Colors.textSecondary} />
                  <Text style={styles.paidLabel}>Paid Event</Text>
                </View>
                <Pressable
                  style={[styles.toggle, isPaid && styles.toggleActive]}
                  onPress={() => setIsPaid(!isPaid)}
                >
                  <View style={[styles.toggleThumb, isPaid && styles.toggleThumbActive]} />
                </Pressable>
              </View>

              {isPaid && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Ticket Price (TL)</Text>
                  <View style={styles.inputWrap}>
                    <View style={styles.inputInner}>
                      <Text style={styles.currencySign}>₺</Text>
                      <TextInput
                        style={[styles.input, { flex: 1 }]}
                        value={price}
                        onChangeText={setPrice}
                        placeholder="0"
                        placeholderTextColor={Colors.textMuted}
                        keyboardType="numeric"
                        maxLength={6}
                      />
                    </View>
                  </View>
                </View>
              )}
            </>
          )}

          {/* ── Publish button ── */}
          <Pressable
            style={({ pressed }) => [
              styles.publishBtn,
              !canPublish && styles.publishBtnDisabled,
              pressed && canPublish && { opacity: 0.85 },
            ]}
            onPress={handlePublish}
            disabled={!canPublish}
          >
            <Ionicons
              name={postType === 'event' ? 'calendar' : 'megaphone'}
              size={18}
              color={canPublish ? Colors.white : Colors.textMuted}
            />
            <Text style={[styles.publishBtnText, !canPublish && styles.publishBtnTextDisabled]}>
              Publish {postType === 'event' ? 'Event' : 'Announcement'}
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ── Sub-components ── */

function TypeChip({ label, icon, active, onPress }: { label: string; icon: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.typeChip, active && styles.typeChipActive]} onPress={onPress}>
      <Ionicons name={icon as any} size={16} color={active ? Colors.amber : Colors.textMuted} />
      <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>{label}</Text>
    </Pressable>
  );
}

function RoleBadgeInline({ role }: { role: AdminRole }) {
  return (
    <View style={styles.inlineRoleBadge}>
      <Ionicons name="shield-checkmark" size={9} color={role === 'ADMIN' ? Colors.amber : Colors.sky} />
      <Text style={[styles.inlineRoleText, { color: role === 'ADMIN' ? Colors.amber : Colors.sky }]}>
        {role}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: Colors.bg },

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
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  publishHeaderBtn: {
    backgroundColor: Colors.metuRed, borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg, paddingVertical: 7,
  },
  publishHeaderBtnDisabled: { backgroundColor: Colors.bgCard },
  publishHeaderText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.white },
  publishHeaderTextDisabled: { color: Colors.textMuted },

  scroll: { paddingHorizontal: Spacing.xxl, paddingTop: Spacing.xl },

  /* ── Type selector ── */
  typeRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xxl },
  typeChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, paddingVertical: Spacing.lg,
  },
  typeChipActive: { backgroundColor: 'rgba(251,191,36,0.1)', borderColor: 'rgba(251,191,36,0.3)' },
  typeChipText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textMuted },
  typeChipTextActive: { color: Colors.amber },

  /* ── Club targeting ── */
  clubSelector: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, padding: Spacing.lg,
  },
  clubSelectorLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  clubInitialCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.bgElevated, borderWidth: 1, borderColor: Colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  clubInitialText: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.metuRed },
  clubSelectorName: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text },
  inlineRoleBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 1 },
  inlineRoleText: { fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 0.4 },

  clubDropdown: {
    backgroundColor: Colors.bgElevated, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, overflow: 'hidden',
  },
  clubDropdownItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border,
  },
  clubDropdownItemActive: { backgroundColor: 'rgba(251,191,36,0.06)' },
  clubInitialSmall: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.bgCard, justifyContent: 'center', alignItems: 'center',
  },
  clubInitialSmallText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textSecondary },
  clubDropdownText: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textSecondary },
  clubDropdownTextActive: { color: Colors.text, fontWeight: FontWeight.semibold },

  /* ── Fields ── */
  fieldGroup: { gap: Spacing.sm, marginBottom: Spacing.xl },
  fieldLabel: {
    fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  inputWrap: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border, paddingHorizontal: Spacing.lg,
  },
  inputWrapLarge: { minHeight: 120 },
  input: { fontSize: FontSize.base, fontWeight: FontWeight.medium, color: Colors.text, paddingVertical: Spacing.lg },
  inputLarge: { minHeight: 100, textAlignVertical: 'top', lineHeight: 22 },
  inputInner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  currencySign: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textSecondary },

  /* Date */
  dateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  dateChip: {
    backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.full, paddingHorizontal: Spacing.lg, paddingVertical: 8,
  },
  dateChipActive: { backgroundColor: 'rgba(251,191,36,0.12)', borderColor: 'rgba(251,191,36,0.35)' },
  dateChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  dateChipTextActive: { color: Colors.amber },

  /* Category */
  catRow: { flexDirection: 'row', gap: Spacing.sm },
  catChip: {
    backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.full, paddingHorizontal: Spacing.lg, paddingVertical: 7,
  },
  catChipActive: { backgroundColor: 'rgba(129,140,248,0.12)', borderColor: 'rgba(129,140,248,0.35)' },
  catChipText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  catChipTextActive: { color: Colors.indigo },

  /* Paid toggle */
  paidRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.bgCard, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.lg, marginBottom: Spacing.xl,
  },
  paidLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  paidLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.text },
  toggle: {
    width: 44, height: 24, borderRadius: 12,
    backgroundColor: Colors.bgInput, borderWidth: 1, borderColor: Colors.border,
    justifyContent: 'center', paddingHorizontal: 2,
  },
  toggleActive: { backgroundColor: Colors.metuRed, borderColor: Colors.metuRedLight },
  toggleThumb: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: Colors.textMuted,
  },
  toggleThumbActive: { alignSelf: 'flex-end', backgroundColor: Colors.white },

  /* ── Publish ── */
  publishBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.metuRed, paddingVertical: 16, borderRadius: Radius.md,
    marginTop: Spacing.lg,
  },
  publishBtnDisabled: {
    backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border,
  },
  publishBtnText: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.white },
  publishBtnTextDisabled: { color: Colors.textMuted },
});
