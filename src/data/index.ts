import { HoldType, Routine } from '../types';

export const HOLD_TYPES: HoldType[] = [
  'Jug',
  'Crimp',
  'Open Hand',
  'Pinch',
  'Sloper',
  '3 Finger Drag',
  '2 Finger Drag',
  '2 Finger Pocket',
];

export const HOLD_COLORS: Record<HoldType, string> = {
  'Jug': '#4CAF50',
  'Crimp': '#F44336',
  'Open Hand': '#2196F3',
  'Pinch': '#FF9800',
  'Sloper': '#9C27B0',
  '3 Finger Drag': '#00BCD4',
  '2 Finger Drag': '#FF5722',
  '2 Finger Pocket': '#E91E63',
};

export const PRESET_ROUTINES: Routine[] = [
  {
    id: 'preset-beginner',
    name: 'Beginner Hangboard',
    isPreset: true,
    exercises: [
      { id: 'e1', holdType: 'Jug', workSeconds: 10, restSeconds: 60, sets: 3 },
      { id: 'e2', holdType: 'Open Hand', workSeconds: 7, restSeconds: 60, sets: 3 },
      { id: 'e3', holdType: 'Crimp', workSeconds: 5, restSeconds: 90, sets: 2 },
    ],
  },
  {
    id: 'preset-max-hangs',
    name: 'Max Hangs Protocol',
    isPreset: true,
    exercises: [
      { id: 'e1', holdType: 'Crimp', workSeconds: 10, restSeconds: 180, sets: 5 },
      { id: 'e2', holdType: 'Open Hand', workSeconds: 10, restSeconds: 180, sets: 5 },
      { id: 'e3', holdType: '3 Finger Drag', workSeconds: 10, restSeconds: 180, sets: 4 },
    ],
  },
  {
    id: 'preset-repeaters',
    name: 'Repeaters (7-3)',
    isPreset: true,
    exercises: [
      { id: 'e1', holdType: 'Crimp', workSeconds: 7, restSeconds: 3, sets: 6, note: '6 reps per set' },
      { id: 'e2', holdType: 'Open Hand', workSeconds: 7, restSeconds: 3, sets: 6 },
      { id: 'e3', holdType: 'Sloper', workSeconds: 7, restSeconds: 3, sets: 4 },
      { id: 'e4', holdType: 'Pinch', workSeconds: 7, restSeconds: 3, sets: 4 },
    ],
  },
  {
    id: 'preset-endurance',
    name: 'Endurance Builder',
    isPreset: true,
    exercises: [
      { id: 'e1', holdType: 'Jug', workSeconds: 30, restSeconds: 30, sets: 5 },
      { id: 'e2', holdType: 'Open Hand', workSeconds: 20, restSeconds: 40, sets: 4 },
      { id: 'e3', holdType: '2 Finger Drag', workSeconds: 15, restSeconds: 45, sets: 3 },
    ],
  },
  {
    id: 'preset-finger-strength',
    name: 'Finger Strength',
    isPreset: true,
    exercises: [
      { id: 'e1', holdType: 'Crimp', workSeconds: 12, restSeconds: 120, sets: 5 },
      { id: 'e2', holdType: '2 Finger Pocket', workSeconds: 10, restSeconds: 120, sets: 4 },
      { id: 'e3', holdType: 'Pinch', workSeconds: 12, restSeconds: 120, sets: 4 },
      { id: 'e4', holdType: '3 Finger Drag', workSeconds: 10, restSeconds: 120, sets: 3 },
    ],
  },
  {
    id: 'preset-power',
    name: 'Power Endurance',
    isPreset: true,
    exercises: [
      { id: 'e1', holdType: 'Crimp', workSeconds: 10, restSeconds: 5, sets: 8, note: 'Explosive' },
      { id: 'e2', holdType: 'Open Hand', workSeconds: 10, restSeconds: 5, sets: 8 },
      { id: 'e3', holdType: 'Sloper', workSeconds: 10, restSeconds: 5, sets: 6 },
    ],
  },
];
