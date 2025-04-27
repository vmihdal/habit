import { CircularProgress, Grid, Paper, Typography, IconButton, Box, Divider } from '@mui/material';
import { MoreVert as MoreVertIcon, Close as CloseIcon } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';

export interface Goal {
    id: string;
    title: string;
    progress: number;
    activeDays: string[];
    disabledDays?: string[];
  }
  
  export interface GoalsResponse {
    goals: Goal[];
    totalGoals: number;
    completedGoals: number;
  }

const weekDays = [
    { id: "mon", label: "Пн" },
    { id: "tue", label: "Вт" },
    { id: "wed", label: "Ср" },
    { id: "thu", label: "Чт" },
    { id: "fri", label: "Пт" },
    { id: "sat", label: "Сб" },
    { id: "sun", label: "Нд" },
  ];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchGoals = async (): Promise<GoalsResponse> => {
  try {
    // Simulate API call delay
    await delay(1000);
    return mockGoalsData;
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
};

export const mockGoalsData: GoalsResponse = {
    goals: [
      {
        id: '1',
        title: 'Гітара',
        progress: 60,
        activeDays: ['mon', 'wed', 'fri'],
        disabledDays: ['sun']
      },
      {
        id: '2',
        title: 'Читання',
        progress: 80,
        activeDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
        disabledDays: ['sat', 'sun']
      },
      {
        id: '3',
        title: 'Вокал',
        progress: 40,
        activeDays: ['tue', 'thu'],
        disabledDays: ['mon', 'wed', 'fri', 'sat', 'sun']
      },
      {
        id: '4',
        title: 'Front-End Курс',
        progress: 90,
        activeDays: ['mon', 'wed', 'fri'],
        disabledDays: ['tue', 'thu', 'sat', 'sun']
      },
      {
        id: '5',
        title: 'Тренування',
        progress: 70,
        activeDays: ['mon', 'tue', 'thu', 'fri'],
        disabledDays: ['wed', 'sat', 'sun']
      }
    ],
    totalGoals: 5,
    completedGoals: 2
  };

export const GoalsList = () => {

    const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [goalsData, setGoalsData] = useState<GoalsResponse | null>(null);


  useEffect(() => {
    const loadGoals = async () => {
      try {
        const data = await fetchGoals();
        setGoalsData(data);
      } catch (err) {
        setError('Failed to load goals');
      } finally {
        setLoading(false);
      }
    };

    loadGoals();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress sx={{ color: 'black' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  if (!goalsData || !goalsData.goals) {
    return null;
  }

  const { goals, completedGoals, totalGoals } = goalsData;

  return (
    <Grid container spacing={3}>
    <Grid size={{xs: 12}}>
      <Paper 
        sx={{ 
          p: 3, 
          bgcolor: 'black',
          color: 'primary.contrastText',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
         <Box
            sx={{
              display: 'inline',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Typography variant="h6">У тебе все вийде!</Typography>
            <Typography variant="body2">
              {completedGoals}/{totalGoals} цілей виконано
            </Typography>
          </Box>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#040616',
        borderRadius: 2,
        padding: 2,
        width: '50%',
        height: 150,
      }}
    >
         
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
        }}
      >
        {/* Background circle */}
        <CircularProgress
          variant="determinate"
          value={100}
          size={100}
          thickness={5}
          sx={{
            color: '#2E2E3A', // Gray background ring
            position: 'absolute', // Stack under
          }}
        />
        {/* Foreground (actual progress) */}
        <CircularProgress
          variant="determinate"
          value={25}
          size={100}
          thickness={5}
          sx={{
            color: '#1E90FF', // Active progress color
          }}
        />
        {/* Centered text */}
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h6"
            component="div"
            color="white"
          >
             {Math.round((completedGoals / totalGoals) * 100)}%
          </Typography>
        </Box>
      </Box>
    </Box>
      </Paper>
    </Grid>

    {goals.map((goal, index) => (
      <Grid size={{xs: 12}} key={goal.id}>
        <Paper sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">{goal.title}</Typography>
            <IconButton size="small">
              <MoreVertIcon />
            </IconButton>
          </Box>

          <Grid container spacing={1}>
            {weekDays.map((day) => {
              const isActive = goal.activeDays.includes(day.id);
              const isDisabled = goal.disabledDays?.includes(day.id);

              return (
                <Grid key={day.id}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      border: 1,
                      borderStyle: isActive ? 'dashed' : 'solid',
                      borderColor: isDisabled ? 'grey.300' : 'black',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isActive ? 'black' : 'grey.500'
                    }}
                  >
                    {isDisabled ? (
                      <CloseIcon fontSize="small" />
                    ) : (
                      <Typography variant="body2">
                        {day.label}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
        {index < goals.length - 1 && <Divider sx={{ my: 2 }} />}
      </Grid>
    ))}
  </Grid>
  );
}; 