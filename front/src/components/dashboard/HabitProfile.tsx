import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserDto } from '../../types/user.types';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, DialogContent, Typography, useMediaQuery, useTheme, Dialog } from '@mui/material';
import { GoalsList } from "./sections/GoalsList";
import { Add as AddIcon } from '@mui/icons-material';
import { LogoutButton } from '../LogoutButton';
import { HabitCreate } from '../HabitCreate';

export const HabitProfile: React.FC = () => {

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [habit_create_view_open, setHabitCreateViewOpen] = useState(false);
  
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
        onClick={() => setHabitCreateViewOpen(true)}
        sx={{
          color: 'black',
        }}
      >
      </Button>
    </Box>
      <GoalsList />
      <Dialog 
        open={habit_create_view_open} 
        onClose={() => {
          setHabitCreateViewOpen(false)
        }}
        fullWidth
      >
        <DialogContent sx={{ p: 0, m: 0 }}>
          <HabitCreate setHabitCreateViewOpen={setHabitCreateViewOpen}/>
        </DialogContent>
      </Dialog>
    </Container>
  );
}; 