import React, { createContext, useContext, useState, useCallback, ReactNode, Dispatch, SetStateAction } from 'react';
import { HabitDto } from '../types/habit.types';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface HabitContextType {
  habits: HabitDto[];
  setHabits: Dispatch<SetStateAction<HabitDto[]>>;
  currentHabit: HabitDto | null;
  setCurrentHabit: (habit: HabitDto | null) => void;
  updateHabit: (habitId: number, updates: Partial<HabitDto>) => Promise<void | HabitDto>;
  removeHabit: (habitId: number) => Promise<void>;
  addHabit: (habit: Partial<HabitDto>) => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const API_URL = 'http://localhost:3001';

export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const [habits, setHabits] = useState<HabitDto[]>([]);
  const [currentHabit, setCurrentHabit] = useState<HabitDto | null>(null);
  const { token } = useAuth();

  const updateHabit = useCallback((habitId: number, updates: Partial<HabitDto>) => {
    if (!token) {
      let message = "Cannot update habit: No authentication token available";
      console.error(message);
      return Promise.reject(message);
    }

    let promise = axios.patch(`${API_URL}/habits/${habitId}`, { ...updates }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then(response => {
      const updatedHabit = response.data as HabitDto;

      // Update the current habit if it's the one being modified
      setCurrentHabit(prev => {
        if (!prev || prev.id !== habitId) return prev;
        return updatedHabit;
      });

      // Update the habit in the habits list
      setHabits(prevHabits =>
        prevHabits.map(habit =>
          habit.id === habitId ? updatedHabit : habit
        )
      );

      return updatedHabit;
    }).catch(message => {
      console.error("Failed to update habit: ", message);
      message
    });

    return promise;
  }, [token]);

  const removeHabit = useCallback((habitId: number) => {
    if (!token) {
      let message = "Cannot update habit: No authentication token available";
      console.error(message);
      return Promise.reject(message);
    }

    let promise = axios.delete(`${API_URL}/habits/${habitId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then(_ => {
      // Update the current habit if it's the one being modified

      if(currentHabit && currentHabit.id == habitId) {
        setCurrentHabit(null);
      }

      setHabits(prevHabits =>
        prevHabits.filter(habit =>
          habit.id !== habitId
        )
      );
    }).catch(message => {
      console.error("Failed to update habit: ", message);
      message
    });

    return promise;
  }, [token]);

  const addHabit = useCallback((habit: Partial<HabitDto>) => {
    if (!token) {
      let message = "Cannot update habit: No authentication token available";
      console.error(message);
      return Promise.reject(message);
    }

    let promise = axios.post(`${API_URL}/habits/`, habit, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then(response => {
      // Update the current habit if it's the one being modified
      let newHabit = response.data as HabitDto;

      setHabits(prevHabits =>
      [...prevHabits, newHabit ]
      );
    }).catch(message => {
      console.error("Failed to update habit: ", message);
      message
    });

    return promise;
  }, [token]);

  return (
    <HabitContext.Provider value={{
      habits,
      setHabits,
      currentHabit,
      setCurrentHabit,
      updateHabit,
      removeHabit,
      addHabit
    }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabit = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
}; 