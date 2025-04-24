import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import { RegisterCredentials } from '../types/auth.types';
import { useAuth } from '../contexts/AuthContext';

const schema = yup.object().shape({
  name: yup.string(),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export const Register: React.FC = () => {
  const { register: registerUser, error, clearError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterCredentials>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterCredentials) => {
    try {
      clearError();
      await registerUser(data);
    } catch (err) {
      // Error is handled by the AuthContext
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name (Optional)"
              variant="outlined"
              {...register('name')}
              defaultValue={"Test Account"}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              label="Email"
              type="email"
              variant="outlined"
              {...register('email')}
              defaultValue={"test@test.com"}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              {...register('password')}
              defaultValue={"12345678"}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              {...register('confirmPassword')}
              defaultValue={"12345678"}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ mt: 2 }}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}; 