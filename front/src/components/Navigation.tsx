import React from 'react';
import { AppBar, Toolbar, Button, Box, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Navigation: React.FC = () => {
  const { token, logout } = useAuth();

  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{ 
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Button 
            component={RouterLink} 
            to="/" 
            color="primary"
            sx={{ 
              fontWeight: 600,
              fontSize: '1.1rem',
              '&:hover': {
                bgcolor: 'transparent',
              }
            }}
          >
            Home
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          {token ? (
            <Button 
              onClick={logout} 
              color="error" 
              variant="outlined"
              sx={{ 
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                }
              }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button 
                component={RouterLink} 
                to="/login" 
                color="primary"
                sx={{ 
                  mr: 2,
                  '&:hover': {
                    bgcolor: 'transparent',
                  }
                }}
              >
                Login
              </Button>
              <Button 
                component={RouterLink} 
                to="/register" 
                variant="contained" 
                color="primary"
                sx={{ 
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                  }
                }}
              >
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}; 