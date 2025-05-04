import React, { useEffect, useState } from 'react';
import { ArrowBack, Settings } from "@mui/icons-material";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import { useAuth } from '../../contexts/AuthContext';
import { HabitDto as Habit } from '../../types/habit.types';

export const HabitViewHeader = ({ habit }: { habit: Habit | null }) => {
  const { token } = useAuth();

  useEffect(() => {
    
  }, []);

  if (!habit) {
    return null;
  }

  return (
    <Box sx={{ mt: 0 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        mb: 1.75
      }}>
        {/* <IconButton size="small">
          <ArrowBack sx={{ fontSize: 18 }} />
        </IconButton> */}
        <Typography 
          variant="h6"
          sx={{ 
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          {habit.name}
        </Typography>
        {/* <IconButton size="small">
          <Settings sx={{ fontSize: 18 }} />
        </IconButton> */}
      </Box>
      <Divider />
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        py: 2
      }}>
        <Box key={0} sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: 20,
                fontWeight: 600,
                mb: 0.5
              }}
            >
              {habit.doneDates ? habit.doneDates.length : 0}
            </Typography>
            <Typography 
              variant="body2"
              sx={{ fontSize: 14 }}
            >
              Днів  виконано
            </Typography>
          </Box>
      </Box>
      <Divider />
    </Box>
  );
}; 