import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, Avatar, Grid, Divider, List, ListItem, ListItemText, Chip } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/user.service';
import { UserDto } from '../types/user.types';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await getUserProfile();
        setProfile(userProfile);
      } catch (err) {
        setError('Failed to load profile information');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
            {(profile?.name || profile?.email || 'U')[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome to Your Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Hello, {profile?.name || profile?.email}! You're successfully logged in.
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Typography>Loading profile information...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : profile ? (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Profile Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1">
                  <strong>Email:</strong> {profile.email}
                </Typography>
                {profile.name && (
                  <Typography variant="body1">
                    <strong>Name:</strong> {profile.name}
                  </Typography>
                )}
                <Typography variant="body1">
                  <strong>Member since:</strong> {formatDate(profile.createdAt)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Account Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1">
                  <strong>User ID:</strong> {profile.id}
                </Typography>
                <Typography variant="body1">
                  <strong>Last updated:</strong> {formatDate(profile.updatedAt)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Your Habits
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {profile.habits.length === 0 ? (
                  <Typography variant="body1" color="text.secondary">
                    You haven't created any habits yet.
                  </Typography>
                ) : (
                  <List>
                    {profile.habits.map((habit) => (
                      <ListItem 
                        key={habit.id}
                        sx={{
                          mb: 2,
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          boxShadow: 1
                        }}
                      >
                        <ListItemText
                          primary={habit.name}
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Chip 
                                label={habit.frequency} 
                                size="small" 
                                sx={{ mr: 1 }}
                              />
                              <Chip 
                                label={habit.status} 
                                size="small"
                                color={habit.status === 'ACTIVE' ? 'success' : 'default'}
                              />
                              {habit.targetDays && (
                                <Typography variant="caption" sx={{ ml: 1 }}>
                                  Target: {habit.targetDays} days
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Grid>
          </Grid>
        ) : null}
      </Paper>
    </Container>
  );
}; 