import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Exercise } from '../types';
import { HOLD_ICONS } from '../data';
import { Colors, FontSize, Gradients, Radius } from '../theme';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface Props {
  exercise: Exercise;
  index: number;
  isActive: boolean;
  onDragStart: () => void;
  onDragMove: (dy: number) => void;
  onDragEnd: (dy: number) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ExerciseCard({
  exercise,
  index,
  isActive,
  onDragStart,
  onDragMove,
  onDragEnd,
  onEdit,
  onDelete,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  // Use refs so the PanResponder (created once) always calls fresh callbacks
  const onDragStartRef = useRef(onDragStart);
  const onDragMoveRef = useRef(onDragMove);
  const onDragEndRef = useRef(onDragEnd);
  onDragStartRef.current = onDragStart;
  onDragMoveRef.current = onDragMove;
  onDragEndRef.current = onDragEnd;

  const dragPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => onDragStartRef.current(),
      onPanResponderMove: (_, { dy }) => onDragMoveRef.current(dy),
      onPanResponderRelease: (_, { dy }) => onDragEndRef.current(dy),
      onPanResponderTerminate: (_, { dy }) => onDragEndRef.current(dy),
    })
  ).current;

  const icon = HOLD_ICONS[exercise.holdType];

  const toggle = () => {
    if (isActive) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
  };

  return (
    <View style={styles.cardWrap}>
      <LinearGradient
        colors={isActive ? Gradients.stoneCardActive : Gradients.stoneCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, isActive && styles.cardActive]}
      >
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerContent} onPress={toggle} activeOpacity={0.8}>
          <Text style={styles.indexBadge}>{index + 1}</Text>
          <Text style={styles.icon}>{icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.holdName}>{exercise.holdType.toUpperCase()}</Text>
            <Text style={styles.meta}>
              {exercise.workSeconds}s hang · {exercise.restSeconds}s rest · {exercise.sets} sets
            </Text>
          </View>
          <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        <View style={styles.dragHandle} {...dragPan.panHandlers}>
          <Text style={styles.gripIcon}>≡</Text>
        </View>
      </View>

      {expanded && !isActive && (
        <View style={styles.expandedContent}>
          <View style={styles.divider} />
          {exercise.note ? (
            <Text style={styles.note}>{exercise.note}</Text>
          ) : null}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
              <Text style={styles.actionBtnText}>EDIT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={onDelete}>
              <Text style={styles.deleteBtnText}>DELETE</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrap: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.ghostBorder,
  },
  card: {
    borderRadius: Radius.lg,
  },
  cardActive: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.gold,
    opacity: 0.95,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingVertical: 14,
    paddingRight: 8,
    gap: 10,
  },
  indexBadge: {
    color: Colors.ash,
    fontSize: FontSize.micro,
    fontWeight: '700',
    letterSpacing: 0.5,
    width: 16,
  },
  icon: {
    fontSize: 20,
  },
  holdName: {
    color: Colors.white,
    fontSize: FontSize.button,
    fontWeight: '700',
    letterSpacing: 1,
  },
  meta: {
    color: Colors.ash,
    fontSize: FontSize.micro,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  chevron: {
    color: Colors.ash,
    fontSize: 10,
  },
  dragHandle: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gripIcon: {
    color: Colors.ash,
    fontSize: 18,
    opacity: 0.7,
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.darkIron,
    marginBottom: 12,
  },
  note: {
    color: Colors.ash,
    fontSize: FontSize.button,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    borderWidth: 1,
    borderColor: Colors.ghostBorderStrong,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: Radius.pill,
  },
  actionBtnText: {
    color: Colors.white,
    fontSize: FontSize.micro,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  deleteBtn: {
    borderColor: 'rgba(255,255,255,0.2)',
    marginLeft: 'auto',
  },
  deleteBtnText: {
    color: Colors.ash,
    fontSize: FontSize.micro,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
