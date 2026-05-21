import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Exercise, HoldType } from '../types';
import { HOLD_TYPES } from '../data';
import { HoldIcon } from './icons';
import { Colors, FontSize, Radius } from '../theme';

interface Props {
  visible: boolean;
  initial?: Partial<Exercise>;
  onSave: (exercise: Omit<Exercise, 'id'>) => void;
  onClose: () => void;
}

export default function ExerciseModal({ visible, initial, onSave, onClose }: Props) {
  const [holdType, setHoldType] = useState<HoldType>(initial?.holdType ?? 'Crimp');
  const [workSeconds, setWorkSeconds] = useState(String(initial?.workSeconds ?? 10));
  const [restSeconds, setRestSeconds] = useState(String(initial?.restSeconds ?? 60));
  const [sets, setSets] = useState(String(initial?.sets ?? 3));
  const [note, setNote] = useState(initial?.note ?? '');

  const handleSave = () => {
    const w = Math.max(1, parseInt(workSeconds) || 10);
    const r = Math.max(1, parseInt(restSeconds) || 60);
    const s = Math.max(1, parseInt(sets) || 3);
    onSave({ holdType, workSeconds: w, restSeconds: r, sets: s, note: note.trim() || undefined });
  };

  const Stepper = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) => {
    const num = parseInt(value) || 0;
    return (
      <View style={styles.stepperRow}>
        <Text style={styles.stepperLabel}>{label}</Text>
        <View style={styles.stepperControls}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => onChange(String(Math.max(1, num - 1)))}
          >
            <Text style={styles.stepBtnText}>−</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.stepperInput}
            value={value}
            onChangeText={onChange}
            keyboardType="number-pad"
            selectTextOnFocus
            selectionColor={Colors.gold}
          />
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => onChange(String(num + 1))}
          >
            <Text style={styles.stepBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.handle} />
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.cancelTouchable}>
            <Text style={styles.cancelBtn}>CANCEL</Text>
          </TouchableOpacity>
          <Text style={styles.title}>EXERCISE</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveTouchable}>
            <Text style={styles.saveBtn}>SAVE</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionLabel}>HOLD TYPE</Text>
          <View style={styles.holdGrid}>
            {HOLD_TYPES.map(h => {
              const selected = h === holdType;
              return (
                <TouchableOpacity
                  key={h}
                  style={[styles.holdChip, selected && styles.holdChipSelected]}
                  onPress={() => setHoldType(h)}
                  activeOpacity={0.8}
                >
                  <HoldIcon
                    type={h}
                    size={16}
                    color={selected ? Colors.black : Colors.gold}
                  />
                  <Text style={[styles.holdChipText, selected && styles.holdChipTextSelected]}>
                    {h.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>TIMING</Text>
          <View style={styles.section}>
            <Stepper label="HANG (SEC)" value={workSeconds} onChange={setWorkSeconds} />
            <View style={styles.divider} />
            <Stepper label="REST (SEC)" value={restSeconds} onChange={setRestSeconds} />
            <View style={styles.divider} />
            <Stepper label="SETS" value={sets} onChange={setSets} />
          </View>

          <Text style={styles.sectionLabel}>NOTE (OPTIONAL)</Text>
          <View style={styles.section}>
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="e.g. Add weight, max effort…"
              placeholderTextColor={Colors.ash}
              selectionColor={Colors.gold}
              multiline
            />
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.charcoal,
    alignSelf: 'center',
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.charcoal,
  },
  cancelTouchable: { minWidth: 64 },
  saveTouchable: { minWidth: 64, alignItems: 'flex-end' },
  title: {
    color: Colors.white,
    fontSize: FontSize.button,
    fontWeight: '700',
    letterSpacing: 2,
  },
  cancelBtn: {
    color: Colors.ash,
    fontSize: FontSize.button,
    fontWeight: '700',
    letterSpacing: 1,
  },
  saveBtn: {
    color: Colors.gold,
    fontSize: FontSize.button,
    fontWeight: '700',
    letterSpacing: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionLabel: {
    color: Colors.ash,
    fontSize: FontSize.micro,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 24,
    marginBottom: 10,
  },
  holdGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  holdChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: Colors.ghostBorderStrong,
    backgroundColor: Colors.darkIron,
    borderRadius: Radius.pill,
  },
  holdChipSelected: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  holdChipIcon: {
    fontSize: 14,
  },
  holdChipText: {
    color: Colors.white,
    fontSize: FontSize.micro,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  holdChipTextSelected: {
    color: Colors.black,
  },
  section: {
    backgroundColor: Colors.charcoal,
    overflow: 'hidden',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.ghostBorder,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  stepperLabel: {
    color: Colors.white,
    fontSize: FontSize.button,
    fontWeight: '700',
    letterSpacing: 1,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepBtn: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderColor: Colors.ghostBorderStrong,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Radius.pill,
    backgroundColor: Colors.slate,
  },
  stepBtnText: {
    color: Colors.white,
    fontSize: 18,
    lineHeight: 22,
  },
  stepperInput: {
    color: Colors.white,
    fontSize: FontSize.body,
    fontWeight: '700',
    width: 56,
    textAlign: 'center',
    backgroundColor: Colors.slate,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.ghostBorder,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.darkIron,
    marginHorizontal: 16,
  },
  noteInput: {
    color: Colors.white,
    fontSize: FontSize.body,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 60,
  },
});
