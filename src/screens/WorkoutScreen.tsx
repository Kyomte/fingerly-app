import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  Animated,
  LayoutAnimation,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Exercise, Routine } from '../types';
import ExerciseCard from '../components/ExerciseCard';
import ExerciseModal from '../components/ExerciseModal';
import { Colors, FontSize } from '../theme';

let idCounter = 1;
function generateId() { return `ex-${Date.now()}-${idCounter++}`; }

const CARD_HEIGHT = 54; // approximate collapsed card height + margin

export default function WorkoutScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [routineName, setRoutineName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  // Drag state
  const [dragFromIndex, setDragFromIndex] = useState<number | null>(null);
  const dragFromIndexRef = useRef<number | null>(null);
  const dragToIndexRef = useRef<number | null>(null);
  const exercisesRef = useRef(exercises);
  exercisesRef.current = exercises;
  const dragTranslateY = useRef(new Animated.Value(0)).current;
  const cardAnimatedOffsetsRef = useRef<Map<string, Animated.Value>>(new Map());

  const getOffset = (id: string): Animated.Value => {
    if (!cardAnimatedOffsetsRef.current.has(id)) {
      cardAnimatedOffsetsRef.current.set(id, new Animated.Value(0));
    }
    return cardAnimatedOffsetsRef.current.get(id)!;
  };

  const totalTime = exercises.reduce((acc, ex) => {
    return acc + (ex.workSeconds + ex.restSeconds) * ex.sets;
  }, 0);
  const totalMinutes = Math.ceil(totalTime / 60);

  const handleAddExercise = (data: Omit<Exercise, 'id'>) => {
    setExercises(prev => [...prev, { ...data, id: generateId() }]);
    setModalVisible(false);
  };

  const handleEditExercise = (data: Omit<Exercise, 'id'>) => {
    if (!editingExercise) return;
    setExercises(prev =>
      prev.map(ex => ex.id === editingExercise.id ? { ...data, id: ex.id } : ex)
    );
    setEditingExercise(null);
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('REMOVE EXERCISE', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          cardAnimatedOffsetsRef.current.delete(id);
          setExercises(prev => prev.filter(e => e.id !== id));
        },
      },
    ]);
  };

  const handleStart = () => {
    if (exercises.length === 0) {
      Alert.alert('NO EXERCISES', 'Add at least one exercise to start.');
      return;
    }
    const routine: Routine = {
      id: 'custom-' + Date.now(),
      name: routineName || 'CUSTOM WORKOUT',
      exercises,
    };
    navigation.navigate('Timer', { routine });
  };

  // Drag callbacks — passed down to each ExerciseCard
  const handleDragStart = useCallback((index: number) => {
    dragTranslateY.setValue(0);
    dragFromIndexRef.current = index;
    dragToIndexRef.current = index;
    setDragFromIndex(index);
  }, [dragTranslateY]);

  const handleDragMove = useCallback((dy: number) => {
    dragTranslateY.setValue(dy);

    const fromIndex = dragFromIndexRef.current;
    if (fromIndex === null) return;

    const items = exercisesRef.current;
    const steps = Math.round(dy / CARD_HEIGHT);
    const newToIndex = Math.max(0, Math.min(items.length - 1, fromIndex + steps));

    if (newToIndex === dragToIndexRef.current) return;
    dragToIndexRef.current = newToIndex;

    items.forEach((ex, i) => {
      if (i === fromIndex) return;
      if (!cardAnimatedOffsetsRef.current.has(ex.id)) {
        cardAnimatedOffsetsRef.current.set(ex.id, new Animated.Value(0));
      }
      const offset = cardAnimatedOffsetsRef.current.get(ex.id)!;

      let targetOffset = 0;
      if (newToIndex > fromIndex) {
        if (i > fromIndex && i <= newToIndex) targetOffset = -CARD_HEIGHT;
      } else if (newToIndex < fromIndex) {
        if (i >= newToIndex && i < fromIndex) targetOffset = CARD_HEIGHT;
      }

      Animated.spring(offset, {
        toValue: targetOffset,
        useNativeDriver: true,
        tension: 500,
        friction: 25,
      }).start();
    });
  }, [dragTranslateY]);

  const handleDragEnd = useCallback((_dy: number) => {
    const fromIndex = dragFromIndexRef.current;
    if (fromIndex === null) return;

    const items = exercisesRef.current;
    const toIndex = dragToIndexRef.current ?? fromIndex;

    dragFromIndexRef.current = null;
    dragToIndexRef.current = null;

    // Reset all animated values instantly so LayoutAnimation owns the final move
    dragTranslateY.setValue(0);
    items.forEach((ex) => cardAnimatedOffsetsRef.current.get(ex.id)?.setValue(0));

    setDragFromIndex(null);

    if (toIndex !== fromIndex) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const newArr = [...items];
      const [item] = newArr.splice(fromIndex, 1);
      newArr.splice(toIndex, 0, item);
      setExercises(newArr);
    }
  }, [dragTranslateY]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>WORKOUT</Text>
        {exercises.length > 0 && (
          <Text style={styles.totalTime}>~{totalMinutes} MIN</Text>
        )}
      </View>

      <View style={styles.nameRow}>
        <TextInput
          style={styles.nameInput}
          value={routineName}
          onChangeText={setRoutineName}
          placeholder="ROUTINE NAME"
          placeholderTextColor={Colors.ash}
          selectionColor={Colors.gold}
          autoCapitalize="characters"
        />
      </View>

      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        scrollEnabled={dragFromIndex === null}
      >
        {exercises.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>ADD YOUR FIRST EXERCISE</Text>
            <Text style={styles.emptySubtitle}>TAP + ADD EXERCISE BELOW</Text>
          </View>
        ) : (
          exercises.map((ex, i) => {
            const isActive = dragFromIndex === i;
            return (
              <Animated.View
                key={ex.id}
                style={isActive
                  ? { transform: [{ translateY: dragTranslateY }], zIndex: 10, elevation: 5 }
                  : { transform: [{ translateY: getOffset(ex.id) }] }
                }
              >
                <ExerciseCard
                  exercise={ex}
                  index={i}
                  isActive={isActive}
                  onDragStart={() => handleDragStart(i)}
                  onDragMove={handleDragMove}
                  onDragEnd={handleDragEnd}
                  onEdit={() => { setEditingExercise(ex); setModalVisible(true); }}
                  onDelete={() => handleDelete(ex.id)}
                />
              </Animated.View>
            );
          })
        )}
        <View style={{ height: 160 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => { setEditingExercise(null); setModalVisible(true); }}
        >
          <Text style={styles.addBtnText}>+ ADD EXERCISE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.startBtn, exercises.length === 0 && styles.startBtnDisabled]}
          onPress={handleStart}
        >
          <Text style={[styles.startBtnText, exercises.length === 0 && styles.startBtnTextDisabled]}>
            START WORKOUT
          </Text>
        </TouchableOpacity>
      </View>

      <ExerciseModal
        visible={modalVisible}
        initial={editingExercise ?? undefined}
        onSave={editingExercise ? handleEditExercise : handleAddExercise}
        onClose={() => { setModalVisible(false); setEditingExercise(null); }}
      />
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
    paddingBottom: 4,
  },
  screenTitle: {
    color: Colors.white,
    fontSize: FontSize.feature,
    fontWeight: '400',
    letterSpacing: 3,
  },
  totalTime: {
    color: Colors.ash,
    fontSize: FontSize.label,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  nameRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.charcoal,
    marginBottom: 2,
  },
  nameInput: {
    color: Colors.white,
    fontSize: FontSize.body,
    fontWeight: '700',
    letterSpacing: 2,
    paddingVertical: 4,
  },
  list: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
    gap: 8,
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
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    backgroundColor: Colors.black,
    borderTopWidth: 1,
    borderTopColor: Colors.charcoal,
  },
  addBtn: {
    borderWidth: 1,
    borderColor: Colors.ghostBorder,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addBtnText: {
    color: Colors.white,
    fontSize: FontSize.button,
    fontWeight: '700',
    letterSpacing: 2,
  },
  startBtn: {
    backgroundColor: Colors.gold,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startBtnDisabled: {
    backgroundColor: Colors.charcoal,
  },
  startBtnText: {
    color: Colors.black,
    fontSize: FontSize.button,
    fontWeight: '700',
    letterSpacing: 2,
  },
  startBtnTextDisabled: {
    color: Colors.ash,
  },
});
