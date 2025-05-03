import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { Box, Container } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Dayjs } from 'dayjs';
import { Button } from '@mui/material';
import 'dayjs/locale/uk';

function CustomDayButton(props: any) {
  const { day, selectedDate, ...other } = props;

  return (
    <PickersDay
      {...other}
      day={day}
      selected={false}
      sx={{
        border: 1,
        minWidth: 0,
        padding: 0,
        borderStyle: 'dashed',
        // borderColor: isActive ? 'black' : 'grey.400',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // color: isActive ? isDone ? 'white' : 'black' : 'grey.400',
        // backgroundColor: isDone ? 'rgb(0, 0, 0)' : 'white',
        // fillColor: isDone ? 'black' : 'white',
      }}
    >
    </PickersDay>
  );
}

export const HabitViewCalendar: React.FC = () => {
  const { token } = useAuth();
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {

  }, []);

  return (
    <Container maxWidth="md">
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
        <DateCalendar
          value={value}
          // onChange={(newValue) => setValue(newValue)}
          slots={{
            day: CustomDayButton,
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