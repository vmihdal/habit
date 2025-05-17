import React, { useEffect, useState, memo } from 'react';
import { Box, Container, Divider, Paper } from "@mui/material";
import { HabitViewHeader } from './HabitViewHeader';
import { HabitViewGoals } from './HabitViewGoals';
import { HabitViewCalendar } from './HabitViewCalendar';
import { HabitDto as Habit } from '../../types/habit.types';
import { useHabit } from '../../contexts/HabitContext';

export const HabitView = memo(() => {
  const { currentHabit } = useHabit();

  if (!currentHabit) return null;

  return (
    <Paper sx={{ p: 2, m: 0 }}>
      <HabitViewHeader habit={currentHabit} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
        <HabitViewGoals />
        <Divider />
        <HabitViewCalendar />
      </Box>
    </Paper>
  );
});

HabitView.displayName = 'HabitView'; 