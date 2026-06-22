import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Routine, WorkoutSession, WorkoutStats } from '../types';

const STORAGE_KEY = '@fingerly_user_routines';
const HISTORY_KEY = '@fingerly_workout_history';
const MAX_HISTORY = 200;

interface ImportResult {
  imported: number;
}

interface RoutinesContextValue {
  userRoutines: Routine[];
  saveRoutine: (routine: Routine) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
  history: WorkoutSession[];
  stats: WorkoutStats;
  logSession: (session: Omit<WorkoutSession, 'id'>) => Promise<void>;
  clearHistory: () => Promise<void>;
  exportRoutines: () => string;
  importRoutines: (json: string) => Promise<ImportResult>;
}

const EXPORT_VERSION = 1;

interface RoutinesExport {
  app: 'fingerly';
  version: number;
  exportedAt: number;
  routines: Routine[];
}

const HOLD_TYPES: ReadonlyArray<string> = [
  'Jug', 'Crimp', 'Open Hand', 'Pinch', 'Sloper',
  '3 Finger Drag', '2 Finger Drag', '2 Finger Pocket',
];

let importCounter = 0;

// Validates and normalises one routine from untrusted JSON, regenerating ids
// so an import can never collide with an existing routine.
function sanitizeRoutine(raw: any): Routine | null {
  if (!raw || typeof raw !== 'object') return null;
  if (typeof raw.name !== 'string' || !Array.isArray(raw.exercises)) return null;

  const exercises = raw.exercises
    .map((ex: any, i: number) => {
      if (!ex || typeof ex !== 'object') return null;
      if (!HOLD_TYPES.includes(ex.holdType)) return null;
      const work = Number(ex.workSeconds);
      const rest = Number(ex.restSeconds);
      const sets = Number(ex.sets);
      if (!Number.isFinite(work) || !Number.isFinite(rest) || !Number.isFinite(sets)) return null;
      const weight = Number(ex.weightKg);
      return {
        id: `imp-${Date.now()}-${importCounter++}-${i}`,
        holdType: ex.holdType,
        workSeconds: Math.max(1, Math.round(work)),
        restSeconds: Math.max(1, Math.round(rest)),
        sets: Math.max(1, Math.round(sets)),
        weightKg: Number.isFinite(weight) && weight > 0 ? Math.round(weight) : undefined,
        note: typeof ex.note === 'string' && ex.note.trim() ? ex.note.trim() : undefined,
      };
    })
    .filter(Boolean);

  if (exercises.length === 0) return null;

  return {
    id: `user-imp-${Date.now()}-${importCounter++}`,
    name: raw.name.trim() || 'IMPORTED WORKOUT',
    exercises: exercises as Routine['exercises'],
  };
}

const RoutinesContext = createContext<RoutinesContextValue | null>(null);

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function computeStats(history: WorkoutSession[]): WorkoutStats {
  const totalSessions = history.length;
  const totalHangSeconds = history.reduce((a, s) => a + s.totalHangSeconds, 0);
  const totalSets = history.reduce((a, s) => a + s.setsCompleted, 0);
  const lastSessionAt = history.length ? Math.max(...history.map(s => s.completedAt)) : null;

  // Streak: count back from today (or yesterday) over consecutive days that
  // each have at least one logged session.
  let currentStreak = 0;
  if (history.length) {
    const days = new Set(history.map(s => startOfDay(s.completedAt)));
    const today = startOfDay(Date.now());
    let cursor = today;
    if (!days.has(today)) {
      // Allow the streak to still count if the most recent session was yesterday.
      cursor = today - DAY_MS;
    }
    while (days.has(cursor)) {
      currentStreak += 1;
      cursor -= DAY_MS;
    }
  }

  return { totalSessions, totalHangSeconds, totalSets, currentStreak, lastSessionAt };
}

export function RoutinesProvider({ children }: { children: React.ReactNode }) {
  const [userRoutines, setUserRoutines] = useState<Routine[]>([]);
  const [history, setHistory] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(json => {
      if (json) setUserRoutines(JSON.parse(json));
    });
    AsyncStorage.getItem(HISTORY_KEY).then(json => {
      if (json) {
        try {
          setHistory(JSON.parse(json));
        } catch {
          // ignore corrupt history
        }
      }
    });
  }, []);

  const saveRoutine = useCallback(async (routine: Routine) => {
    setUserRoutines(prev => {
      const updated = [...prev.filter(r => r.id !== routine.id), routine];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteRoutine = useCallback(async (id: string) => {
    setUserRoutines(prev => {
      const updated = prev.filter(r => r.id !== id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const logSession = useCallback(async (session: Omit<WorkoutSession, 'id'>) => {
    setHistory(prev => {
      const entry: WorkoutSession = { ...session, id: `s-${session.completedAt}-${prev.length}` };
      // Newest first, capped so storage can't grow unbounded.
      const updated = [entry, ...prev].slice(0, MAX_HISTORY);
      AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(async () => {
    setHistory([]);
    await AsyncStorage.removeItem(HISTORY_KEY);
  }, []);

  const exportRoutines = useCallback((): string => {
    const payload: RoutinesExport = {
      app: 'fingerly',
      version: EXPORT_VERSION,
      exportedAt: Date.now(),
      routines: userRoutines,
    };
    return JSON.stringify(payload, null, 2);
  }, [userRoutines]);

  const importRoutines = useCallback(async (json: string): Promise<ImportResult> => {
    let parsed: any;
    try {
      parsed = JSON.parse(json);
    } catch {
      throw new Error('That doesn’t look like valid Fingerly export data.');
    }

    // Accept either the full export envelope or a bare array/single routine.
    const rawRoutines: any[] = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.routines)
        ? parsed.routines
        : parsed && typeof parsed === 'object'
          ? [parsed]
          : [];

    const sanitized = rawRoutines
      .map(sanitizeRoutine)
      .filter((r): r is Routine => r !== null);

    if (sanitized.length === 0) {
      throw new Error('No valid routines found to import.');
    }

    await new Promise<void>(resolve => {
      setUserRoutines(prev => {
        const updated = [...prev, ...sanitized];
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).finally(() => resolve());
        return updated;
      });
    });

    return { imported: sanitized.length };
  }, []);

  const stats = useMemo(() => computeStats(history), [history]);

  return (
    <RoutinesContext.Provider
      value={{
        userRoutines,
        saveRoutine,
        deleteRoutine,
        history,
        stats,
        logSession,
        clearHistory,
        exportRoutines,
        importRoutines,
      }}
    >
      {children}
    </RoutinesContext.Provider>
  );
}

export function useRoutines() {
  const ctx = useContext(RoutinesContext);
  if (!ctx) throw new Error('useRoutines must be used within RoutinesProvider');
  return ctx;
}
