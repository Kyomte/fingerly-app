import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Routine } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import { PRESET_ROUTINES, HOLD_ICONS } from '../data';
import { Colors, FontSize, Gradients, Radius } from '../theme';

export default function PresetsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [expanded, setExpanded] = useState<string | null>(null);

  const totalTime = (routine: Routine) => {
    const secs = routine.exercises.reduce(
      (a, e) => a + (e.workSeconds + e.restSeconds) * e.sets,
      0
    );
    return Math.ceil(secs / 60);
  };

  const totalSets = (routine: Routine) =>
    routine.exercises.reduce((a, e) => a + e.sets, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.titleGlyph}>🪨</Text>
          <Text style={styles.screenTitle}>PRESETS</Text>
        </View>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {PRESET_ROUTINES.map(routine => {
          const isOpen = expanded === routine.id;
          const mins = totalTime(routine);
          const sets = totalSets(routine);
          const uniqueHolds = [...new Set(routine.exercises.map(e => e.holdType))];

          return (
            <LinearGradient
              key={routine.id}
              colors={Gradients.stoneCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => setExpanded(isOpen ? null : routine.id)}
                activeOpacity={0.8}
              >
                <View style={styles.cardLeft}>
                  <Text style={styles.cardName}>{routine.name.toUpperCase()}</Text>
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
                        <Text style={styles.holdPillText}>
                          {HOLD_ICONS[h]}  {h.toUpperCase()}
                        </Text>
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
                      <View style={{ flex: 1 }}>
                        <Text style={styles.exerciseHold}>
                          {HOLD_ICONS[ex.holdType]}  {ex.holdType.toUpperCase()}
                        </Text>
                        <Text style={styles.exerciseMeta}>
                          {ex.workSeconds}s HANG · {ex.restSeconds}s REST · {ex.sets} SETS
                        </Text>
                        {ex.note ? (
                          <Text style={styles.exerciseNote}>{ex.note}</Text>
                        ) : null}
                      </View>
                    </View>
                  ))}
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
        })}
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
  card: {
    marginBottom: 12,
    overflow: 'hidden',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.ghostBorder,
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
  cardName: {
    color: Colors.white,
    fontSize: FontSize.cardTitle,
    fontWeight: '400',
    letterSpacing: 2,
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
    borderWidth: 1,
    borderColor: Colors.ghostBorderStrong,
    paddingHorizontal: 10,
    paddingVertical: 4,
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
  startBtnWrap: {
    marginTop: 14,
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
