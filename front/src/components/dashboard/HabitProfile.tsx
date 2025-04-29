import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserDto } from '../../types/user.types';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import { GoalsList } from "./sections/GoalsList";
import { Add as AddIcon } from '@mui/icons-material';
import { LogoutButton } from '../LogoutButton';

export const HabitProfile: React.FC = () => {

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
      <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
<img 
            width={isMobile ? "150" : "200"} 
            height={isMobile ? "43.24" : "57.65"} 
            alt="Logo" 
            src="/frame-13838-2.svg" 
            style={{ marginBottom: "2rem" }}
          />
        <Box sx={{
          justifyContent: 'flex-end',
        }}>
            <LogoutButton />
          </Box>
    </Box>
     
      <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 2,
      }}
    >
        <Typography variant="h6">
        {new Date().toLocaleDateString('uk-UA', { 
          month: 'long',
          day: 'numeric'
        })}
      </Typography>
      
      <Button
        variant="text"
        startIcon={<AddIcon/>}
        onClick={() => navigate('/add-habit')}
        sx={{
          color: 'black',
        }}
      >
      </Button>
    </Box>
      {/* <GoalsList /> */}
    </Container>
  );
}; 