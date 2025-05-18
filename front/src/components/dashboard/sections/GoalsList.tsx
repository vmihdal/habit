import { CircularProgress, Grid, Paper, Typography, IconButton, Box, Divider, Button, Tooltip, Menu, MenuItem, DialogContent, Dialog } from '@mui/material';
import { MoreVert as MoreVertIcon, EventBusy as EventBusyIcon } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import { useConfirm } from '../../common/Confirmation';
import { HabitView } from '../../habit/HabitView';
import { useHabit } from '../../../contexts/HabitContext';
import { HabitDto, HabitFrequency, HabitStatus } from '../../../types/habit.types';
import { HabitCreate } from '../../HabitCreate';

// Base habit interface for creating new habits
interface Habit {
  id: number;
  name: string;
  frequency: HabitFrequency;
  startDate?: Date;
  endDate?: Date;
  reminder?: Date;
  status?: HabitStatus;
  targetDays?: number;
  color?: string;  // Hex color format (#RRGGBB or #RGB)
  customDates?: Date[];
  doneDates?: Date[];
}

// Helper: get Monday of the current week
function getStartOfWeek(date = new Date()): Date {
  const day = date.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = (day === 0 ? -6 : 1) - day; // Monday as first day
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// Generate array of { label, date } for current week
const weekDays = Array.from({ length: 7 }).map((_, i) => {
  const monday = getStartOfWeek();
  const date = new Date(monday);
  date.setDate(monday.getDate() + i);
  return {
    id: i,
    date,
  };
});

const API_URL = 'http://localhost:3001';

export const GoalsList = () => {
  const { token } = useAuth();
  const { habits, setHabits, setCurrentHabit, removeHabit } = useHabit();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [habit_view_open, setHabitViewOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<{ [key: number]: HTMLElement | null }>({});
  const confirm = useConfirm();

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await axios.get(`${API_URL}/habits`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setHabits(response.data);
      } catch (err) {
        setError('Failed to fetch habits');
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [token, setHabits]);

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

  if (!habits) {
    return null;
  }

  const total = habits.length;
  const completed = habits.filter((goal) => goal.status === HabitStatus.COMPLETED).length;

  const handleDayClick = (isActive: boolean, date: Date, habit: HabitDto) => {
    if (!isActive) {
      return;
    }

    const dateString = date.toISOString();
    const updatedDoneDates = habit.doneDates ? [...habit.doneDates] : [];

    const existingDateIndex = updatedDoneDates.findIndex(d => {
      const d1 = new Date(d);
      return (
        d1.getFullYear() === date.getFullYear() &&
        d1.getMonth() === date.getMonth() &&
        d1.getDate() === date.getDate()
      );
    });

    if (existingDateIndex !== -1) {
      updatedDoneDates.splice(existingDateIndex, 1);
    } else {
      updatedDoneDates.push(dateString);
    }

    const updateHabit = async () => {
      try {
        await axios.patch(`${API_URL}/habits/${habit.id}`, { doneDates: updatedDoneDates }, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setHabits((prevItems: HabitDto[]) =>
          prevItems.map((item: HabitDto) => {
            if (item.id === habit.id) {
              return { ...item, doneDates: updatedDoneDates };
            }
            return item;
          })
        );
      } catch (error) {
        console.error('Failed to update habit:', error);
      }
    };

    updateHabit();
  };

  enum MenuCommand {
    VIEW,
    EDIT,
    MARK_AS_COMPLETED,
    DELETE
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, habitId: number) => {
    setMenuAnchorEl(prev => ({
      ...prev,
      [habitId]: event.currentTarget
    }));
  };

  const handleMenuClose = (habitId: number) => {
    setMenuAnchorEl(prev => ({
      ...prev,
      [habitId]: null
    }));
  };

  const handleMenuClick = (habit: HabitDto, cmd: MenuCommand) => {
    handleMenuClose(habit.id);
    switch (cmd) {
      case MenuCommand.VIEW:
        setCurrentHabit(habit);
        setHabitViewOpen(true);
        break;
      case MenuCommand.EDIT:
        console.log('EDIT');
        break;
      case MenuCommand.MARK_AS_COMPLETED:
        console.log('MARK_AS_COMPLETED');
        break;
      case MenuCommand.DELETE:
        confirm({
          title: 'Видалення звички',
          description: 'Ви впевнені, що хочете видалити цю звичку?',
        }).then((confirmed) => {
          if (confirmed) {
            removeHabit(habit.id);
          }
        });
        break;
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
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
              {completed}/{total} цілей виконано
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
                  {total ? Math.round((completed / total) * 100) : 0} %
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Grid>

      {habits.map((habit, index) => {
        return (<Grid size={{ xs: 12 }} key={habit.id}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">{habit.name}</Typography>
              <IconButton size="small" onClick={(event) => handleMenuOpen(event, habit.id)}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                id={`habit-menu-${habit.id}`}
                anchorEl={menuAnchorEl[habit.id]}
                open={Boolean(menuAnchorEl[habit.id])}
                onClose={() => handleMenuClose(habit.id)}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                slotProps={{
                  paper: {
                    elevation: 1,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 0px 0px rgba(136, 136, 136, 0.1))',
                    },
                  },
                }}
              >
                <MenuItem onClick={() => handleMenuClick(habit, MenuCommand.VIEW)}>Переглянути</MenuItem>
                <MenuItem onClick={() => handleMenuClick(habit, MenuCommand.EDIT)}>Редагувати</MenuItem>
                <MenuItem onClick={() => handleMenuClick(habit, MenuCommand.MARK_AS_COMPLETED)}>Позначити як виконану</MenuItem>
                <Divider />
                <MenuItem onClick={() => handleMenuClick(habit, MenuCommand.DELETE)}><Typography color="error">Видалити</Typography></MenuItem>
              </Menu>
            </Box>

            <Grid container spacing={1}>
              {weekDays.map((day) => {
                let isActive = habit.frequency === HabitFrequency.DAILY;

                if (habit.frequency === HabitFrequency.CUSTOM && habit.customDates) {
                  isActive = habit.customDates.find(date => {
                    const d = new Date(date);
                    return (
                      d.getFullYear() === day.date.getFullYear() &&
                      d.getMonth() === day.date.getMonth() &&
                      d.getDate() === day.date.getDate()
                    );
                  }) !== undefined;
                }

                let isDone = habit.doneDates?.find(date => {
                  const d = new Date(date);
                  return (
                    d.getFullYear() === day.date.getFullYear() &&
                    d.getMonth() === day.date.getMonth() &&
                    d.getDate() === day.date.getDate()
                  );
                }) !== undefined;

                return (
                  <Grid key={day.id}>
                    <Tooltip title={`${day.date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}`}>
                      <Button
                        onClick={() => handleDayClick(isActive, day.date, habit)}
                        sx={{
                          width: 40,
                          height: 40,
                          border: 1,
                          minWidth: 0,
                          padding: 0,
                          borderStyle: 'dashed',
                          borderColor: isActive ? 'black' : 'grey.400',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isActive ? isDone ? 'white' : 'black' : 'grey.400',
                          backgroundColor: isDone ? 'rgb(0, 0, 0)' : 'white',
                          fillColor: isDone ? 'black' : 'white',
                        }}
                      >
                        {isActive ? (
                          <Typography variant="body2">
                            {day.date.toLocaleDateString('uk-UA', { weekday: 'short' })}
                          </Typography>
                        ) : (
                          <EventBusyIcon fontSize="small" />
                        )}
                      </Button>
                    </Tooltip>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
          {index < total - 1 && <Divider sx={{ my: 2 }} />}
        </Grid>
        );
      })}
      <Dialog 
        open={habit_view_open} 
        onClose={() => {
          setCurrentHabit(null);
          setHabitViewOpen(false)
        }}
        fullWidth
      >
        <DialogContent sx={{ p: 0, m: 0 }}>
          <HabitView />
        </DialogContent>
      </Dialog>
    </Grid>
  );
}; 