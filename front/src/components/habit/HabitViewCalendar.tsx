import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, pickersDayClasses } from '@mui/x-date-pickers/PickersDay';
import { Box, Container } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/uk';
import { HabitDto as Habit, HabitFrequency } from '../../types/habit.types';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

function CustomDayButton(props: any, habit: Habit, setHabit: React.Dispatch<React.SetStateAction<Habit | null>>) {
  const { token } = useAuth();
  const { day, selectedDate, ...other } = props;
  const dayDate = new Date(day);
  
  let isActive = habit.frequency === HabitFrequency.DAILY;
  if (habit.frequency === HabitFrequency.CUSTOM && habit.customDates) {
    isActive = habit.customDates.find(date => {
      const d = new Date(date);
      return (
        d.getFullYear() === dayDate.getFullYear() &&
        d.getMonth() === dayDate.getMonth() &&
        d.getDate() === dayDate.getDate()
      );
    }) !== undefined;
  }

  let isDone = habit.doneDates?.find(date => {
    const d = new Date(date);
    return (
      d.getFullYear() === dayDate.getFullYear() &&
      d.getMonth() === dayDate.getMonth() &&
      d.getDate() === dayDate.getDate()
    );
  }) !== undefined;

  const handleDayClick = (date: Date, habit: Habit) => {

    if (habit.doneDates && habit.doneDates.length > 0) {
      let i = habit.doneDates.findIndex(d => {
        const date1 = new Date(d);
        return (
          date1.getFullYear() === date.getFullYear() &&
          date1.getMonth() === date.getMonth() &&
          date1.getDate() === date.getDate()
        );
      })

      if (i !== -1) {
        habit.doneDates.splice(i, 1);
      } else {
        habit.doneDates.push(date);
      }
    } else {
      habit.doneDates = [date];
    }

    axios.patch(`${API_URL}/habits/${habit.id}`, { doneDates: habit.doneDates }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then( _ => {
      setHabit((prev) => {
        if (!prev) {
          return null;
        }
        return { ...prev, doneDates: habit.doneDates };
      });
    }).catch(error => {
      console.error(error);
    });
  }

  return (
    <PickersDay
      {...other}
      day={day}
      selected={isDone}
      disabled={!isActive}
      onClick={() => handleDayClick(dayDate, habit)}
      sx={{
        border: 1,
        minWidth: 0,
        padding: 0,
        borderStyle: 'dashed',
        borderColor: isActive ? 'black' : 'grey.400',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fillColor: isDone ? 'black' : 'white',
        [`&&.${pickersDayClasses.selected}`]: {
          background: isDone ? 'rgb(0, 0, 0)' : 'white',
          color: isActive ? isDone ? 'white' : 'black' : 'grey.400',
        },
        [`&&.${pickersDayClasses.root}:hover`]: {
          background: 'rgba(0, 0, 0, 0.1)',
        }
      }}
    >
    </PickersDay>
  );
}

export const HabitViewCalendar = ({ habit, setHabit }: { habit: Habit | null, setHabit: React.Dispatch<React.SetStateAction<Habit | null>>}) => {
  const { token } = useAuth();
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {

  }, []);

  if (!habit) {
    return null;
  }

  return (
    <Container maxWidth="md">
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
        <DateCalendar
          value={value}
          slots={{
            day: (props: any) => CustomDayButton(props, habit, setHabit),
          }}
          sx={{
            '&.MuiDateCalendar-root': {
              height: '100%',
              width: '100%',
              maxHeight: 'none',
              '& .MuiDayCalendar-weekDayLabel': {
                fontSize: '1rem',
              },
              '& div[role="row"]': {
                justifyContent: 'space-evenly',
              },
              '& .MuiDayCalendar-slideTransition': {
                minHeight: '500px',
              },
              '& .MuiPickersDay-root': {
                height: '50px',
                width: '50px',
                fontSize: '1rem',
              },
            },
          }}
        />
      </LocalizationProvider>
    </Container>
  );
}; 