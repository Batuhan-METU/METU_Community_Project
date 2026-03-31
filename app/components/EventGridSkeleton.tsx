import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/theme';

const ROWS = [
  [0, 1],
  [2, 3],
];

/**
 * 2-column grid of pulsing placeholder cards for the Events screen.
 */
export default function EventGridSkeleton() {
  const pulse = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.55,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={styles.wrap}>
      {ROWS.map((pair, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {pair.map((key) => (
            <Animated.View key={key} style={[styles.card, { opacity: pulse }]}>
              <View style={styles.avatarRow}>
                <View style={styles.avatar} />
                <View style={styles.titleCol}>
                  <View style={styles.lineShort} />
                  <View style={styles.lineTiny} />
                </View>
              </View>
              <View style={styles.hero} />
              <View style={styles.block} />
              <View style={styles.blockNarrow} />
            </Animated.View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: 40,
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  card: {
    flex: 1,
    borderRadius: Radius.lg,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.sm,
    minHeight: 200,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bgElevated,
  },
  titleCol: {
    flex: 1,
    gap: 6,
  },
  lineShort: {
    height: 10,
    borderRadius: 4,
    width: '70%',
    backgroundColor: Colors.borderSubtle,
  },
  lineTiny: {
    height: 8,
    borderRadius: 4,
    width: '45%',
    backgroundColor: Colors.border,
  },
  hero: {
    height: 72,
    borderRadius: Radius.sm,
    backgroundColor: Colors.bgElevated,
    marginTop: Spacing.xs,
  },
  block: {
    height: 10,
    borderRadius: 4,
    width: '90%',
    backgroundColor: Colors.borderSubtle,
  },
  blockNarrow: {
    height: 10,
    borderRadius: 4,
    width: '55%',
    backgroundColor: Colors.border,
  },
});
