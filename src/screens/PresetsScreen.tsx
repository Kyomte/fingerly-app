import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Share,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Routine } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import { PRESET_ROUTINES } from '../data';
import { HoldIcon, BoulderIcon, MountainIcon } from '../components/icons';
import { Colors, FontSize, Gradients, Radius } from '../theme';
import { useRoutines } from '../context/RoutinesContext';

export default function PresetsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [expanded, setExpanded] = useState<string | null>(null);
  const { userRoutines, deleteRoutine, exportRoutines, importRoutines } = useRoutines();

  const handleExport = async () => {
    if (userRoutines.length === 0) {
      Alert.alert('NOTHING TO EXPORT', 'Save a workout first, then export to back it up or share it.');
      return;
    }
    const json = exportRoutines();
    try {
      await Share.share({ message: json });
    } catch {
      // Fall back to clipboard if the share sheet is unavailable.
      await Clipboard.setStringAsync(json);
      Alert.alert('COPIED', 'Export data copied to the clipboard.');
    }
  };

  const handleImport = async () => {
    const clip = await Clipboard.getStringAsync();
    if (!clip || !clip.trim()) {
      Alert.alert('CLIPBOARD EMPTY', 'Copy exported Fingerly routine data, then tap Import.');
      return;
    }
    try {
      const { imported } = await importRoutines(clip);
      Alert.alert('IMPORTED', `${imported} workout${imported === 1 ? '' : 's'} added to your presets.`);
    } catch (e) {
      Alert.alert('IMPORT FAILED', e instanceof Error ? e.message : 'Could not import routines.');
    }
  };

  const totalTime = (routine: Routine) => {
    const secs = routine.exercises.reduce(
      (a, e) => a + (e.workSeconds + e.restSeconds) * e.sets,
      0
    );
    return Math.ceil(secs / 60);
  };

  const totalSets = (routine: Routine) =>
    routine.exercises.reduce((a, e) => a + e.sets, 0);

  const handleDelete = (routine: Routine) => {
    Alert.alert(
      'DELETE WORKOUT',
      `Remove "${routine.name.toUpperCase()}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteRoutine(routine.id) },
      ]
    );
  };

  const renderRoutineCard = (routine: Routine, isUserRoutine = false) => {
    const isOpen = expanded === routine.id;
    const mins = totalTime(routine);
    const sets = totalSets(routine);
    const uniqueHolds = [...new Set(routine.exercises.map(e => e.holdType))];

    return (
      <LinearGradient
        key={routine.id}
        colors={isUserRoutine ? Gradients.stoneCardActive : Gradients.stoneCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, isUserRoutine && styles.userCard]}
      >
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => setExpanded(isOpen ? null : routine.id)}
          activeOpacity={0.8}
        >
          <View style={styles.cardLeft}>
            <View style={styles.cardNameRow}>
              <Text style={styles.cardName}>{routine.name.toUpperCase()}</Text>
              {isUserRoutine && (
                <View style={styles.myBadge}>
                  <Text style={styles.myBadgeText}>MINE</Text>
                </View>
              )}
            </View>
            <View style={styles.metaRow}>
              <View style={styles.metaChip}>
                <Text style={styles.metaChipText}>~{mins} MIN</Text>
              </View>
              <View style={styles.metaChip}>
                <Text style={styles.metaChipText}>{sets} SETS</Text>
              </View>
              <View style={styles.metaChip}>
                <Text style={styles.metaChipText}>{routine.exercises.length} EX</Text>
              </View>
            </View>
            <View style={styles.holdPills}>
              {uniqueHolds.map(h => (
                <View key={h} style={styles.holdPill}>
                  <HoldIcon type={h} size={14} color={Colors.gold} />
                  <Text style={styles.holdPillText}>{h.toUpperCase()}</Text>
                </View>
              ))}
            </View>
          </View>
          <Text style={styles.chevron}>{isOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {isOpen ? (
          <View style={styles.exerciseList}>
            {routine.exercises.map((ex, i) => (
              <View key={ex.id} style={styles.exerciseRow}>
                <Text style={styles.exerciseNum}>{i + 1}</Text>
                <HoldIcon type={ex.holdType} size={22} color={Colors.gold} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.exerciseHold}>{ex.holdType.toUpperCase()}</Text>
                  <Text style={styles.exerciseMeta}>
                    {ex.workSeconds}s HANG · {ex.restSeconds}s REST · {ex.sets} SETS
                    {ex.weightKg ? ` · +${ex.weightKg}KG` : ''}
                  </Text>
                  {ex.note ? (
                    <Text style={styles.exerciseNote}>{ex.note}</Text>
                  ) : null}
                </View>
              </View>
            ))}
            <View style={styles.expandedActions}>
              <TouchableOpacity
                style={styles.startBtnWrap}
                onPress={() => navigation.navigate('Timer', { routine })}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={Gradients.goldCTA}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.startBtn}
                >
                  <Text style={styles.startBtnText}>START WORKOUT  ↗</Text>
                </LinearGradient>
              </TouchableOpacity>
              {isUserRoutine && (
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(routine)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteBtnText}>DELETE</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.quickStart}
            onPress={() => navigation.navigate('Timer', { routine })}
            activeOpacity={0.7}
          >
            <Text style={styles.quickStartText}>START  ↗</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <BoulderIcon size={26} color={Colors.gold} />
          <Text style={styles.screenTitle}>PRESETS</Text>
        </View>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>MY WORKOUTS</Text>
          <Text style={styles.sectionCount}>{userRoutines.length}</Text>
          <View style={styles.ioActions}>
            <TouchableOpacity onPress={handleImport} activeOpacity={0.7} style={styles.ioBtn}>
              <Text style={styles.ioBtnText}>IMPORT</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleExport} activeOpacity={0.7} style={styles.ioBtn}>
              <Text style={styles.ioBtnText}>EXPORT</Text>
            </TouchableOpacity>
          </View>
        </View>

        {userRoutines.length === 0 ? (
          <View style={styles.emptyMine}>
            <MountainIcon size={40} color={Colors.ash} strokeWidth={1.4} />
            <Text style={styles.emptyMineText}>NO SAVED WORKOUTS YET</Text>
            <Text style={styles.emptyMineSub}>BUILD ONE IN THE WORKOUT TAB AND TAP SAVE</Text>
          </View>
        ) : (
          userRoutines.map(r => renderRoutineCard(r, true))
        )}

        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>FINGERLY PRESETS</Text>
          <Text style={styles.sectionCount}>{PRESET_ROUTINES.length}</Text>
        </View>

        {PRESET_ROUTINES.map(r => renderRoutineCard(r, false))}

        <View style={{ height: 40 }} />
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titleGlyph: {
    fontSize: 22,
  },
  screenTitle: {
    color: Colors.white,
    fontSize: FontSize.feature,
    fontWeight: '400',
    letterSpacing: 3,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
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
  ioActions: {
    flexDirection: 'row',
    gap: 6,
    marginLeft: 'auto',
  },
  ioBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.ghostBorder,
  },
  ioBtnText: {
    color: Colors.ash,
    fontSize: FontSize.micro,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  emptyMine: {
    alignItems: 'center',
    paddingVertical: 28,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.ghostBorder,
    borderRadius: Radius.lg,
    borderStyle: 'dashed',
    marginBottom: 8,
  },
  emptyMineText: {
    color: Colors.ash,
    fontSize: FontSize.label,
    fontWeight: '700',
    letterSpacing: 2,
  },
  emptyMineSub: {
    color: Colors.charcoal,
    fontSize: FontSize.micro,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 12,
    overflow: 'hidden',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.ghostBorder,
  },
  userCard: {
    borderColor: Colors.darkGold,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    justifyContent: 'space-between',
  },
  cardLeft: {
    flex: 1,
    gap: 8,
  },
  cardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  cardName: {
    color: Colors.white,
    fontSize: FontSize.cardTitle,
    fontWeight: '400',
    letterSpacing: 2,
  },
  myBadge: {
    backgroundColor: Colors.darkGold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  myBadgeText: {
    color: Colors.gold,
    fontSize: FontSize.micro,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
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
  holdPills: {
    flexDirection: 'row',
    gap: 5,
    flexWrap: 'wrap',
  },
  holdPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.ghostBorderStrong,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
  holdPillText: {
    fontSize: FontSize.micro,
    color: Colors.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  chevron: {
    color: Colors.ash,
    fontSize: 10,
    marginTop: 4,
  },
  exerciseList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.darkIron,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkIron,
  },
  exerciseNum: {
    color: Colors.ash,
    fontSize: FontSize.label,
    fontWeight: '700',
    width: 16,
    letterSpacing: 0.5,
  },
  exerciseHold: {
    color: Colors.white,
    fontSize: FontSize.button,
    fontWeight: '700',
    letterSpacing: 1,
  },
  exerciseMeta: {
    color: Colors.ash,
    fontSize: FontSize.micro,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  exerciseNote: {
    color: Colors.ash,
    fontSize: FontSize.micro,
    fontStyle: 'italic',
    marginTop: 2,
  },
  expandedActions: {
    gap: 8,
    marginTop: 14,
  },
  startBtnWrap: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    shadowColor: Colors.gold,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  startBtn: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  startBtnText: {
    color: Colors.black,
    fontSize: FontSize.button,
    fontWeight: '800',
    letterSpacing: 2,
  },
  deleteBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(244,67,54,0.3)',
    borderRadius: Radius.md,
    backgroundColor: 'rgba(244,67,54,0.06)',
  },
  deleteBtnText: {
    color: '#F44336',
    fontSize: FontSize.button,
    fontWeight: '800',
    letterSpacing: 2,
  },
  quickStart: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 14,
    alignItems: 'center',
  },
  quickStartText: {
    color: Colors.gold,
    fontSize: FontSize.button,
    fontWeight: '800',
    letterSpacing: 3,
  },
});
