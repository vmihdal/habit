import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Button } from "@mui/material";
import { useAuth } from '../../contexts/AuthContext';
import { HabitViewHeader } from './HabitViewHeader';
import { HabitViewGoals } from './HabitViewGoals';
import { HabitViewCalendar } from './HabitViewCalendar';

export const HabitView: React.FC = () => {
  const { token } = useAuth();

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