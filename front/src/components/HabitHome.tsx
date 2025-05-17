import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

export const HabitHome: React.FC = () => {
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