import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Keyboard,
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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { MOCK_EVENTS_FOR_SCREEN, type EventsScreenEvent } from '@/constants/mockEvents';
import { MOCK_CLUBS, type MockClub } from '@/constants/mockClubs';
import CompactEventCard from '@/components/CompactEventCard';
import ClubCard from '@/components/ClubCard';

/* ─── Keyword tags for AI matching ─── */
const EVENT_TAGS: Record<string, string[]> = {
  'mock-web-ai-ml-workshop': ['ai', 'ml', 'machine learning', 'coding', 'tech', 'technology', 'programming', 'python', 'workshop', 'learn', 'artificial intelligence', 'data'],
  'mock-web-astro-night': ['astronomy', 'stars', 'science', 'space', 'night', 'observation', 'telescope', 'physics', 'cosmos', 'nature'],
  'mock-web-startup-networking': ['startup', 'business', 'networking', 'entrepreneurship', 'meet', 'social', 'people', 'career', 'founders', 'mentors', 'professional'],
  'mock-web-ux-bootcamp': ['design', 'ux', 'ui', 'art', 'creative', 'portfolio', 'bootcamp', 'learn', 'visual', 'figma', 'workshop'],
  'mock-web-acoustic-night': ['music', 'acoustic', 'concert', 'live', 'performance', 'social', 'fun', 'entertainment', 'sing', 'guitar', 'night'],
  'mock-web-spring-hiking': ['hiking', 'sports', 'nature', 'outdoor', 'fitness', 'lake', 'adventure', 'spring', 'exercise', 'walk', 'health'],
};

const CLUB_TAGS: Record<string, string[]> = {
  '1': ['music', 'live', 'performance', 'concert', 'jam', 'guitar', 'sing', 'social', 'fun', 'entertainment'],
  '2': ['ai', 'ml', 'tech', 'technology', 'coding', 'programming', 'python', 'data', 'learn', 'hackathon', 'artificial intelligence'],
  '3': ['robotics', 'tech', 'technology', 'engineering', 'arduino', 'build', 'hardware', 'coding', 'embedded', 'competition'],
  '4': ['art', 'creative', 'drawing', 'painting', 'design', 'illustration', 'visual', 'exhibition', 'gallery'],
  '5': ['photography', 'art', 'creative', 'camera', 'visual', 'editing', 'lightroom', 'photoshop', 'nature'],
  '6': ['astronomy', 'science', 'stars', 'space', 'telescope', 'physics', 'cosmos', 'observation', 'night'],
};

const SUGGESTIONS = [
  { emoji: '🎸', label: 'Live music nearby' },
  { emoji: '💻', label: 'Tech & Networking' },
  { emoji: '🏃‍♂️', label: 'Outdoor activities' },
  { emoji: '☕', label: 'Chill hangouts' },
  { emoji: '🎨', label: 'Art & Design' },
  { emoji: '🔭', label: 'Science & Space' },
];

const SCANNING_PHRASES = [
  '✨ Scanning campus activities...',
  '🔍 Matching your vibe...',
  '🧠 Understanding your interests...',
  '🎯 Finding the best picks...',
];

type AIResult = {
  events: (EventsScreenEvent & { matchScore: number })[];
  clubs: (MockClub & { matchScore: number })[];
};

function runKeywordMatch(prompt: string): AIResult {
  const words = prompt.toLowerCase().split(/\s+/);

  const eventScores = MOCK_EVENTS_FOR_SCREEN.map((ev) => {
    const tags = EVENT_TAGS[ev.id] ?? [];
    let score = 0;
    for (const w of words) {
      if (w.length < 2) continue;
      for (const tag of tags) {
        if (tag.includes(w) || w.includes(tag)) { score++; break; }
      }
      if (ev.title.toLowerCase().includes(w)) score += 2;
      if (ev.community.toLowerCase().includes(w)) score++;
      if (ev.description?.toLowerCase().includes(w)) score++;
    }
    return { ...ev, matchScore: score };
  })
    .filter((e) => e.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 2);

  const clubScores = MOCK_CLUBS.map((cl) => {
    const tags = CLUB_TAGS[cl.id] ?? [];
    let score = 0;
    for (const w of words) {
      if (w.length < 2) continue;
      for (const tag of tags) {
        if (tag.includes(w) || w.includes(tag)) { score++; break; }
      }
      if (cl.name.toLowerCase().includes(w)) score += 2;
      if (cl.desc.toLowerCase().includes(w)) score++;
    }
    return { ...cl, matchScore: score };
  })
    .filter((c) => c.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 1);

  return { events: eventScores, clubs: clubScores };
}

