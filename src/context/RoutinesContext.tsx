import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Routine, WorkoutSession, WorkoutStats } from '../types';

const STORAGE_KEY = '@fingerly_user_routines';
const HISTORY_KEY = '@fingerly_workout_history';
const MAX_HISTORY = 200;

interface RoutinesContextValue {
  userRoutines: Routine[];
  saveRoutine: (routine: Routine) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
  history: WorkoutSession[];
  stats: WorkoutStats;
  logSession: (session: Omit<WorkoutSession, 'id'>) => Promise<void>;
  clearHistory: () => Promise<void>;
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

  const stats = useMemo(() => computeStats(history), [history]);

  return (
    <RoutinesContext.Provider
      value={{ userRoutines, saveRoutine, deleteRoutine, history, stats, logSession, clearHistory }}
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
