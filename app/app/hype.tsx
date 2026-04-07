import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import {
  HYPE_TOP_EVENT,
  HYPE_RUNNER_UPS,
  HYPE_TOP_CLUB,
  HYPE_GLOBAL_STATS,
  type HypeEvent,
} from '@/constants/mockHypeBoard';

/* ─── Helpers ─── */
const GOLD = '#fbbf24';
const GOLD_DIM = 'rgba(251,191,36,0.12)';
const GOLD_BORDER = 'rgba(251,191,36,0.30)';

function ChangeIndicator({ value }: { value: number }) {
  const isUp = value >= 0;
  return (
    <View style={[styles.changePill, { backgroundColor: isUp ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)' }]}>
      <Ionicons
        name={isUp ? 'trending-up' : 'trending-down'}
        size={10}
        color={isUp ? Colors.green : Colors.danger}
      />
      <Text style={[styles.changeText, { color: isUp ? Colors.green : Colors.danger }]}>
        {isUp ? '+' : ''}{value}%
      </Text>
    </View>
  );
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;
  return (
    <View style={styles.starsRow}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Ionicons
          key={i}
          name={i < full ? 'star' : i === full && hasHalf ? 'star-half' : 'star-outline'}
          size={12}
          color={GOLD}
        />
      ))}
      <Text style={styles.ratingNum}>{rating.toFixed(1)}</Text>
    </View>
  );
}

/* ─── Rank medal colors ─── */
function rankColor(rank: number): string {
  if (rank === 1) return GOLD;
  if (rank === 2) return '#c0c0c0';
  if (rank === 3) return '#cd7f32';
  return Colors.textMuted;
}

/* ─── Leaderboard row ─── */
function LeaderboardRow({ event }: { event: HypeEvent }) {
  const medalColor = rankColor(event.rank);

  return (
    <View style={styles.lbRow}>
      <View style={[styles.lbRank, { borderColor: medalColor + '55' }]}>
        <Text style={[styles.lbRankNum, { color: medalColor }]}>#{event.rank}</Text>
      </View>

      <View style={styles.lbCenter}>
        <Text style={styles.lbTitle} numberOfLines={1}>{event.title}</Text>
        <Text style={styles.lbClub} numberOfLines={1}>{event.club}</Text>
      </View>

      <View style={styles.lbRight}>
        <View style={styles.lbScoreRow}>
          <Text style={styles.lbFireEmoji}>🔥</Text>
          <Text style={styles.lbScore}>{event.hypeScore.toFixed(1)}</Text>
        </View>
        <ChangeIndicator value={event.change} />
      </View>
    </View>
  );
}

