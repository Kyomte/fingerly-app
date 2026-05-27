import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Routine } from '../types';

const STORAGE_KEY = '@fingerly_user_routines';

interface RoutinesContextValue {
  userRoutines: Routine[];
  saveRoutine: (routine: Routine) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
}

const RoutinesContext = createContext<RoutinesContextValue | null>(null);

export function RoutinesProvider({ children }: { children: React.ReactNode }) {
  const [userRoutines, setUserRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(json => {
      if (json) setUserRoutines(JSON.parse(json));
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

  return (
    <RoutinesContext.Provider value={{ userRoutines, saveRoutine, deleteRoutine }}>
      {children}
    </RoutinesContext.Provider>
  );
}

export function useRoutines() {
  const ctx = useContext(RoutinesContext);
  if (!ctx) throw new Error('useRoutines must be used within RoutinesProvider');
  return ctx;
}
