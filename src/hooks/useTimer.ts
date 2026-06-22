import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise, TimerPhase } from '../types';

interface TimerState {
  phase: TimerPhase;
  currentExerciseIndex: number;
  currentSet: number;
  secondsLeft: number;
  totalExercises: number;
}

interface UseTimerReturn extends TimerState {
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  currentExercise: Exercise | null;
}

const STORAGE_PREFIX = '@fingerly_timer_state:';

interface PersistedTimer {
  state: TimerState;
  isRunning: boolean;
  /** Epoch ms when the snapshot was written, used to fast-forward across backgrounding. */
  savedAt: number;
}

export function useTimer(exercises: Exercise[], persistKey?: string): UseTimerReturn {
  const storageKey = persistKey ? `${STORAGE_PREFIX}${persistKey}` : null;

  const buildInitial = useCallback((): TimerState => ({
    phase: 'idle',
    currentExerciseIndex: 0,
    currentSet: 1,
    secondsLeft: exercises[0]?.workSeconds ?? 0,
    totalExercises: exercises.length,
  }), [exercises]);

  const [isRunning, setIsRunning] = useState(false);
  const [state, setState] = useState<TimerState>(buildInitial);
  const [restored, setRestored] = useState(!storageKey);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Advances the timer by a single second. Pure: same input -> same output.
  const advance = useCallback((current: TimerState): TimerState => {
    const exercise = exercises[current.currentExerciseIndex];
    if (!exercise) return { ...current, phase: 'done' };

    if (current.phase === 'work') {
      if (current.secondsLeft > 1) {
        return { ...current, secondsLeft: current.secondsLeft - 1 };
      }
      // work finished → go to rest
      return {
        ...current,
        phase: 'rest',
        secondsLeft: exercise.restSeconds,
      };
    }

    if (current.phase === 'rest') {
      if (current.secondsLeft > 1) {
        return { ...current, secondsLeft: current.secondsLeft - 1 };
      }
      // rest finished → next set or next exercise
      if (current.currentSet < exercise.sets) {
        return {
          ...current,
          phase: 'work',
          currentSet: current.currentSet + 1,
          secondsLeft: exercise.workSeconds,
        };
      }
      const nextIndex = current.currentExerciseIndex + 1;
      if (nextIndex < exercises.length) {
        return {
          ...current,
          phase: 'work',
          currentExerciseIndex: nextIndex,
          currentSet: 1,
          secondsLeft: exercises[nextIndex].workSeconds,
        };
      }
      return { ...current, phase: 'done' };
    }

    return current;
  }, [exercises]);

  // Fast-forwards an active timer by N whole seconds, e.g. after the app was
  // backgrounded and the interval stopped ticking.
  const advanceBy = useCallback((current: TimerState, seconds: number): TimerState => {
    let next = current;
    for (let i = 0; i < seconds; i++) {
      if (next.phase !== 'work' && next.phase !== 'rest') break;
      next = advance(next);
    }
    return next;
  }, [advance]);

  // Restore any persisted session on mount, compensating for elapsed wall-clock
  // time so a workout backgrounded mid-hang resumes at the correct second.
  useEffect(() => {
    if (!storageKey) return;
    let cancelled = false;
    AsyncStorage.getItem(storageKey).then(json => {
      if (cancelled) return;
      if (json) {
        try {
          const saved: PersistedTimer = JSON.parse(json);
          if (
            saved.state &&
            saved.state.phase !== 'idle' &&
            saved.state.phase !== 'done' &&
            saved.state.totalExercises === exercises.length
          ) {
            const elapsed = saved.isRunning
              ? Math.max(0, Math.floor((Date.now() - saved.savedAt) / 1000))
              : 0;
            const resumed = elapsed > 0
              ? advanceBy(saved.state, elapsed)
              : saved.state;
            setState(resumed);
            setIsRunning(saved.isRunning && resumed.phase !== 'done');
          }
        } catch {
          // Corrupt snapshot — fall back to a fresh session.
        }
      }
      setRestored(true);
    });
    return () => { cancelled = true; };
    // Only run once, keyed by storage key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Persist the session whenever it changes (after the initial restore), and
  // clear the snapshot once the workout is idle or finished.
  useEffect(() => {
    if (!storageKey || !restored) return;
    if (state.phase === 'idle' || state.phase === 'done') {
      AsyncStorage.removeItem(storageKey).catch(() => {});
      return;
    }
    const payload: PersistedTimer = { state, isRunning, savedAt: Date.now() };
    AsyncStorage.setItem(storageKey, JSON.stringify(payload)).catch(() => {});
  }, [state, isRunning, storageKey, restored]);

  // Fast-forward on return to foreground. setInterval is suspended while the
  // app is backgrounded, so we record the wall-clock time on the way out and
  // advance the timer by however many seconds elapsed on the way back in.
  const backgroundedAtRef = useRef<number | null>(null);
  useEffect(() => {
    const onChange = (status: AppStateStatus) => {
      if (status === 'active') {
        const leftAt = backgroundedAtRef.current;
        backgroundedAtRef.current = null;
        if (leftAt === null) return;
        const elapsed = Math.max(0, Math.floor((Date.now() - leftAt) / 1000));
        if (elapsed <= 0) return;
        setState(prev => {
          if (!isRunning || (prev.phase !== 'work' && prev.phase !== 'rest')) {
            return prev;
          }
          const next = advanceBy(prev, elapsed);
          if (next.phase === 'done') setIsRunning(false);
          return next;
        });
      } else {
        // 'background' or 'inactive'
        if (backgroundedAtRef.current === null) {
          backgroundedAtRef.current = Date.now();
        }
      }
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [isRunning, advanceBy]);

  useEffect(() => {
    if (isRunning && state.phase !== 'done' && state.phase !== 'idle') {
      intervalRef.current = setInterval(() => {
        setState(prev => advance(prev));
      }, 1000);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [isRunning, state.phase, advance, clearTimer]);

  const start = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: prev.phase === 'idle' ? 'work' : prev.phase,
    }));
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setState(buildInitial());
    if (storageKey) AsyncStorage.removeItem(storageKey).catch(() => {});
  }, [buildInitial, clearTimer, storageKey]);

  const skip = useCallback(() => {
    setState(prev => {
      const exercise = exercises[prev.currentExerciseIndex];
      if (!exercise) return prev;

      if (prev.phase === 'work') {
        return { ...prev, phase: 'rest', secondsLeft: exercise.restSeconds };
      }
      if (prev.phase === 'rest') {
        if (prev.currentSet < exercise.sets) {
          return {
            ...prev,
            phase: 'work',
            currentSet: prev.currentSet + 1,
            secondsLeft: exercise.workSeconds,
          };
        }
        const nextIndex = prev.currentExerciseIndex + 1;
        if (nextIndex < exercises.length) {
          return {
            ...prev,
            phase: 'work',
            currentExerciseIndex: nextIndex,
            currentSet: 1,
            secondsLeft: exercises[nextIndex].workSeconds,
          };
        }
        return { ...prev, phase: 'done' };
      }
      return prev;
    });
  }, [exercises]);

  return {
    ...state,
    isRunning,
    start,
    pause,
    reset,
    skip,
    currentExercise: exercises[state.currentExerciseIndex] ?? null,
  };
}
