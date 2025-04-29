import React from 'react';
import { AppBar, Toolbar, Button, Box, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LogoutButton: React.FC = () => {
  const { token, logout } = useAuth();
  if (!token) {
    return;
  }

  return (
    <Button 
              onClick={logout} 
              variant="contained"
              sx={{ 
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                },
                backgroundColor: 'black',
                color: 'white',
              }}
            >
              Вийти
            </Button>
  );
}; 