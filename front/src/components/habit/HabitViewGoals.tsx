import React, { useEffect, useState } from 'react';
import { Close } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  IconButton,
  Typography,
  Paper
} from "@mui/material";
import { useAuth } from '../../contexts/AuthContext';


export const HabitViewGoals = () => {
  const { token } = useAuth();

  useEffect(() => {

  }, []);

  const goals = [
    {
      id: 1,
      text: "Зіграти першу мелодію",
      completed: false,
    },
    {
      id: 2,
      text: "Вивчити 10 акордів",
      completed: true,
    },
  ];

  return (
    <Box>
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 500,
          mb: 1.5
        }}
      >
        Цілі
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {goals.map((goal) => (
          <Paper
            key={goal.id}
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 1.5,
              borderRadius: 2
            }}
          >
            <Checkbox
              checked={goal.completed}
              sx={{
                p: 0,
                mr: 1.5,
                width: 20,
                height: 20
              }}
            />
            <Typography
              sx={{
                flex: 1,
                fontSize: 14,
                textDecoration: goal.completed ? "line-through" : "none",
              }}
            >
              {goal.text}
            </Typography>
            <IconButton size="small">
              <Close sx={{ fontSize: 12 }} />
            </IconButton>
          </Paper>
        ))}
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            borderRadius: 2
          }}
        >
          <Typography
            sx={{
              color: 'primary.main',
              fontSize: 14,
              fontWeight: 500
            }}
          >
            + Додати ціль...
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}; 