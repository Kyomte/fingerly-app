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

/** A completed (or partially completed) workout, logged to history. */
export interface WorkoutSession {
  id: string;
  routineId: string;
  routineName: string;
  /** Epoch ms when the session finished. */
  completedAt: number;
  /** Total time spent hanging, in seconds. */
  totalHangSeconds: number;
  /** Number of hang sets completed. */
  setsCompleted: number;
  /** Number of distinct exercises in the routine. */
  exerciseCount: number;
  /** Whether the workout ran all the way to completion. */
  finished: boolean;
}

/** Aggregate metrics derived from the full session history. */
export interface WorkoutStats {
  totalSessions: number;
  totalHangSeconds: number;
  totalSets: number;
  /** Consecutive-day streak ending today (or yesterday). */
  currentStreak: number;
  lastSessionAt: number | null;
}
