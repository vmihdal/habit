import React, { useState, useEffect } from "react";
import { Button, TextField, Divider, Box, Typography, Container, useTheme, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const StyledButton = styled(Button)({
  textTransform: "none",
  padding: "12px 16px",
  borderRadius: "10px",
  width: "100%"
});

const SocialButton = styled(StyledButton)({
  backgroundColor: "rgba(226, 232, 240, 1)",
  color: "rgba(2, 6, 24, 1)",
  justifyContent: "flex-start",
  gap: "24px",
  "&:hover": {
    backgroundColor: "rgba(226, 232, 240, 0.9)",
  }
});

const schema = yup.object().shape({
  name: yup.string(),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const HabitRegister: React.FC = () => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { register: registerUser, error, clearError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [registerStatus, setRegisterStatus] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    if (registerStatus) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/login');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [registerStatus, navigate]);

  const onSubmit = async (data: any) => {
    try {
      clearError();
      let result = await registerUser(data);
      setRegisterStatus(result);
    } catch (err) {
      // Error is handled by the AuthContext
    }
  };

  const socialLoginOptions = [
    {
      name: "Зареєструватися з Google",
      icon: "/logos-google-icon.svg",
      iconWidth: "16px",
      iconHeight: "16px",
    },
    {
      name: "Зареєструватися з Apple",
      icon: "/ant-design-apple-filled.svg",
      iconWidth: "24px",
      iconHeight: "24px",
    },
  ];

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        bgcolor: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 0,
        position: "relative"
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Main content container */}
        <Box sx={{
          width: "100%",
          maxWidth: { xs: "342px", sm: "450px" },
          mx: "auto",
          mt: isMobile ? "80px" : 0,
          p: { xs: 2, sm: 4 }
        }}>
          <Box sx={{ mb: 4 }}>
            <img
              width={isMobile ? "150" : "200"}
              height={isMobile ? "43.24" : "57.65"}
              alt="Logo"
              src="/frame-13838-2.svg"
              style={{ marginBottom: "2rem" }}
            />
            <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600, color: "rgba(2, 6, 24, 1)", mb: 1 }}>
              Зареєструватися
            </Typography>
            <Typography sx={{ color: "rgba(69, 85, 108, 1)", fontSize: isMobile ? "14px" : "16px" }}>
              Якщо у вас вже є обліковий запис, ви можете{" "}
              <Box component="span" sx={{ fontWeight: 600, cursor: "pointer" }} onClick={handleLoginClick}>
                увійти у свій обліковий запис
              </Box>
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                placeholder="Ім'я"
                variant="outlined"
                {...register('name')}
                defaultValue={"Test Account"}
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{
                  bgcolor: "rgba(229, 231, 235, 1)",
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { border: "none" }
                  }
                }}
              />
              <TextField
                fullWidth
                placeholder="Email"
                variant="outlined"
                {...register('email')}
                defaultValue={"test@test.com"}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  bgcolor: "rgba(229, 231, 235, 1)",
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { border: "none" }
                  }
                }}
              />
              <TextField
                fullWidth
                type="password"
                placeholder="Пароль"
                variant="outlined"
                {...register('password')}
                defaultValue={"12345678"}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{
                  bgcolor: "rgba(229, 231, 235, 1)",
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { border: "none" }
                  }
                }}
              />
            </Box>

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            {registerStatus && (
              <Typography color="success" variant="body2">
                Реєстрація пройшла успішно. Ви будете перенаправлені на сторінку входу через {countdown} секунд ...
              </Typography>
            )}

            <StyledButton
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              sx={{
                bgcolor: "rgba(2, 6, 24, 1)",
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(2, 6, 24, 0.9)",
                }
              }}
            >
              Створити обліковий запис
            </StyledButton>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography sx={{ color: "rgba(2, 6, 24, 1)", fontSize: isMobile ? "14px" : "16px", fontFamily: "Rubik" }}>
                АБО
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {socialLoginOptions.map((option, index) => (
                <SocialButton
                  key={index}
                  variant="contained"
                  sx={{
                    fontSize: isMobile ? "14px" : "16px",
                    padding: isMobile ? "12px 16px" : "14px 20px"
                  }}
                >
                  <img
                    width={option.iconWidth}
                    height={option.iconHeight}
                    alt={option.name}
                    src={option.icon}
                  />
                  <Typography sx={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: isMobile ? "14px" : "16px"
                  }}>
                    {option.name}
                  </Typography>
                </SocialButton>
              ))}
            </Box>
          </Box>
        </Box>
      </form>
    </Container>
  );
}; 