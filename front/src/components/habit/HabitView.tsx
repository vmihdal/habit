import React, { useEffect, useState } from 'react';
import { Box, Container } from "@mui/material";
import { useAuth } from '../../contexts/AuthContext';
import { HabitViewHeader } from './HabitViewHeader';
import { HabitViewGoals } from './HabitViewGoals';
import { HabitViewCalendar } from './HabitViewCalendar';
import { HabitDto as Habit } from '../../types/habit.types';

export const HabitView = ({ habit_id }: { habit_id: number }) => {
  const { token } = useAuth();
  const [habit, setHabit] = useState<Habit | null>(null);

  useEffect(() => {
    
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
        <HabitViewHeader />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
        <HabitViewGoals />
        <HabitViewCalendar />
      </Box>
    </Container>
  );
}; 