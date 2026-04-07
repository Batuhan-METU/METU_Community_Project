import { useMemo } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { useColors, type ThemeColors } from '@/hooks/useColors';
import { MOCK_EVENTS_FOR_SCREEN } from '@/constants/mockEvents';
import { MOCK_CLUBS } from '@/constants/mockClubs';
import { useStore } from '@/lib/useStore';
import { clearStoredToken } from '@/lib/api';

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  music: 'musical-notes-outline',
  technology: 'hardware-chip-outline',
  art: 'color-palette-outline',
  science: 'telescope-outline',
  sports: 'football-outline',
  business: 'briefcase-outline',
};

type CommunityRole = {
  id: string;
  club: string;
  role: string;
  icon: keyof typeof Ionicons.glyphMap;
  isHighLevel: boolean;
};

function StatBlock({ value, label, styles }: { value: string; label: string; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.statBlock}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function RoleCard({ role }: { role: CommunityRole }) {
  const router = useRouter();
  const { colors } = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable
      style={({ pressed }) => [
        styles.roleCard,
        role.isHighLevel && styles.roleCardHighLevel,
        pressed && { opacity: 0.82, transform: [{ scale: 0.97 }] },
      ]}
      onPress={() => router.push(`/community/${role.id}`)}
    >
      <View
        style={[
          styles.roleIconBox,
          { backgroundColor: role.isHighLevel ? colors.metuRedDim : 'rgba(128,128,128,0.08)' },
        ]}
      >
        <Ionicons
          name={role.icon}
          size={18}
          color={role.isHighLevel ? colors.metuRed : colors.textSecondary}
        />
      </View>
      <View style={styles.roleInfo}>
        <Text style={styles.roleClub} numberOfLines={1}>{role.club}</Text>
        <Text
          style={[
            styles.roleTitle,
            role.isHighLevel && { color: colors.metuRedLight },
          ]}
        >
          {role.role}
        </Text>
      </View>
      {role.isHighLevel ? (
        <View style={styles.roleBadge}>
          <Ionicons name="shield-checkmark" size={12} color={colors.metuRed} />
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
      )}
    </Pressable>
  );
}

