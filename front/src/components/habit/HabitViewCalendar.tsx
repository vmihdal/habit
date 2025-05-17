import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, pickersDayClasses } from '@mui/x-date-pickers/PickersDay';
import { Box, Container } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState, memo } from 'react';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/uk';
import { HabitDto, HabitFrequency } from '../../types/habit.types';
import axios from 'axios';
import CheckIcon from '@mui/icons-material/Check';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { useHabit } from '../../contexts/HabitContext';

const API_URL = 'http://localhost:3001';

interface CustomDayButtonProps {
  day: Dayjs;
  selectedDate: Dayjs | null;
  habit: HabitDto;
  onDaySelect: (date: Dayjs) => void;
  outsideCurrentMonth: boolean;
  isFirstVisibleCell: boolean;
  isLastVisibleCell: boolean;
}

const CustomDayButton = memo(({ day, selectedDate, habit, onDaySelect, outsideCurrentMonth, isFirstVisibleCell, isLastVisibleCell }: CustomDayButtonProps) => {
  const { token } = useAuth();
  const { updateHabit } = useHabit();
  const dayDate = new Date(day.toDate());

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

  const handleDayClick = async () => {
    if (!isActive) return;

    const dateString = dayDate.toISOString();
    const updatedDoneDates = habit.doneDates ? [...habit.doneDates] : [];
    const existingDateIndex = updatedDoneDates.findIndex(d => {
      const d1 = new Date(d);
      return (
        d1.getFullYear() === dayDate.getFullYear() &&
        d1.getMonth() === dayDate.getMonth() &&
        d1.getDate() === dayDate.getDate()
      );
    });

    if (existingDateIndex !== -1) {
      updatedDoneDates.splice(existingDateIndex, 1);
    } else {
      updatedDoneDates.push(dateString);
    }

    try {
      await axios.patch(`${API_URL}/habits/${habit.id}`, { doneDates: updatedDoneDates }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      updateHabit(habit.id, { doneDates: updatedDoneDates });
      onDaySelect(day);
    } catch (error) {
      console.error('Failed to update habit:', error);
    }
  };

  return (
    <PickersDay
      day={day}
      selected={isDone}
      disabled={!isActive}
      onClick={handleDayClick}
      onDaySelect={onDaySelect}
      outsideCurrentMonth={outsideCurrentMonth}
      isFirstVisibleCell={isFirstVisibleCell}
      isLastVisibleCell={isLastVisibleCell}
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
      {isActive && isDone ? <CheckIcon fontSize="small" /> : isActive ? null : <EventBusyIcon fontSize="small" />}
    </PickersDay>
  );
});

CustomDayButton.displayName = 'CustomDayButton';

export const HabitViewCalendar = memo(() => {
  const { currentHabit } = useHabit();
  const [value, setValue] = useState<Dayjs | null>(null);

  if (!currentHabit) {
    return null;
  }

  return (
    <Container maxWidth="md">
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
        <DateCalendar
          value={value}
          onChange={(newValue) => setValue(newValue)}
          slots={{
            day: (props) => (
              <CustomDayButton
                {...props}
                habit={currentHabit}
                selectedDate={value}
              />
            ),
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
});

HabitViewCalendar.displayName = 'HabitViewCalendar'; 