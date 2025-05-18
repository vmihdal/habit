import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Select,
  Divider,
  Box,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
  MenuItem,
  Alert,
  Paper,
  Collapse,
  Grid,
  List,
  ListItem,
  Checkbox,
  IconButton
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { ValidationError } from "yup";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import 'dayjs/locale/uk';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek'
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { CreateGoalDto, GoalDto, HabitFrequency } from "../types/habit.types";
import { PickersDay, pickersDayClasses } from '@mui/x-date-pickers/PickersDay';
import { Add, RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import ClearIcon from '@mui/icons-material/Clear';

dayjs.extend(isoWeek)

const DayOfWeek = {
  Monday: { date: dayjs().startOf('isoWeek').add(0, 'day'), selected: true },
  Tuesday: { date: dayjs().startOf('isoWeek').add(1, 'day'), selected: true },
  Wednesday: { date: dayjs().startOf('isoWeek').add(2, 'day'), selected: true },
  Thursday: { date: dayjs().startOf('isoWeek').add(3, 'day'), selected: true },
  Friday: { date: dayjs().startOf('isoWeek').add(4, 'day'), selected: true },
  Saturday: { date: dayjs().startOf('isoWeek').add(5, 'day'), selected: true },
  Sunday: { date: dayjs().startOf('isoWeek').add(6, 'day'), selected: true }
} as const;

const API_URL = 'http://localhost:3001';

const StyledButton = styled(Button)({
  textTransform: "none",
  padding: "12px 16px",
  borderRadius: "10px",
  width: "100%",
});

interface FormData {
  name: string;
  goals: Array<CreateGoalDto>;
}

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Обов'язкове поле")
    .min(2, "Назва повинна містити щонайменше 2 символи")
    .max(50, "Назва не може перевищувати 50 символів")
    .matches(
      /^[а-яА-ЯґҐєЄіІїЇ\s\d]+$/,
      "Назва повинна містити тільки українські літери, цифри та пробіли"
    ),
  goals: yup.array().of(
    yup.object().shape({
      name: yup
        .string()
        .required("Обов'язкове поле")
        .min(2, "Назва повинна містити щонайменше 2 символи")
        .max(50, "Назва не може перевищувати 50 символів")
        .matches(
          /^[а-яА-ЯґҐєЄіІїЇ\s\d]+$/,
          "Назва повинна містити тільки українські літери, цифри та пробіли"
        ),
      completed: yup.boolean().required()
    }).required()
  ).required()
}) as yup.ObjectSchema<FormData>;

interface CustomDayButtonProps {
  day: Dayjs;
  selectedDate: Dayjs;
  startDate: Dayjs;
  endDate: Dayjs;
  selectedDays: Map<Dayjs, void>;
  onDaySelect: (date: Dayjs) => void;
  outsideCurrentMonth: boolean;
  isFirstVisibleCell: boolean;
  isLastVisibleCell: boolean;
}

const CustomDayButton = ({ day, startDate, endDate, onDaySelect, outsideCurrentMonth, isFirstVisibleCell, isLastVisibleCell, selectedDays }: CustomDayButtonProps) => {
  const active = day >= startDate && day <= endDate;
  const selected = active && selectedDays.has(day);
  return (
    <PickersDay
      day={day}
      selected={selected}
      disabled={!active}
      // onClick={handleDayClick}
      onDaySelect={() => {
        onDaySelect(day)
      }}
      outsideCurrentMonth={outsideCurrentMonth}
      isFirstVisibleCell={isFirstVisibleCell}
      isLastVisibleCell={isLastVisibleCell}
      sx={{
        border: 1,
        minWidth: 0,
        padding: 0,
        borderStyle: 'dashed',
        borderColor: active ? 'black' : 'grey.400',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fillColor: selected ? 'black' : 'white',
        [`&&.${pickersDayClasses.selected}`]: {
          background: selected ? 'rgb(0, 0, 0)' : 'white',
          color: active ? selected ? 'white' : 'black' : 'grey.400',
        },
        [`&&.${pickersDayClasses.root}:hover`]: {
          background: 'rgba(0, 0, 0, 0.1)',
        }
      }}
    >
    </PickersDay>
  );
};

