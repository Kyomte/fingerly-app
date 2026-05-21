import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Vibration,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useTimer } from '../hooks/useTimer';
import { HOLD_ICONS } from '../data';
import { Colors, FontSize } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Timer'>;

export default function TimerScreen({ route, navigation }: Props) {
  const { routine } = route.params;
  const timer = useTimer(routine.exercises);

  const phaseLabel =
    timer.phase === 'work' ? 'HANG' :
    timer.phase === 'rest' ? 'REST' :
    timer.phase === 'done' ? 'DONE' : 'READY';

  useEffect(() => {
    if (timer.phase === 'work' || timer.phase === 'rest') {
      if (timer.secondsLeft <= 3 && timer.secondsLeft > 0) {
        Vibration.vibrate(100);
      }
    }
    if (timer.phase === 'done') {
      Vibration.vibrate([0, 200, 100, 200]);
    }
  }, [timer.secondsLeft, timer.phase]);

  const holdIcon = timer.currentExercise
    ? HOLD_ICONS[timer.currentExercise.holdType]
    : '';

  const nextExercise = (() => {
    const isLastSet =
      timer.currentExercise &&
      timer.currentSet === timer.currentExercise.sets &&
      timer.phase === 'rest';
    return isLastSet ? routine.exercises[timer.currentExerciseIndex + 1] : null;
  })();

  const mm = String(Math.floor(timer.secondsLeft / 60)).padStart(2, '0');
  const ss = String(timer.secondsLeft % 60).padStart(2, '0');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => { timer.reset(); navigation.goBack(); }}
          style={styles.closeBtn}
        >
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.routineName} numberOfLines={1}>
          {routine.name.toUpperCase()}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.progressRow}>
        {routine.exercises.map((ex, i) => (
          <View
            key={ex.id}
            style={[
              styles.progressDot,
              i < timer.currentExerciseIndex && styles.progressDotDone,
              i === timer.currentExerciseIndex && styles.progressDotActive,
            ]}
          />
        ))}
      </View>

      <View style={styles.timerBlock}>
        <Text style={styles.phaseLabel}>{phaseLabel}</Text>
        <Text style={styles.timerDigits}>{mm}:{ss}</Text>

        {timer.phase !== 'done' && timer.currentExercise ? (
          <>
            <View style={styles.holdBadge}>
              <Text style={styles.holdIcon}>{holdIcon}</Text>
              <Text style={styles.holdName}>
                {timer.currentExercise.holdType.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.setInfo}>
              SET {timer.currentSet} OF {timer.currentExercise.sets}
            </Text>
            {timer.currentExercise.note ? (
              <Text style={styles.noteText}>{timer.currentExercise.note}</Text>
            ) : null}
          </>
        ) : null}

        {timer.phase === 'done' ? (
          <Text style={styles.doneText}>GREAT WORK</Text>
        ) : null}
      </View>

      {nextExercise ? (
        <View style={styles.nextCard}>
          <Text style={styles.nextLabel}>UP NEXT</Text>
          <Text style={styles.nextHold}>
            {HOLD_ICONS[nextExercise.holdType]}  {nextExercise.holdType.toUpperCase()}
          </Text>
          <Text style={styles.nextDetail}>
            {nextExercise.workSeconds}s HANG · {nextExercise.restSeconds}s REST · {nextExercise.sets} SETS
          </Text>
        </View>
      ) : null}

      <View style={styles.controls}>
        {timer.phase !== 'done' ? (
          <>
            <TouchableOpacity style={styles.btnGhost} onPress={timer.reset}>
              <Text style={styles.btnGhostText}>RESET</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnGold}
              onPress={timer.isRunning ? timer.pause : timer.start}
            >
              <Text style={styles.btnGoldText}>
                {timer.isRunning ? 'PAUSE' : timer.phase === 'idle' ? 'START' : 'RESUME'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnGhost} onPress={timer.skip}>
              <Text style={styles.btnGhostText}>SKIP</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.btnGhost} onPress={timer.reset}>
              <Text style={styles.btnGhostText}>RESTART</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnGold}
              onPress={() => { timer.reset(); navigation.goBack(); }}
            >
              <Text style={styles.btnGoldText}>DONE</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <ScrollView style={styles.exerciseList} showsVerticalScrollIndicator={false}>
        <Text style={styles.exerciseListTitle}>EXERCISES</Text>
        {routine.exercises.map((ex, i) => {
          const isCurrent = i === timer.currentExerciseIndex;
          const isDone = i < timer.currentExerciseIndex;
          return (
            <View
              key={ex.id}
              style={[
                styles.exerciseRow,
                isCurrent && styles.exerciseRowActive,
                isDone && styles.exerciseRowDone,
              ]}
            >
              <Text style={styles.exerciseRowIcon}>{HOLD_ICONS[ex.holdType]}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.exerciseRowHold, isCurrent && styles.exerciseRowHoldActive]}>
                  {ex.holdType.toUpperCase()}
                </Text>
                <Text style={styles.exerciseRowMeta}>
                  {ex.workSeconds}s HANG · {ex.restSeconds}s REST · {ex.sets} SETS
                </Text>
              </View>
              {isDone ? <Text style={styles.doneCheck}>✓</Text> : null}
            </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  closeBtnText: {
    color: Colors.ash,
    fontSize: 18,
  },
  routineName: {
    color: Colors.white,
    fontSize: FontSize.button,
    fontWeight: '700',
    letterSpacing: 2,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexWrap: 'wrap',
  },
  progressDot: {
    width: 8,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progressDotDone: {
    backgroundColor: Colors.white,
  },
  progressDotActive: {
    backgroundColor: Colors.gold,
  },
  timerBlock: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.darkIron,
    marginHorizontal: 20,
  },
  phaseLabel: {
    color: Colors.white,
    fontSize: FontSize.feature,
    fontWeight: '400',
    letterSpacing: 4,
    marginBottom: 4,
  },
  timerDigits: {
    fontSize: 80,
    fontWeight: '400',
    color: Colors.gold,
    fontVariant: ['tabular-nums'],
    lineHeight: 88,
  },
  holdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.charcoal,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 12,
    gap: 8,
  },
  holdIcon: {
    fontSize: 20,
  },
  holdName: {
    color: Colors.white,
    fontSize: FontSize.button,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  setInfo: {
    color: Colors.ash,
    fontSize: FontSize.label,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 10,
  },
  noteText: {
    color: Colors.ash,
    fontSize: FontSize.label,
    fontStyle: 'italic',
    marginTop: 6,
  },
  doneText: {
    color: Colors.gold,
    fontSize: FontSize.section,
    fontWeight: '400',
    letterSpacing: 4,
    marginTop: 8,
  },
  nextCard: {
    marginHorizontal: 20,
    marginTop: 8,
    padding: 14,
    backgroundColor: Colors.darkIron,
    alignItems: 'center',
  },
  nextLabel: {
    color: Colors.ash,
    fontSize: FontSize.micro,
    letterSpacing: 3,
    fontWeight: '700',
  },
  nextHold: {
    color: Colors.white,
    fontSize: FontSize.button,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 4,
  },
  nextDetail: {
    color: Colors.ash,
    fontSize: FontSize.micro,
    letterSpacing: 1,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  btnGold: {
    flex: 2,
    backgroundColor: Colors.gold,
    paddingVertical: 18,
    alignItems: 'center',
  },
  btnGoldText: {
    color: Colors.black,
    fontSize: FontSize.button,
    fontWeight: '700',
    letterSpacing: 2,
  },
  btnGhost: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.ghostBorder,
  },
  btnGhostText: {
    color: Colors.white,
    fontSize: FontSize.label,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  exerciseList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  exerciseListTitle: {
    color: Colors.ash,
    fontSize: FontSize.micro,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 8,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 1,
    backgroundColor: Colors.darkIron,
  },
  exerciseRowActive: {
    backgroundColor: Colors.charcoal,
    borderLeftWidth: 2,
    borderLeftColor: Colors.gold,
  },
  exerciseRowDone: {
    opacity: 0.35,
  },
  exerciseRowIcon: {
    fontSize: 18,
    width: 26,
    textAlign: 'center',
  },
  exerciseRowHold: {
    color: Colors.white,
    fontSize: FontSize.label,
    fontWeight: '700',
    letterSpacing: 1,
  },
  exerciseRowHoldActive: {
    color: Colors.gold,
  },
  exerciseRowMeta: {
    color: Colors.ash,
    fontSize: FontSize.micro,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  doneCheck: {
    color: Colors.gold,
    fontSize: FontSize.body,
    fontWeight: '700',
  },
});