function computeDisplayScore(result: AIResult): number {
  const max = Math.max(
    ...result.events.map((e) => e.matchScore),
    ...result.clubs.map((c) => c.matchScore),
    1,
  );
  return Math.min(78 + max * 4, 99);
}

/* ─── Zero-result proposal data ─── */
type ProposalData = {
  userInput: string;
  othersCount: number;
  suggestedName: string;
};

function buildProposal(input: string): ProposalData {
  const trimmed = input.trim();
  const capitalized = trimmed
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
  const suffix = Math.random() > 0.5 ? ' Society' : ' Topluluğu';
  return {
    userInput: trimmed,
    othersCount: Math.floor(Math.random() * 12) + 4,
    suggestedName: `ODTÜ ${capitalized}${suffix}`,
  };
}

/* ─── Animated proposal card ─── */
function ProposalCard({ data }: { data: ProposalData }) {
  const borderGlow = useRef(new Animated.Value(0)).current;
  const btnPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderGlow, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(borderGlow, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(btnPulse, { toValue: 1.03, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(btnPulse, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();
    return () => {
      borderGlow.stopAnimation();
      btnPulse.stopAnimation();
    };
  }, [borderGlow, btnPulse]);

  return (
    <View style={ps.outer}>
      {/* Animated glow border */}
      <Animated.View
        style={[
          ps.glowRing,
          { opacity: borderGlow.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.7] }) },
        ]}
      />

      <View style={ps.card}>
        <LinearGradient
          colors={['rgba(129,140,248,0.08)', 'rgba(227,6,19,0.06)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Emoji header */}
        <View style={ps.emojiRow}>
          <Text style={ps.emoji}>🤔</Text>
          <Text style={ps.emoji}>✨</Text>
          <Text style={ps.emoji}>🚀</Text>
        </View>

        <Text style={ps.headline}>Wait a minute...</Text>

        <Text style={ps.body}>
          You and{' '}
          <Text style={ps.bodyHighlight}>{data.othersCount} other students</Text>
          {' '}searched for{' '}
          <Text style={ps.bodyHighlight}>"{data.userInput}"</Text>
          {' '}recently, but there's no community for it yet!
        </Text>

        <Text style={ps.hook}>
          How about you take the lead and start the{' '}
          <Text style={ps.hookClubName}>{data.suggestedName}</Text>
          ?
        </Text>

        {/* Stats strip */}
        <View style={ps.statsRow}>
          <View style={ps.statItem}>
            <Ionicons name="people-outline" size={14} color={Colors.indigo} />
            <Text style={ps.statText}>{data.othersCount} interested</Text>
          </View>
          <View style={ps.statDot} />
          <View style={ps.statItem}>
            <Ionicons name="trending-up-outline" size={14} color={Colors.emerald} />
            <Text style={ps.statText}>Trending search</Text>
          </View>
        </View>

        {/* CTA button */}
        <Animated.View style={{ transform: [{ scale: btnPulse }] }}>
          <Pressable
            style={({ pressed }) => [ps.ctaBtn, pressed && { opacity: 0.85 }]}
            onPress={() =>
              Alert.alert(
                'Coming Soon',
                `Community creation for "${data.suggestedName}" will be available in a future update. We've noted your interest!`,
              )
            }
          >
            <LinearGradient
              colors={[Colors.metuRed, '#be123c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <Ionicons name="rocket-outline" size={16} color={Colors.white} />
            <Text style={ps.ctaText}>Start this Community</Text>
            <Text style={ps.ctaEmoji}>🚀</Text>
          </Pressable>
        </Animated.View>

        <Text style={ps.footnote}>
          Be the founder. Build something that matters.
        </Text>
      </View>
    </View>
  );
}

const ps = StyleSheet.create({
  outer: {
    marginHorizontal: Spacing.xxl,
    marginTop: Spacing.xxl,
    position: 'relative',
  },
  glowRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Radius['2xl'] + 2,
    borderWidth: 1.5,
    borderColor: Colors.indigo,
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
  },
  card: {
    backgroundColor: 'rgba(10,10,18,0.9)',
    borderRadius: Radius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(129,140,248,0.15)',
    padding: Spacing.xxl,
    gap: Spacing.lg,
    overflow: 'hidden',
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  emoji: { fontSize: 28 },
  headline: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  body: {
    fontSize: FontSize.sm,
    color: 'rgba(209,213,219,0.85)',
    textAlign: 'center',
    lineHeight: 21,
  },
  bodyHighlight: {
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  hook: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.metuRedLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  hookClubName: {
    fontWeight: FontWeight.bold,
    color: Colors.amber,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  statDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textMuted,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 16,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  ctaText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  ctaEmoji: { fontSize: 16 },
  footnote: {
    fontSize: FontSize.xxs,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
});

/* ─── Animated glow orb ─── */
function GlowOrb({ color, size, top, left, delay }: {
  color: string; size: number; top: number; left: number; delay: number;
}) {
  const anim = useRef(new Animated.Value(0.15)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.35, duration: 3000, delay, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.15, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();
    return () => anim.stopAnimation();
  }, [anim, delay]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: anim,
      }}
      pointerEvents="none"
    />
  );
}

/* ─── Pulsing loading card ─── */
function ScanningCard({ phrase }: { phrase: string }) {
  const glow = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.6, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();
    return () => {
      glow.stopAnimation();
      pulse.stopAnimation();
    };
  }, [glow, pulse]);

  return (
    <View style={s.scanningOuter}>
      <Animated.View
        style={[
          s.scanningGlow,
          { opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.8] }) },
        ]}
      />
      <View style={s.scanningCard}>
        <View style={s.scanningIconRow}>
          <Animated.View style={{ opacity: pulse }}>
            <View style={s.scanningDotRow}>
              <View style={[s.scanningDot, { backgroundColor: Colors.metuRed }]} />
              <View style={[s.scanningDot, { backgroundColor: Colors.violet }]} />
              <View style={[s.scanningDot, { backgroundColor: Colors.indigo }]} />
            </View>
          </Animated.View>
        </View>
        <Text style={s.scanningText}>{phrase}</Text>

        <View style={s.skeletonRow}>
          <Animated.View style={[s.skeletonBlock, s.skeletonTall, { opacity: pulse }]} />
          <Animated.View style={[s.skeletonBlock, s.skeletonTall, { opacity: pulse }]} />
        </View>
        <Animated.View style={[s.skeletonBlock, s.skeletonWide, { opacity: pulse }]} />
      </View>
    </View>
  );
}

