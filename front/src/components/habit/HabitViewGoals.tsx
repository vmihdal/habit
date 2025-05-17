import React, { useEffect, useState, memo } from 'react';
import {
  Box,
  Checkbox,
  IconButton,
  Typography,
  Paper,
  Button,
  TextField
} from "@mui/material";
import { useAuth } from '../../contexts/AuthContext';
import { CreateGoalDto, GoalDto, HabitDto } from '../../types/habit.types';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useHabit } from '../../contexts/HabitContext';

interface FormData {
  name: string;
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
});

const API_URL = 'http://localhost:3001';

export const HabitViewGoals = memo(() => {
  const { currentHabit, updateHabit } = useHabit();
  const { token } = useAuth();

  useEffect(() => {

  }, []);

  if (!currentHabit) {
    return null;
  }

  if (!currentHabit.goals) {
    return null;
  }

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleGoalRemove = (goal: GoalDto) => {
    if (!currentHabit.goals) {
      return;
    }

    let goals = [...currentHabit.goals.filter((g: GoalDto) => g.id !== goal.id)];

    let request_data: CreateGoalDto[] = goals.map((goal: GoalDto) => ({ 
      name: goal.name, 
      completed: goal.completed 
    }));

    axios.patch(`${API_URL}/habits/${currentHabit.id}`, { goals: request_data }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then(response => {
      const data = response.data as HabitDto;
      updateHabit(currentHabit.id, { goals: data.goals });
    }).catch(message => {
      console.error(message);
    });
  }

  const handleGoalChange = ( event: React.ChangeEvent<HTMLInputElement>, goal: GoalDto) => {

    if (!currentHabit || !currentHabit.goals) return;

    goal.completed = event.target.checked;
    
    const updatedGoals = currentHabit.goals.map((g: GoalDto) => 
      g.id === goal.id ? goal : g
    );
    
    updateHabit(currentHabit.id, { goals: updatedGoals });
  };

  const onSubmit = async (data: FormData) => {
    let goals = [...currentHabit.goals ? currentHabit.goals.map((goal: GoalDto) => ({ 
      name: goal.name, 
      completed: goal.completed 
    })) : [], {
      name: data.name,
    } as CreateGoalDto];

    axios.patch(`${API_URL}/habits/${currentHabit.id}`, { goals }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then(response => {
      const data = response.data as HabitDto;
      updateHabit(currentHabit.id, { goals: data.goals });
      reset();
    }).catch(message => {
      setError('name', {
        type: 'manual',
        message
      });
    });
  };

  return (
    <Box>
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 500,
          mb: 1.5
        }}
      >
        Цілі
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {currentHabit.goals.map((goal: GoalDto) => (
          <Paper
            key={"goal" + "-" + currentHabit.id + "-" + goal.id}
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: 2,
            }}
          >
            <Checkbox
              checked={goal.completed}
              icon={<RadioButtonUncheckedIcon />}
              checkedIcon={<CheckCircleIcon sx={{ color: 'black' }} />}
              onClick={(e) => handleGoalChange(e, goal)}
              sx={{
                p: 0,
                mr: 1.5,
                width: 20,
                height: 20
              }}
            />
            <Typography
              sx={{
                flex: 1,
              }}
            >
              {goal.name}
            </Typography>
            <IconButton size="small" onClick={() => handleGoalRemove(goal)}>
              <ClearIcon  />
            </IconButton>
          </Paper>
        ))}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2
          }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField size="small" placeholder="Нова ціль" {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message} />
              <Button size="small" variant="text" type="submit"
                disabled={isSubmitting}>
                Додати
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
});

HabitViewGoals.displayName = 'HabitViewGoals'; 