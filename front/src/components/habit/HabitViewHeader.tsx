import React, { useEffect, useState } from 'react';
import { ArrowBack, Settings } from "@mui/icons-material";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import { useAuth } from '../../contexts/AuthContext';

export const HabitViewHeader = () => {
  const { token } = useAuth();

  useEffect(() => {
    
  }, []);

  const stats = [
    { value: "12", label: "Виконано" },
    { value: "3", label: "Пропущено" },
  ];

  return (
    <Box sx={{ mt: 7 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 1.75
      }}>
        <IconButton size="small">
          <ArrowBack sx={{ fontSize: 18 }} />
        </IconButton>
        <Typography 
          variant="h6" 
          sx={{ 
            fontSize: 20,
            fontWeight: 600
          }}
        >
          Гітара
        </Typography>
        <IconButton size="small">
          <Settings sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        py: 2
      }}>
        {stats.map((stat, index) => (
          <Box key={index} sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: 20,
                fontWeight: 600,
                mb: 0.5
              }}
            >
              {stat.value}
            </Typography>
            <Typography 
              variant="body2"
              sx={{ fontSize: 14 }}
            >
              {stat.label}
            </Typography>
          </Box>
        ))}
      </Box>
      <Divider />
    </Box>
  );
}; 