import React, { useEffect, useState } from 'react';
import { Box, Container, Divider, Paper } from "@mui/material";
import { HabitViewHeader } from './HabitViewHeader';
import { HabitViewGoals } from './HabitViewGoals';
import { HabitViewCalendar } from './HabitViewCalendar';
import { HabitDto as Habit } from '../../types/habit.types';

export const HabitView = ({ habit, setHabit }: { habit: Habit | null, setHabit: React.Dispatch<React.SetStateAction<Habit | null>> }) => {

  if (!habit) {
    return;
  }

  return (
    <Paper sx={{ p: 2, m: 0 }}>
      <HabitViewHeader habit={habit} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
        <HabitViewGoals habit={habit} setHabit={setHabit} />
        <Divider />
        <HabitViewCalendar habit={habit} setHabit={setHabit} />
      </Box>
    </Paper>
  );
}; 