function MyEventCard({ event }: { event: (typeof MOCK_EVENTS_FOR_SCREEN)[number] }) {
  const router = useRouter();
  const { colors } = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const d = event.starts_at ? new Date(event.starts_at) : null;
  const dayNum = d ? d.getDate() : '';
  const monthSh = d ? d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase() : '';
  const timeStr = d
    ? d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    : '';

  return (
    <Pressable
      style={({ pressed }) => [styles.myEventCard, pressed && { opacity: 0.85 }]}
      onPress={() => router.push(`/event/${event.id}`)}
    >
      <View style={styles.myEventDateBox}>
        <Text style={styles.myEventDay}>{dayNum}</Text>
        <Text style={styles.myEventMonth}>{monthSh}</Text>
      </View>
      <Text style={styles.myEventTitle} numberOfLines={2}>{event.title}</Text>
      <View style={styles.myEventMeta}>
        {timeStr ? (
          <View style={styles.myEventMetaRow}>
            <Ionicons name="time-outline" size={10} color={colors.textMuted} />
            <Text style={styles.myEventMetaText}>{timeStr}</Text>
          </View>
        ) : null}
        {event.location ? (
          <View style={styles.myEventMetaRow}>
            <Ionicons name="location-outline" size={10} color={colors.textMuted} />
            <Text style={styles.myEventMetaText} numberOfLines={1}>{event.location}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const THEME_OPTIONS: { value: 'system' | 'light' | 'dark'; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'system', label: 'System', icon: 'phone-portrait-outline' },
  { value: 'light',  label: 'Light',  icon: 'sunny-outline' },
  { value: 'dark',   label: 'Dark',   icon: 'moon-outline' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const joinedClubIds = useStore((s) => s.joinedClubIds);
  const registeredEventIds = useStore((s) => s.registeredEventIds);
  const bookmarkedEventIds = useStore((s) => s.bookmarkedEventIds);
  const roleMap = useStore((s) => s.roleMap);
  const userProfile = useStore((s) => s.userProfile);
  const userRoles = useStore((s) => s.userRoles);
  const colorSchemeSetting = useStore((s) => s.colorSchemeSetting);
  const setColorSchemeSetting = useStore((s) => s.setColorSchemeSetting);

  const { colors, isDark } = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const roles: CommunityRole[] = useMemo(() => {
    return joinedClubIds.map((cid) => {
      const club = MOCK_CLUBS.find((c) => c.id === cid);
      const r = roleMap[cid];
      return {
        id: cid,
        club: club?.name ?? `Club #${cid}`,
        role: r?.role ?? 'Member',
        isHighLevel: r?.isHighLevel ?? false,
        icon: CATEGORY_ICONS[club?.category ?? ''] ?? ('people-outline' as keyof typeof Ionicons.glyphMap),
      };
    });
  }, [joinedClubIds, roleMap]);

  const topRoleLabel = useMemo(() => {
    const ranked = ['ADMIN', 'EDITOR'] as const;
    for (const rank of ranked) {
      const match = userRoles.find((ur) => ur.role === rank);
      if (match) {
        const club = MOCK_CLUBS.find((c) => c.id === match.clubId);
        const displayRole = roleMap[match.clubId]?.role ?? match.role;
        return `${displayRole} @ ${club?.name ?? 'Club'}`;
      }
    }
    return null;
  }, [userRoles, roleMap]);

  const myEvents = useMemo(() => {
    const regSet = new Set(registeredEventIds);
    return MOCK_EVENTS_FOR_SCREEN.filter((e) => regSet.has(e.id));
  }, [registeredEventIds]);

  const savedEvents = useMemo(() => {
    const bmSet = new Set(bookmarkedEventIds);
    return MOCK_EVENTS_FOR_SCREEN.filter((e) => bmSet.has(e.id));
  }, [bookmarkedEventIds]);

  const hasEvents = myEvents.length > 0;
  const hasSaved = savedEvents.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <View style={styles.headerBar}>
          <Text style={styles.screenTitle}>Profile</Text>
          <Pressable
            style={({ pressed }) => [styles.settingsBtn, pressed && { opacity: 0.7 }]}
            hitSlop={10}
          >
            <Ionicons name="settings-outline" size={18} color={colors.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.identityCard}>
          <LinearGradient
            colors={['rgba(227,6,19,0.08)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userProfile.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.userName}>{userProfile.name}</Text>
          <Text style={styles.userSub}>
            {userProfile.department}  •  {topRoleLabel ?? '2nd Year'}
          </Text>
          {topRoleLabel && (
            <View style={styles.topRolePill}>
              <Ionicons name="shield-checkmark" size={10} color={colors.amber} />
              <Text style={styles.topRolePillText}>{topRoleLabel}</Text>
            </View>
          )}

          <View style={styles.statsRow}>
            <StatBlock value={String(joinedClubIds.length)} label="Communities" styles={styles} />
            <View style={styles.statDivider} />
            <StatBlock value={String(registeredEventIds.length)} label="Events" styles={styles} />
            <View style={styles.statDivider} />
            <StatBlock value={String(roles.filter((r) => r.isHighLevel).length)} label="Roles" styles={styles} />
          </View>

          <Pressable
            style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.8 }]}
            onPress={() => router.push('/profile-edit')}
          >
            <Ionicons name="create-outline" size={14} color={colors.text} />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* ── Theme selector ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={16} color={colors.metuRed} />
              <Text style={styles.sectionTitle}>Appearance</Text>
            </View>
          </View>
          <View style={styles.themeRow}>
            {THEME_OPTIONS.map((opt) => {
              const active = colorSchemeSetting === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  style={[styles.themeOption, active && styles.themeOptionActive]}
                  onPress={() => setColorSchemeSetting(opt.value)}
                >
                  <Ionicons
                    name={opt.icon}
                    size={18}
                    color={active ? colors.metuRed : colors.textMuted}
                  />
                  <Text style={[styles.themeLabel, active && styles.themeLabelActive]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── Community Roles ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Community Roles</Text>
              <Text style={styles.sectionSub}>Your current positions across communities</Text>
            </View>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>{roles.length}</Text>
            </View>
          </View>

          {roles.length > 0 ? (
            <FlatList
              data={roles}
              horizontal
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rolesRow}
              ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
              renderItem={({ item }) => <RoleCard role={item} />}
            />
          ) : (
            <View style={styles.emptyRolesCard}>
              <Ionicons name="people-outline" size={28} color={colors.textMuted} />
              <Text style={styles.emptyRolesText}>Join a community to see your roles here</Text>
              <Pressable
                style={({ pressed }) => [styles.emptyBtn, pressed && { backgroundColor: colors.metuRedLight }]}
                onPress={() => router.push('/(tabs)/communities')}
              >
                <Text style={styles.emptyBtnText}>Browse Clubs</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* ── My Events ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>My Events</Text>
              {hasEvents && (
                <Text style={styles.sectionSub}>{myEvents.length} upcoming</Text>
              )}
            </View>
            {hasEvents && (
              <Pressable onPress={() => router.push('/(tabs)/events')} hitSlop={8}>
                <Text style={styles.seeAll}>See all</Text>
              </Pressable>
            )}
          </View>

          {hasEvents ? (
            <FlatList
              data={myEvents}
              horizontal
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.eventsRow}
              ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
              renderItem={({ item }) => <MyEventCard event={item} />}
            />
          ) : (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="calendar-outline" size={32} color={colors.textMuted} />
                <View style={styles.emptyStarBadge}>
                  <Ionicons name="star" size={10} color={colors.amber} />
                </View>
              </View>
              <Text style={styles.emptyTitle}>No events yet</Text>
              <Text style={styles.emptyText}>
                Events you join will show up here.
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.emptyBtn,
                  pressed && { backgroundColor: colors.metuRedLight },
                ]}
                onPress={() => router.push('/(tabs)/events')}
              >
                <Ionicons name="compass-outline" size={15} color={colors.white} />
                <Text style={styles.emptyBtnText}>Explore events</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* ── Saved Events ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="bookmark" size={16} color={colors.amber} />
              <Text style={styles.sectionTitle}>Saved Events</Text>
            </View>
            {hasSaved && (
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>{savedEvents.length}</Text>
              </View>
            )}
          </View>

          {hasSaved ? (
            <FlatList
              data={savedEvents}
              horizontal
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.eventsRow}
              ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
              renderItem={({ item }) => <MyEventCard event={item} />}
            />
          ) : (
            <View style={styles.emptySavedCard}>
              <Ionicons name="bookmark-outline" size={28} color={colors.textMuted} />
              <Text style={styles.emptySavedText}>
                You haven't saved any events yet.
              </Text>
              <Text style={styles.emptySavedHint}>
                Tap the bookmark icon on any event to save it here.
              </Text>
            </View>
          )}
        </View>

        {/* ── Quick actions ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { paddingHorizontal: Spacing.xxl }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {([
              { icon: 'bookmark-outline' as const,   label: 'Saved',       color: colors.indigo },
              { icon: 'notifications-outline' as const, label: 'Notifications', color: colors.amber },
              { icon: 'shield-checkmark-outline' as const, label: 'Privacy',   color: colors.emerald },
              { icon: 'help-circle-outline' as const, label: 'Help',        color: colors.sky },
            ] as const).map((action) => (
              <Pressable
                key={action.label}
                style={({ pressed }) => [styles.actionItem, pressed && { opacity: 0.8 }]}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '18' }]}>
                  <Ionicons name={action.icon} size={18} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Logout ── */}
        <Pressable
          style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.7 }]}
          onPress={async () => {
            await clearStoredToken();
            router.replace('/(auth)/login');
          }}
        >
          <Ionicons name="log-out-outline" size={16} color={colors.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const AVATAR_SIZE = 88;
const AVATAR_RING = AVATAR_SIZE + 8;
const ROLE_CARD_WIDTH = 200;
const EVENT_CARD_WIDTH = 180;

function createStyles(C: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    scroll: { paddingBottom: 40 },

    headerBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.xxl,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.md,
    },
    screenTitle: {
      fontSize: FontSize['2xl'],
      fontWeight: FontWeight.bold,
      color: C.text,
      letterSpacing: -0.5,
    },
    settingsBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: C.bgCard,
      borderWidth: 1,
      borderColor: C.border,
      justifyContent: 'center',
      alignItems: 'center',
    },

    identityCard: {
      marginHorizontal: Spacing.xxl,
      marginTop: Spacing.sm,
      marginBottom: Spacing.xxl,
      backgroundColor: C.bgElevated,
      borderRadius: Radius['2xl'],
      borderWidth: 1,
      borderColor: C.border,
      padding: Spacing.xxl,
      alignItems: 'center',
      overflow: 'hidden',
      gap: Spacing.sm,
    },
    avatarRing: {
      width: AVATAR_RING,
      height: AVATAR_RING,
      borderRadius: AVATAR_RING / 2,
      borderWidth: 2.5,
      borderColor: C.metuRed,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    avatar: {
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      borderRadius: AVATAR_SIZE / 2,
      backgroundColor: C.bgCard,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      fontSize: FontSize['3xl'],
      fontWeight: FontWeight.bold,
      color: C.metuRed,
    },
    userName: {
      fontSize: FontSize['2xl'],
      fontWeight: FontWeight.bold,
      color: C.text,
      letterSpacing: -0.3,
    },
    userSub: {
      fontSize: FontSize.sm,
      color: C.textSecondary,
    },
    topRolePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: 'rgba(251,191,36,0.1)',
      borderWidth: 1,
      borderColor: 'rgba(251,191,36,0.2)',
      borderRadius: Radius.full,
      paddingHorizontal: Spacing.md,
      paddingVertical: 3,
      marginBottom: Spacing.sm,
    },
    topRolePillText: {
      fontSize: FontSize.xxs,
      fontWeight: FontWeight.bold,
      color: C.amber,
      letterSpacing: 0.3,
    },

    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: C.bgCard,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: C.border,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xl,
      width: '100%',
      justifyContent: 'space-evenly',
    },
    statBlock: { alignItems: 'center', gap: 2 },
    statValue: {
      fontSize: FontSize.xl,
      fontWeight: FontWeight.bold,
      color: C.text,
    },
    statLabel: {
      fontSize: FontSize.xxs,
      color: C.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    statDivider: {
      width: 1,
      height: 28,
      backgroundColor: C.border,
    },

    editBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: C.bgCard,
      borderWidth: 1,
      borderColor: C.borderSubtle,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      borderRadius: Radius.full,
      marginTop: Spacing.xs,
    },
    editBtnText: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: C.text,
    },

    /* ── Theme selector ── */
    themeRow: {
      flexDirection: 'row',
      marginHorizontal: Spacing.xxl,
      backgroundColor: C.bgCard,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: C.border,
      padding: 4,
    },
    themeOption: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: Spacing.md,
      borderRadius: Radius.md,
    },
    themeOptionActive: {
      backgroundColor: C.metuRedDim,
      borderWidth: 1,
      borderColor: 'rgba(227,6,19,0.25)',
    },
    themeLabel: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      color: C.textMuted,
    },
    themeLabelActive: {
      color: C.metuRed,
    },

    section: {
      marginBottom: Spacing.xxl,
      gap: Spacing.md,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.xxl,
    },
    sectionTitle: {
      fontSize: FontSize.lg,
      fontWeight: FontWeight.bold,
      color: C.text,
      letterSpacing: -0.3,
    },
    sectionSub: {
      fontSize: FontSize.xs,
      color: C.textMuted,
      marginTop: 2,
    },
    sectionBadge: {
      backgroundColor: C.bgCard,
      borderWidth: 1,
      borderColor: C.border,
      width: 26,
      height: 26,
      borderRadius: 13,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sectionBadgeText: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.bold,
      color: C.text,
    },
    seeAll: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: C.metuRed,
      marginTop: 3,
    },
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    rolesRow: {
      paddingHorizontal: Spacing.xxl,
    },
    emptyRolesCard: {
      marginHorizontal: Spacing.xxl,
      backgroundColor: C.bgCard,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: C.border,
      padding: Spacing.xxl,
      alignItems: 'center',
      gap: Spacing.md,
    },
    emptyRolesText: {
      fontSize: FontSize.sm,
      color: C.textMuted,
      textAlign: 'center',
      lineHeight: 20,
    },
    roleCard: {
      width: ROLE_CARD_WIDTH,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      backgroundColor: C.bgCard,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: C.border,
      padding: Spacing.lg,
    },
    roleCardHighLevel: {
      borderColor: 'rgba(227,6,19,0.3)',
    },
    roleIconBox: {
      width: 38,
      height: 38,
      borderRadius: Radius.md,
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
    },
    roleInfo: {
      flex: 1,
      gap: 2,
    },
    roleClub: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      color: C.text,
    },
    roleTitle: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.medium,
      color: C.textMuted,
    },
    roleBadge: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: C.metuRedDim,
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
    },

    eventsRow: {
      paddingHorizontal: Spacing.xxl,
    },
    myEventCard: {
      width: EVENT_CARD_WIDTH,
      backgroundColor: C.bgCard,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: C.border,
      padding: Spacing.lg,
      gap: Spacing.sm,
    },
    myEventDateBox: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 4,
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(128,128,128,0.08)',
      borderWidth: 1,
      borderColor: C.borderSubtle,
      borderRadius: Radius.sm - 2,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    myEventDay: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.bold,
      color: C.text,
    },
    myEventMonth: {
      fontSize: 9,
      fontWeight: FontWeight.bold,
      color: C.textMuted,
      letterSpacing: 0.5,
    },
    myEventTitle: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      color: C.text,
      lineHeight: 18,
    },
    myEventMeta: { gap: 3 },
    myEventMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    myEventMetaText: {
      fontSize: FontSize.xxs,
      color: C.textMuted,
      flex: 1,
    },

    emptyCard: {
      marginHorizontal: Spacing.xxl,
      backgroundColor: C.bgCard,
      borderRadius: Radius['2xl'],
      borderWidth: 1,
      borderColor: C.border,
      padding: Spacing.xxxl,
      alignItems: 'center',
      gap: Spacing.md,
    },
    emptyIconWrap: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: 'rgba(128,128,128,0.06)',
      borderWidth: 1,
      borderColor: C.borderSubtle,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyStarBadge: {
      position: 'absolute',
      top: 4,
      right: 4,
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: C.bgCard,
      borderWidth: 1,
      borderColor: C.borderSubtle,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyTitle: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.bold,
      color: C.text,
    },
    emptyText: {
      fontSize: FontSize.sm,
      color: C.textMuted,
      textAlign: 'center',
      lineHeight: 20,
      maxWidth: 240,
    },
    emptyBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      backgroundColor: C.metuRed,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.md,
      borderRadius: Radius.full,
      marginTop: Spacing.xs,
    },
    emptyBtnText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      color: C.white,
    },

    emptySavedCard: {
      marginHorizontal: Spacing.xxl,
      backgroundColor: C.bgCard,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: C.border,
      padding: Spacing.xxl,
      alignItems: 'center',
      gap: Spacing.sm,
    },
    emptySavedText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      color: C.text,
      textAlign: 'center',
    },
    emptySavedHint: {
      fontSize: FontSize.xs,
      color: C.textMuted,
      textAlign: 'center',
      lineHeight: 18,
      maxWidth: 240,
    },

    actionsGrid: {
      flexDirection: 'row',
      paddingHorizontal: Spacing.xxl,
      gap: Spacing.sm,
    },
    actionItem: {
      flex: 1,
      backgroundColor: C.bgCard,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: C.border,
      padding: Spacing.md,
      alignItems: 'center',
      gap: Spacing.sm,
    },
    actionIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionLabel: {
      fontSize: FontSize.xxs,
      fontWeight: FontWeight.semibold,
      color: C.textSecondary,
      textAlign: 'center',
    },

    logoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
      paddingVertical: Spacing.lg,
      marginHorizontal: Spacing.xxl,
      marginBottom: Spacing.xl,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: C.border,
    },
    logoutText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      color: C.danger,
    },
  });
}