/* ─── Screen ─── */
export default function HypeBoardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const top = HYPE_TOP_EVENT;
  const fillPct = top.attendees && top.capacity
    ? Math.round((top.attendees / top.capacity) * 100)
    : null;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xxxxl }}
      >
        {/* ── Header ── */}
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={Colors.text} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>🔥 Post-Event Hype</Text>
            <Text style={styles.headerSub}>Ranked by attendance, ratings, and chat volume.</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        {/* ── Global stats bar ── */}
        <View style={styles.globalBar}>
          {[
            { val: String(HYPE_GLOBAL_STATS.totalEvents), label: 'Events' },
            { val: HYPE_GLOBAL_STATS.totalAttendees.toLocaleString(), label: 'Attendees' },
            { val: HYPE_GLOBAL_STATS.avgHypeScore.toFixed(0), label: 'Avg Hype' },
          ].map((s, i) => (
            <View key={s.label} style={styles.globalStatItem}>
              {i > 0 && <View style={styles.globalStatDivider} />}
              <View style={styles.globalStatBlock}>
                <Text style={styles.globalStatVal}>{s.val}</Text>
                <Text style={styles.globalStatLabel}>{s.label}</Text>
              </View>
            </View>
          ))}
          <View style={styles.globalStatItem}>
            <View style={styles.globalStatDivider} />
            <View style={styles.globalStatBlock}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Ionicons name="trending-up" size={12} color={Colors.green} />
                <Text style={[styles.globalStatVal, { color: Colors.green }]}>
                  {HYPE_GLOBAL_STATS.weeklyGrowth}%
                </Text>
              </View>
              <Text style={styles.globalStatLabel}>Growth</Text>
            </View>
          </View>
        </View>

        {/* ──────────────────────────────────────────────────
            SECTION 1 — THE CROWN (Top Event)
        ────────────────────────────────────────────────── */}
        <View style={styles.crownSection}>
          <View style={styles.crownCard}>
            <LinearGradient
              colors={['rgba(251,191,36,0.06)', 'rgba(251,191,36,0.02)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            {/* Crown header */}
            <View style={styles.crownHeader}>
              <View style={styles.crownBadge}>
                <Text style={styles.crownEmoji}>👑</Text>
                <Text style={styles.crownLabel}>#1 This Week</Text>
              </View>
              <ChangeIndicator value={top.change} />
            </View>

            {/* Title & club */}
            <Text style={styles.crownTitle}>{top.title}</Text>
            <View style={styles.crownClubRow}>
              <View style={styles.crownClubAvatar}>
                <Text style={styles.crownClubInitial}>{top.club.charAt(0)}</Text>
              </View>
              <Text style={styles.crownClubName}>{top.club}</Text>
            </View>

            {/* Score strip */}
            <View style={styles.scoreStrip}>
              <View style={styles.scoreBlock}>
                <Text style={styles.scoreBigNum}>{top.hypeScore.toFixed(1)}</Text>
                <Text style={styles.scoreLabel}>Hype Score</Text>
              </View>
              <View style={styles.scoreBlockDivider} />
              {top.rating != null && (
                <>
                  <View style={styles.scoreBlock}>
                    <StarRating rating={top.rating} />
                    <Text style={styles.scoreLabel}>Rating</Text>
                  </View>
                  <View style={styles.scoreBlockDivider} />
                </>
              )}
              {fillPct != null && (
                <View style={styles.scoreBlock}>
                  <Text style={styles.scoreMedNum}>{fillPct}%</Text>
                  <Text style={styles.scoreLabel}>Capacity</Text>
                </View>
              )}
            </View>

            {/* Capacity bar */}
            {fillPct != null && (
              <View style={styles.capacityBarOuter}>
                <View style={[styles.capacityBarInner, { width: `${fillPct}%` }]} />
                <Text style={styles.capacityText}>
                  {top.attendees?.toLocaleString()} / {top.capacity?.toLocaleString()} attendees
                </Text>
              </View>
            )}

            {/* AI Insights */}
            {top.aiInsights && top.aiInsights.length > 0 && (
              <View style={styles.insightsBox}>
                <View style={styles.insightsHeader}>
                  <Ionicons name="sparkles" size={14} color={Colors.violet} />
                  <Text style={styles.insightsTitle}>Why is this trending?</Text>
                </View>
                {top.aiInsights.map((insight, i) => (
                  <View key={i} style={styles.insightRow}>
                    <View style={styles.insightDot} />
                    <Text style={styles.insightText}>{insight}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Join Chat button */}
            <Pressable
              style={({ pressed }) => [styles.joinChatBtn, pressed && { opacity: 0.85 }]}
            >
              <Ionicons name="chatbubbles" size={15} color={Colors.white} />
              <Text style={styles.joinChatText}>Join Chat</Text>
              <Ionicons name="arrow-forward" size={13} color={Colors.white} />
            </Pressable>
          </View>
        </View>

        {/* ──────────────────────────────────────────────────
            SECTION 2 — LEADERBOARD (Ranks 2-5)
        ────────────────────────────────────────────────── */}
        <View style={styles.leaderboardSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Leaderboard</Text>
            <Text style={styles.sectionSub}>Ranks 2–5</Text>
          </View>

          <View style={styles.lbList}>
            {HYPE_RUNNER_UPS.map((event, i) => (
              <View key={event.rank}>
                {i > 0 && <View style={styles.lbSeparator} />}
                <LeaderboardRow event={event} />
              </View>
            ))}
          </View>
        </View>

        {/* ──────────────────────────────────────────────────
            SECTION 3 — TOP CLUB SPOTLIGHT
        ────────────────────────────────────────────────── */}
        <View style={styles.spotlightSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Club of the Week</Text>
          </View>

          <View style={styles.spotlightCard}>
            <LinearGradient
              colors={['rgba(129,140,248,0.07)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.spotlightTop}>
              <View style={styles.spotlightAvatar}>
                <LinearGradient
                  colors={['#4f46e5', '#7c3aed']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.spotlightInitial}>
                  {HYPE_TOP_CLUB.name.charAt(0)}
                </Text>
              </View>

              <View style={styles.spotlightInfo}>
                <View style={styles.spotlightNameRow}>
                  <Text style={styles.spotlightName}>{HYPE_TOP_CLUB.name}</Text>
                  <Text style={styles.trophyEmoji}>🏆</Text>
                </View>
                <Text style={styles.spotlightSub}>
                  Consistently delivering high-engagement events
                </Text>
              </View>
            </View>

            <View style={styles.spotlightStats}>
              <View style={styles.spotlightStatItem}>
                <Text style={styles.spotlightStatVal}>{HYPE_TOP_CLUB.totalPoints.toFixed(1)}</Text>
                <Text style={styles.spotlightStatLabel}>Total Points</Text>
              </View>
              <View style={styles.spotlightStatDivider} />
              <View style={styles.spotlightStatItem}>
                <Text style={styles.spotlightStatVal}>{HYPE_TOP_CLUB.eventsThisWeek}</Text>
                <Text style={styles.spotlightStatLabel}>Events</Text>
              </View>
              <View style={styles.spotlightStatDivider} />
              <View style={styles.spotlightStatItem}>
                <StarRating rating={HYPE_TOP_CLUB.avgRating} />
                <Text style={styles.spotlightStatLabel}>Avg Rating</Text>
              </View>
              <View style={styles.spotlightStatDivider} />
              <View style={styles.spotlightStatItem}>
                <ChangeIndicator value={HYPE_TOP_CLUB.change} />
                <Text style={styles.spotlightStatLabel}>Growth</Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [styles.viewClubBtn, pressed && { opacity: 0.8 }]}
            >
              <Text style={styles.viewClubText}>View Club Profile</Text>
              <Ionicons name="arrow-forward" size={13} color={Colors.indigo} />
            </Pressable>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: { flex: 1, gap: 3 },
  headerTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    lineHeight: 16,
  },

  /* ── Global stats bar ── */
  globalBar: {
    flexDirection: 'row',
    marginHorizontal: Spacing.xxl,
    marginBottom: Spacing.xxl,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  globalStatItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  globalStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
    marginRight: Spacing.sm,
  },
  globalStatBlock: { flex: 1, alignItems: 'center', gap: 2 },
  globalStatVal: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  globalStatLabel: {
    fontSize: 9,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  /* ── Crown Section ── */
  crownSection: {
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.xxl,
  },
  crownCard: {
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius['2xl'],
    borderWidth: 1.5,
    borderColor: GOLD_BORDER,
    padding: Spacing.xxl,
    overflow: 'hidden',
    gap: Spacing.lg,
  },
  crownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  crownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: GOLD_DIM,
    borderWidth: 1,
    borderColor: GOLD_BORDER,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
  },
  crownEmoji: { fontSize: 14 },
  crownLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: GOLD,
    letterSpacing: 0.3,
  },
  crownTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  crownClubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  crownClubAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crownClubInitial: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  crownClubName: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },

  /* Score strip */
  scoreStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  scoreBlock: { flex: 1, alignItems: 'center', gap: 4 },
  scoreBigNum: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.extrabold,
    color: GOLD,
    letterSpacing: -0.5,
  },
  scoreMedNum: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.emerald,
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoreBlockDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },

  /* Capacity bar */
  capacityBarOuter: {
    height: 22,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.full,
    overflow: 'hidden',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  capacityBarInner: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(251,191,36,0.18)',
    borderRadius: Radius.full,
  },
  capacityText: {
    fontSize: 9,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  /* AI Insights */
  insightsBox: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  insightsTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.violet,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  insightDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.violet,
    marginTop: 6,
    flexShrink: 0,
  },
  insightText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 19,
  },

  /* Join Chat */
  joinChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.metuRed,
    paddingVertical: 14,
    borderRadius: Radius.md,
  },
  joinChatText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },

  /* ── Section shared ── */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  sectionSub: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },

  /* ── Leaderboard ── */
  leaderboardSection: {
    marginBottom: Spacing.xxl,
  },
  lbList: {
    marginHorizontal: Spacing.xxl,
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  lbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  lbSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.lg,
  },
  lbRank: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  lbRankNum: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.extrabold,
  },
  lbCenter: {
    flex: 1,
    gap: 2,
  },
  lbTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  lbClub: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  lbRight: {
    alignItems: 'flex-end',
    gap: 4,
    flexShrink: 0,
  },
  lbScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  lbFireEmoji: { fontSize: 12 },
  lbScore: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },

  /* ── Change indicator ── */
  changePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  changeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
  },

  /* ── Star rating ── */
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingNum: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: GOLD,
    marginLeft: 3,
  },

  /* ── Top Club Spotlight ── */
  spotlightSection: {
    marginBottom: Spacing.xl,
  },
  spotlightCard: {
    marginHorizontal: Spacing.xxl,
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius['2xl'],
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    padding: Spacing.xxl,
    overflow: 'hidden',
    gap: Spacing.lg,
  },
  spotlightTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  spotlightAvatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  spotlightInitial: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: 'rgba(255,255,255,0.85)',
    zIndex: 1,
  },
  spotlightInfo: { flex: 1, gap: 3 },
  spotlightNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  spotlightName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  trophyEmoji: { fontSize: 16 },
  spotlightSub: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  spotlightStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  spotlightStatItem: { flex: 1, alignItems: 'center', gap: 4 },
  spotlightStatVal: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  spotlightStatLabel: {
    fontSize: 9,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  spotlightStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  viewClubBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  viewClubText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.indigo,
  },
});
