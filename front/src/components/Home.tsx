import React from 'react';
import { Container, Typography, Paper, Box, Avatar } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 6, 
          mt: 4,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar 
            sx={{ 
              width: 64, 
              height: 64, 
              bgcolor: 'primary.main',
              fontSize: '1.5rem',
              mr: 2
            }}
          >
            {(user?.name || user?.email || 'U')[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome to Your Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Hello, {user?.name || user?.email}! You're successfully logged in.
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" paragraph>
            This is your personal dashboard where you can manage your account and access your data.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}; 