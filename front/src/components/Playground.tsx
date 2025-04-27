import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';

export const Playground: React.FC = () => {

  return (
      <Box
        sx={{
          p: 3,
          width: 360,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {/* Title */}
        <Typography variant="h6" fontWeight="bold">
          Нова звичка
        </Typography>
  
        {/* Name input */}
        <TextField
          placeholder="Назва"
          fullWidth
          variant="outlined"
          InputProps={{
            sx: { backgroundColor: '#f0f2f5', borderRadius: 2 },
          }}
        />
  
        {/* Settings section */}
        <Typography variant="subtitle1" fontWeight="bold" mt={2}>
          Налаштування
        </Typography>
  
        {/* Duration */}
        <TextField
          label="Тривалість"
          select
          fullWidth
          defaultValue="Місяць"
        >
          <MenuItem value="Місяць">Місяць</MenuItem>
          <MenuItem value="Тиждень">Тиждень</MenuItem>
        </TextField>
  
        {/* Repetition */}
        <TextField
          label="Повторення"
          select
          fullWidth
          defaultValue="Щоденно"
        >
          <MenuItem value="Щоденно">Щоденно</MenuItem>
          <MenuItem value="Щотижня">Щотижня</MenuItem>
        </TextField>
  
        {/* Start */}
        <TextField
          label="Початок"
          select
          fullWidth
          defaultValue="Сьогодні"
        >
          <MenuItem value="Сьогодні">Сьогодні</MenuItem>
          <MenuItem value="Завтра">Завтра</MenuItem>
        </TextField>
  
        {/* Reminder */}
        <TextField
          label="Нагадування"
          type="time"
          fullWidth
          defaultValue="19:30"
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
        />
  
        {/* Add Goal link */}
        <Typography
          variant="body2"
          color="primary"
          sx={{ mt: 1, cursor: 'pointer' }}
        >
          + Додати ціль...
        </Typography>
  
        <Box sx={{ flexGrow: 1 }} />
  
        <Divider sx={{ my: 2 }} />
  
        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#e0e3eb',
              color: '#000',
              '&:hover': { backgroundColor: '#d6d9e0' },
            }}
          >
            Скасувати
          </Button>
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#040616',
              color: '#fff',
              '&:hover': { backgroundColor: '#1a1c24' },
            }}
          >
            Зберегти
          </Button>
        </Box>
      </Box>
  );
}; 