CustomDayButton.displayName = 'CustomDayButton';

export const HabitCreate = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs>(startDate.add(1, "month"));

  const [frequency, setFrequency] = useState<HabitFrequency>(HabitFrequency.DAILY);
  const [selectedDates, setSelectedDates] = useState(new Map<Dayjs, void>());
  const [selectedDays, setSelectedDays] = useState(DayOfWeek);

  const { handleSubmit, register, formState: { errors, isSubmitting }, setValue, watch } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      goals: []
    }
  });

  const goals = watch('goals') || [];

  const addGoal = () => {
    const currentGoals = watch('goals') || [];
    setValue('goals', [...currentGoals, { name: '', completed: false }]);
  };

  const onSubmit = async (data: FormData) => {
    // try {
    //   setError(null);

    //   const habitData = {
    //     name: data.name,
    //     frequency: frequency.toUpperCase(),
    //     startDate: new Date(),
    //     reminder: new Date(`2000-01-01T${reminder}:00`),
    //     targetDays: duration === "month" ? 30 : 7,
    //     color: "#FF5733", // Default color
    //   };

    //   await axios.post(`${API_URL}/habits`, habitData, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //     },
    //   });

    //   navigate("/dashboard");
    // } catch (err) {
    //   if (axios.isAxiosError(err)) {
    //     if (err.response) {
    //       setError(err.response.data.message || "Помилка при створенні звички");
    //     }
    //   } else {
    //     setError("Невідома помилка");
    //   }
    //   console.error("Error creating habit:", err);
    // }
  };

  return (
    <Paper sx={{ p: 2, m: 0 }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            width: "100%",
            // maxWidth: { xs: "342px", sm: "450px" },
            mx: "auto",
            mt: isMobile ? "80px" : 0,
            p: { xs: 2, sm: 4 },
          }}
        >
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Box sx={{ mb: 4, alignContent: "center" }}>
            <Typography
              variant={isMobile ? "h5" : "h6"}
              sx={{ fontWeight: 600, color: "rgba(2, 6, 24, 1)", mb: 1 }}
            >
              Нова звичка
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                placeholder="Назва"
                variant="outlined"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                inputProps={{
                  maxLength: 50,
                }}
                sx={{
                  bgcolor: "rgb(154, 155, 157)",
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { border: "none" },
                  },
                }}
              />
            </Box>

            <Typography
              variant={isMobile ? "h5" : "h6"}
              sx={{ fontWeight: 600, color: "rgba(2, 6, 24, 1)", mb: 1 }}
            >
              Налаштування
            </Typography>

            <Box key="duration">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  gap: 1,
                  py: 1,
                }}
              >
                <Typography color="text.secondary">Тривалість</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
                  <DatePicker
                    label="Початок"
                    value={startDate}
                    onChange={(newValue) => {
                      setStartDate(newValue)

                      setSelectedDates((prev) => {
                        return new Map(
                          [...prev.entries()]
                            .filter(([e, item]) => e >= startDate)
                        )
                      })
                    }}
                  />
                  <DatePicker
                    label="Кінець"
                    value={endDate}
                    onChange={(newValue) => {
                      setEndDate(newValue)
                      setSelectedDates((prev) => {
                        return new Map(
                          [...prev.entries()]
                            .filter(([e, item]) => e <= endDate)
                        )
                      })
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </Box>
            <Divider />

            <Box key="frequency">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 1
                }}
              >
                <Typography color="text.secondary">Частота виконання</Typography>
                <Select
                  variant="standard"
                  value={frequency}
                  onChange={(e) => {
                    setFrequency(e.target.value)
                  }}
                  disableUnderline
                  sx={{
                    minWidth: 100,
                    textAlign: "right",
                    fontSize: "0.95rem",
                  }}
                >
                  <MenuItem value={HabitFrequency.DAILY}>По днях</MenuItem>
                  <MenuItem value={HabitFrequency.CUSTOM}>Вказати дні


                  </MenuItem>
                </Select>

              </Box>
              <Collapse in={frequency == HabitFrequency.CUSTOM}>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
                    <DateCalendar
                      slots={{
                        day: (props) => (
                          <CustomDayButton
                            {...props}
                            startDate={startDate}
                            endDate={endDate}
                            selectedDays={selectedDates}
                            onDaySelect={(day) => {
                              if (selectedDates.has(day)) {
                                setSelectedDates((prev) => {
                                  return new Map(
                                    [...prev.entries()]
                                      .filter(([e, item]) => e != day)
                                  )
                                })
                              } else {
                                setSelectedDates((prev) => {
                                  return new Map(
                                    [...prev.entries()]
                                  ).set(day)
                                })
                              }
                            }}
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
                            minHeight: '300px',
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
                </Box>
              </Collapse>
              <Collapse in={frequency == HabitFrequency.DAILY}>
                <Grid container spacing={1}>
                  {Object.entries(selectedDays).map(([key, value]) => {
                    return <Button
                      key={key}
                      onClick={() => {
                        setSelectedDays((prev) => {
                          const newState = { ...prev, [key]: { ...value, selected: !value.selected } };
                          return newState;
                        })
                      }}
                      sx={{
                        width: 40,
                        height: 40,
                        border: 1,
                        minWidth: 0,
                        padding: 0,
                        borderStyle: 'dashed',
                        borderColor: value.selected ? 'black' : 'grey.400',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: value.selected ? 'white' : 'black',
                        backgroundColor: value.selected ? 'rgb(0, 0, 0)' : 'white',
                        fillColor: value.selected ? 'black' : 'white',
                      }}
                    >
                      <Typography variant="body2">
                        {value.date.toDate().toLocaleDateString('uk-UA', { weekday: 'short' })}
                      </Typography>
                    </Button>
                  })}

                </Grid>
              </Collapse>
              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant={isMobile ? "h5" : "h6"}
                  sx={{ fontWeight: 600, color: "rgba(2, 6, 24, 1)", mb: 1 }}
                >
                  Цілі
                </Typography>
                <IconButton
                  onClick={addGoal}
                >
                  <Add />
                </IconButton>
              </Box>

              <Box>
                <List>
                  {goals.map((goal, index) => {
                    return (
                      <ListItem key={`item-goal-${index}`} sx={{ padding: 0 }}>
                        <Checkbox
                          icon={<RadioButtonUnchecked />}
                          checkedIcon={<RadioButtonChecked />}
                          disabled
                        />
                        <TextField
                          key={`goal-${index}`}
                          fullWidth
                          variant="standard"
                          slotProps={{ input: { disableUnderline: true } }}
                          placeholder={goal.name || "Введіть текст..."}
                          error={!!errors.goals?.[index]?.name}
                          helperText={errors.goals?.[index]?.name?.message}
                          {...register(`goals.${index}.name`)}
                        />
                        <IconButton key={`button-goal-${index}`} size="small" title="Видалити ціль" onClick={() => {
                          const currentGoals = watch('goals') || [];
                          setValue('goals', currentGoals.filter((_, i) => i !== index));
                        }}>
                          <ClearIcon />
                        </IconButton>
                      </ListItem>)
                  })}
                </List>
              </Box>


            </Box>


            <Box sx={{ flexGrow: 1 }} />

            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", gap: 2 }}>
              <StyledButton
                variant="contained"
                sx={{
                  bgcolor: "#e0e3eb",
                  color: "#000",
                  "&:hover": {
                    bgcolor: "#d6d9e0",
                  },
                }}
                onClick={() => navigate("/dashboard")}
              >
                Скасувати
              </StyledButton>
              <StyledButton
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                sx={{
                  bgcolor: "rgba(2, 6, 24, 1)",
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(2, 6, 24, 0.9)",
                  },
                }}
              >
                {isSubmitting ? "Створюємо..." : "Створити звичку"}
              </StyledButton>
            </Box>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};
