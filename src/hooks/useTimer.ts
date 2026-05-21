import { useState, useEffect, useRef, useCallback } from 'react';
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

export function useTimer(exercises: Exercise[]): UseTimerReturn {
  const [isRunning, setIsRunning] = useState(false);
  const [state, setState] = useState<TimerState>({
    phase: 'idle',
    currentExerciseIndex: 0,
    currentSet: 1,
    secondsLeft: exercises[0]?.workSeconds ?? 0,
    totalExercises: exercises.length,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

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
    setState({
      phase: 'idle',
      currentExerciseIndex: 0,
      currentSet: 1,
      secondsLeft: exercises[0]?.workSeconds ?? 0,
      totalExercises: exercises.length,
    });
  }, [exercises, clearTimer]);

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
