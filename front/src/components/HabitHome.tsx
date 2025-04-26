import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Button } from "@mui/material";
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/user.service';
import { UserDto } from '../types/user.types';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

export const HabitHome = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    
  }, []);

  const handleClick = () => {
    navigate('/login');
  };

  return (
    <Box
        sx={{
          backgroundColor: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h3" color="white">
          MyHabit
        </Typography>

        

        <Button
      variant="contained"
      endIcon={<ArrowForwardIcon />}
      onClick={handleClick}
      sx={{
        mt: 10,
        background: "transparent",
        color: "white",
        fontFamily: "Montserrat",
        boxShadow: "white 0px 0px 0px 2px inset",
        "&:hover": { background: "#eee", color: "black" },
      }}
    >
    </Button>

        
      </Box>

      
  );
}; 