/* ─── Main screen ─── */
export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const [prompt, setPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [scanPhrase, setScanPhrase] = useState(SCANNING_PHRASES[0]);
  const [hasSearched, setHasSearched] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!isThinking) return;
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % SCANNING_PHRASES.length;
      setScanPhrase(SCANNING_PHRASES[idx]);
    }, 600);
    return () => clearInterval(interval);
  }, [isThinking]);

  const handleSearch = useCallback(() => {
    const q = prompt.trim();
    if (!q || isThinking) return;
    Keyboard.dismiss();
    setIsThinking(true);
    setResult(null);
    setProposal(null);
    setHasSearched(true);

    setTimeout(() => {
      const res = runKeywordMatch(q);
      const isEmpty = res.events.length === 0 && res.clubs.length === 0;
      if (isEmpty) {
        setProposal(buildProposal(q));
      } else {
        setDisplayScore(computeDisplayScore(res));
      }
      setResult(res);
      setIsThinking(false);
    }, 2000);
  }, [prompt, isThinking]);

  const handleChip = useCallback((text: string) => {
    setPrompt(text);
    setIsThinking(true);
    setResult(null);
    setProposal(null);
    setHasSearched(true);
    Keyboard.dismiss();

    setTimeout(() => {
      const res = runKeywordMatch(text);
      const isEmpty = res.events.length === 0 && res.clubs.length === 0;
      if (isEmpty) {
        setProposal(buildProposal(text));
      } else {
        setDisplayScore(computeDisplayScore(res));
      }
      setResult(res);
      setIsThinking(false);
    }, 2000);
  }, []);

  const hasResults = result && (result.events.length > 0 || result.clubs.length > 0);
  const noResults = result && result.events.length === 0 && result.clubs.length === 0;
  const canSend = prompt.trim().length > 0 && !isThinking;

  return (
    <KeyboardAvoidingView
      style={s.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[s.container, { paddingTop: insets.top }]}>
        {/* ── Ambient glow orbs ── */}
        <GlowOrb color="#881337" size={260} top={-80} left={-90} delay={0} />
        <GlowOrb color="#312e81" size={220} top={-40} left={160} delay={1500} />

        {/* ── Scrollable content ── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[s.scrollContent, { paddingBottom: 100 + insets.bottom }]}
        >
          {/* ── Conversational header ── */}
          <View style={s.headerWrap}>
            <View style={s.aiChip}>
              <Ionicons name="sparkles" size={12} color={Colors.violet} />
              <Text style={s.aiChipText}>AI-Powered</Text>
            </View>
            <Text style={s.greeting}>
              What are you{'\n'}in the mood for?
            </Text>
            <Text style={s.greetingSub}>
              Describe it naturally — we'll match you with the best events and clubs on campus.
            </Text>
          </View>

          {/* ── Suggestion chips ── */}
          {!hasSearched && (
            <View style={s.chipsSection}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.chipsScroll}
              >
                {SUGGESTIONS.map((chip) => (
                  <Pressable
                    key={chip.label}
                    style={({ pressed }) => [s.chip, pressed && { opacity: 0.7, transform: [{ scale: 0.96 }] }]}
                    onPress={() => handleChip(chip.label)}
                  >
                    <Text style={s.chipEmoji}>{chip.emoji}</Text>
                    <Text style={s.chipLabel}>{chip.label}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {/* ── Loading state ── */}
          {isThinking && <ScanningCard phrase={scanPhrase} />}

          {/* ── Results ── */}
          {!isThinking && hasResults && (
            <View style={s.resultsWrap}>
              <View style={s.matchPill}>
                <LinearGradient
                  colors={['rgba(227,6,19,0.12)', 'rgba(129,140,248,0.08)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={s.matchPillIcon}>✨</Text>
                <Text style={s.matchPillText}>AI Match: {displayScore}%</Text>
              </View>

              {result!.events.length > 0 && (
                <View style={s.resultSection}>
                  <View style={s.resultHeader}>
                    <Ionicons name="calendar" size={14} color={Colors.metuRedLight} />
                    <Text style={s.resultTitle}>Recommended Events</Text>
                  </View>
                  <View style={s.eventsGrid}>
                    {result!.events.map((ev) => (
                      <View key={ev.id} style={s.eventCardWrap}>
                        <CompactEventCard event={ev} communityName={ev.community} />
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {result!.clubs.length > 0 && (
                <View style={s.resultSection}>
                  <View style={s.resultHeader}>
                    <Ionicons name="people" size={14} color={Colors.violet} />
                    <Text style={s.resultTitle}>Recommended Club</Text>
                  </View>
                  <View style={s.clubCardWrap}>
                    <ClubCard club={result!.clubs[0]} />
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ── Zero results → Community Proposal ── */}
          {!isThinking && noResults && proposal && (
            <ProposalCard data={proposal} />
          )}

          {/* ── Idle hero ── */}
          {!hasSearched && !isThinking && (
            <View style={s.idleWrap}>
              <View style={s.idleRing}>
                <LinearGradient
                  colors={['rgba(227,6,19,0.1)', 'rgba(129,140,248,0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <Ionicons name="sparkles" size={30} color={Colors.indigo} />
              </View>
              <Text style={s.idleTitle}>Your AI campus guide</Text>
              <Text style={s.idleText}>
                "I want to learn coding and meet new people" — type naturally and let AI do the rest.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* ── Floating bottom input ── */}
        <View style={[s.inputBar, { paddingBottom: insets.bottom + Spacing.sm }]}>
          <View style={[s.inputPill, inputFocused && s.inputPillFocused]}>
            <Ionicons name="sparkles" size={16} color={inputFocused ? Colors.metuRedLight : Colors.textMuted} style={s.inputIcon} />
            <TextInput
              ref={inputRef}
              style={s.input}
              value={prompt}
              onChangeText={setPrompt}
              placeholder="Describe what you're looking for..."
              placeholderTextColor={Colors.textMuted}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              editable={!isThinking}
              multiline
              maxLength={200}
            />
            <Pressable
              style={[s.sendBtn, canSend && s.sendBtnActive]}
              onPress={handleSearch}
              disabled={!canSend}
              hitSlop={6}
            >
              <Ionicons
                name="sparkles"
                size={16}
                color={canSend ? Colors.white : Colors.textMuted}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ─── Styles ─── */
const s = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#050508' },
  scrollContent: { paddingBottom: 120 },

  /* ── Header ── */
  headerWrap: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  aiChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    backgroundColor: 'rgba(167,139,250,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    marginBottom: Spacing.sm,
  },
  aiChipText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.violet,
    letterSpacing: 0.5,
  },
  greeting: {
    fontSize: 30,
    fontWeight: FontWeight.extrabold,
    color: Colors.text,
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  greetingSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    maxWidth: 320,
  },

  /* ── Chips ── */
  chipsSection: {
    paddingTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  chipsScroll: {
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
  },
  chipEmoji: { fontSize: 15 },
  chipLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: 'rgba(255,255,255,0.8)',
  },

  /* ── Scanning / loading ── */
  scanningOuter: {
    marginHorizontal: Spacing.xxl,
    marginTop: Spacing.xxl,
    position: 'relative',
  },
  scanningGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Radius['2xl'],
    borderWidth: 1.5,
    borderColor: Colors.metuRed,
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
  },
  scanningCard: {
    backgroundColor: 'rgba(10,10,15,0.85)',
    borderRadius: Radius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(227,6,19,0.2)',
    padding: Spacing.xxl,
    gap: Spacing.lg,
  },
  scanningIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanningDotRow: {
    flexDirection: 'row',
    gap: 6,
  },
  scanningDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scanningText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    letterSpacing: -0.2,
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  skeletonBlock: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  skeletonTall: {
    flex: 1,
    height: 90,
  },
  skeletonWide: {
    width: '100%',
    height: 56,
  },

  /* ── Results ── */
  resultsWrap: {
    paddingTop: Spacing.xxl,
    gap: Spacing.xxl,
  },
  matchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    backgroundColor: 'rgba(10,10,15,0.8)',
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(227,6,19,0.2)',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    overflow: 'hidden',
  },
  matchPillIcon: { fontSize: 13 },
  matchPillText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.metuRedLight,
  },
  resultSection: { gap: Spacing.md },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.xxl,
  },
  resultTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  eventsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xxl,
  },
  eventCardWrap: { flex: 1 },
  clubCardWrap: { paddingHorizontal: Spacing.xxl },

  /* ── Idle hero ── */
  idleWrap: {
    alignItems: 'center',
    paddingTop: Spacing.xxxl,
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.md,
  },
  idleRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(129,140,248,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  idleTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  idleText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
    fontStyle: 'italic',
  },

  /* ── Floating input bar ── */
  inputBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    backgroundColor: 'rgba(5,5,8,0.92)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.04)',
  },
  inputPill: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#111118',
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    gap: Spacing.xs,
  },
  inputPillFocused: {
    borderColor: 'rgba(227,6,19,0.45)',
  },
  inputIcon: {
    marginBottom: Platform.OS === 'ios' ? 6 : 10,
    marginLeft: 4,
  },
  input: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    maxHeight: 80,
    lineHeight: 20,
    paddingVertical: Platform.OS === 'ios' ? 8 : 8,
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 2 : 4,
  },
  sendBtnActive: {
    backgroundColor: Colors.metuRed,
  },
});
