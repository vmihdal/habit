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
import { LoginCredentials } from '../types/auth.types';
import { useAuth } from '../contexts/AuthContext';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const Login: React.FC = () => {
  const { login, error, clearError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      clearError();
      await login(data);
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
              label="Email"
              type="email"
              variant="outlined"
              defaultValue={"test@test.com"}
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              defaultValue={"12345678"}
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
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
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}; 