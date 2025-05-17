import React, { useEffect, useState, memo } from 'react';
import {
  Box,
  Checkbox,
  IconButton,
  Typography,
  Paper,
  Button,
  TextField,
  Collapse
} from "@mui/material";
import { GoalDto } from '../../types/habit.types';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Add as AddIcon } from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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

export const HabitViewGoals = memo(() => {
  const { currentHabit, updateHabit } = useHabit();
  const [showGoalForm, setGoalShowForm] = useState(false);

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
    if (!currentHabit || !currentHabit.goals) return;
    let updatedGoals = currentHabit.goals.filter((g: GoalDto) => g.id !== goal.id);
    updateHabit(currentHabit.id, { goals: updatedGoals });
  }

  const handleGoalChange = ( event: React.ChangeEvent<HTMLInputElement>, goal: GoalDto) => {

    if (!currentHabit || !currentHabit.goals) return;
    goal.completed = event.target.checked;
    const updatedGoals = currentHabit.goals.map((g: GoalDto) => 
      g.id === goal.id ? goal : g
    );
    updateHabit(currentHabit.id, { goals: updatedGoals })
  };

  const onSubmit = async (data: FormData) => {
    let new_goal = {
      name: data.name
    } as GoalDto;
    let goals: GoalDto[] = currentHabit.goals ? [ ... currentHabit.goals, new_goal ] : [new_goal];
    updateHabit(currentHabit.id, { goals: goals })
    .then( _ => {
      reset()
      setGoalShowForm(false)
    })
    .catch(message => {
      setError('name', {
        type: 'manual',
        message
      });
    })
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2
      }}>
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 500,
          mb: 1.5
        }}
      >
        Цілі
      </Typography>
      {!showGoalForm &&
        <Box><IconButton title = "Додати ціль" onClick={() => setGoalShowForm(true)}><AddIcon/> </IconButton>
      </Box>
        }
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {currentHabit.goals.map((goal: GoalDto, index) => (
          <Paper
            key={"goal" + "-" + currentHabit.id + "-" + index}
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
            <IconButton size="small" title = "Видалити ціль" onClick={() => handleGoalRemove(goal)}>
              <ClearIcon  />
            </IconButton>
          </Paper>
        ))}
        <Collapse in={showGoalForm}>
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
              <Button size="small" variant="text" type="submit"
                disabled={isSubmitting} onClick={() => setGoalShowForm(false)}>
                Відмінити
              </Button>
            </Box>
          </form>
        </Paper>
        </Collapse>
      </Box>
    </Box>
  );
});

HabitViewGoals.displayName = 'HabitViewGoals'; 