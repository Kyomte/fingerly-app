import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HistoryIcon, MountainIcon } from '../components/icons';
import { Colors, FontSize, Gradients, Radius } from '../theme';
import { useRoutines } from '../context/RoutinesContext';
import { WorkoutSession } from '../types';

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

function formatDate(ms: number): string {
  const d = new Date(ms);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  if (sameDay) return `TODAY · ${time}`;
  const date = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `${date.toUpperCase()} · ${time}`;
}

export default function HistoryScreen() {
  const { history, stats, clearHistory } = useRoutines();

  const handleClear = () => {
    Alert.alert('CLEAR HISTORY', 'Remove all logged sessions? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => clearHistory() },
    ]);
  };

  const renderStat = (label: string, value: string) => (
    <LinearGradient
      colors={Gradients.stoneCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.statCard}
    >
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </LinearGradient>
  );

  const renderSession = (session: WorkoutSession) => (
    <LinearGradient
      key={session.id}
      colors={Gradients.stoneCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.sessionCard}
    >
      <View style={styles.sessionHeader}>
        <Text style={styles.sessionName} numberOfLines={1}>
          {session.routineName.toUpperCase()}
        </Text>
        {session.finished ? (
          <View style={styles.finishedBadge}>
            <Text style={styles.finishedBadgeText}>DONE</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.sessionDate}>{formatDate(session.completedAt)}</Text>
      <View style={styles.sessionMetaRow}>
        <View style={styles.metaChip}>
          <Text style={styles.metaChipText}>{formatDuration(session.totalHangSeconds)} HANG</Text>
        </View>
        <View style={styles.metaChip}>
          <Text style={styles.metaChipText}>{session.setsCompleted} SETS</Text>
        </View>
        <View style={styles.metaChip}>
          <Text style={styles.metaChipText}>{session.exerciseCount} EX</Text>
        </View>
      </View>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <HistoryIcon size={26} color={Colors.gold} />
          <Text style={styles.screenTitle}>HISTORY</Text>
        </View>
        {history.length > 0 ? (
          <TouchableOpacity onPress={handleClear} activeOpacity={0.7} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>CLEAR</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyGlyph}>
              <MountainIcon size={64} color={Colors.ash} strokeWidth={1.4} />
            </View>
            <Text style={styles.emptyTitle}>NO SESSIONS YET</Text>
            <Text style={styles.emptySubtitle}>FINISH A WORKOUT TO START TRACKING PROGRESS</Text>
          </View>
        ) : (
          <>
            <View style={styles.statsGrid}>
              {renderStat('SESSIONS', String(stats.totalSessions))}
              {renderStat('TOTAL HANG', formatDuration(stats.totalHangSeconds))}
              {renderStat('TOTAL SETS', String(stats.totalSets))}
              {renderStat('DAY STREAK', String(stats.currentStreak))}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>RECENT SESSIONS</Text>
              <Text style={styles.sectionCount}>{history.length}</Text>
            </View>

            {history.map(renderSession)}
            <View style={{ height: 40 }} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  screenTitle: {
    color: Colors.white,
    fontSize: FontSize.feature,
    fontWeight: '400',
    letterSpacing: 3,
  },
  clearBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.ghostBorder,
  },
  clearBtnText: {
    color: Colors.ash,
    fontSize: FontSize.micro,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flexGrow: 1,
    flexBasis: '45%',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.ghostBorder,
  },
  statValue: {
    color: Colors.gold,
    fontSize: FontSize.section,
    fontWeight: '400',
    letterSpacing: 1,
  },
  statLabel: {
    color: Colors.ash,
    fontSize: FontSize.micro,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    color: Colors.ash,
    fontSize: FontSize.label,
    fontWeight: '700',
    letterSpacing: 2,
  },
  sectionCount: {
    color: Colors.charcoal,
    fontSize: FontSize.label,
    fontWeight: '700',
    letterSpacing: 1,
    backgroundColor: Colors.darkIron,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  sessionCard: {
    marginBottom: 10,
    padding: 16,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.ghostBorder,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sessionName: {
    flex: 1,
    color: Colors.white,
    fontSize: FontSize.cardTitle,
    fontWeight: '400',
    letterSpacing: 1.5,
  },
  finishedBadge: {
    backgroundColor: Colors.darkGold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  finishedBadgeText: {
    color: Colors.gold,
    fontSize: FontSize.micro,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  sessionDate: {
    color: Colors.ash,
    fontSize: FontSize.micro,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  sessionMetaRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    marginTop: 12,
  },
  metaChip: {
    backgroundColor: Colors.slate,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  metaChipText: {
    color: Colors.ash,
    fontSize: FontSize.micro,
    fontWeight: '700',
    letterSpacing: 1,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
    gap: 10,
  },
  emptyGlyph: {
    opacity: 0.7,
    marginBottom: 4,
  },
  emptyTitle: {
    color: Colors.ash,
    fontSize: FontSize.body,
    fontWeight: '700',
    letterSpacing: 2,
  },
  emptySubtitle: {
    color: Colors.charcoal,
    fontSize: FontSize.label,
    fontWeight: '700',
    letterSpacing: 1.5,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
