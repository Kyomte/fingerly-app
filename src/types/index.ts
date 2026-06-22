export type HoldType =
  | 'Jug'
  | 'Crimp'
  | 'Open Hand'
  | 'Pinch'
  | 'Sloper'
  | '3 Finger Drag'
  | '2 Finger Drag'
  | '2 Finger Pocket';

export interface Exercise {
  id: string;
  holdType: HoldType;
  workSeconds: number;
  restSeconds: number;
  sets: number;
  /** Added load in kilograms (e.g. weight belt). Omitted or 0 means bodyweight. */
  weightKg?: number;
  note?: string;
}

export interface Routine {
  id: string;
  name: string;
  exercises: Exercise[];
  isPreset?: boolean;
}

export type TimerPhase = 'idle' | 'work' | 'rest' | 'done';
