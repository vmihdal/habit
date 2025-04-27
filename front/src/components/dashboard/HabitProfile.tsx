import { React, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserDto } from '../../types/user.types';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import { GoalsList } from "./sections/GoalsList";

export const HabitProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  useEffect(() => {
    
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
     <img 
            width={isMobile ? "150" : "200"} 
            height={isMobile ? "43.24" : "57.65"} 
            alt="Logo" 
            src="/frame-13838-2.svg" 
            style={{ marginBottom: "2rem" }}
          />
      <Typography variant="subtitle1" sx={{ mb: 4 }}>
        {new Date().toLocaleDateString('uk-UA', { 
          month: 'long',
          day: 'numeric'
        })}
      </Typography>
      <GoalsList />
    </Container>
  );
}; 