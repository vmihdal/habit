import React from "react";
import { Button, TextField, Select, Divider, Box, Typography, Container, useTheme, useMediaQuery, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const StyledButton = styled(Button)({
  textTransform: "none",
  padding: "12px 16px",
  borderRadius: "10px",
  width: "100%"
});

export const HabitCreate = () => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const schema = yup.object().shape({
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      // await registerUser(data);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the AuthContext
    }
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
      <form onSubmit={handleSubmit(onSubmit)} style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        flexGrow: 1, // <- Optional: allows children to expand normally
      }}>
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
            <Typography variant={isMobile ? "h5" : "h6"} sx={{ fontWeight: 600, color: "rgba(2, 6, 24, 1)", mb: 1 }}>
              Нова звичка
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                placeholder="Назва"
                variant="outlined"
                sx={{
                  bgcolor: "rgb(154, 155, 157)",
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { border: "none" }
                  }
                }}
              />
            </Box>

            <Typography variant={isMobile ? "h5" : "h6"} sx={{ fontWeight: 600, color: "rgba(2, 6, 24, 1)", mb: 1 }}>
              Налаштування
            </Typography>

            {[
              { label: 'Тривалість', options: ['Місяць', 'Тиждень'], defaultValue: 'Місяць' },
              { label: 'Повторення', options: ['Щоденно', 'Щотижня'], defaultValue: 'Щоденно' },
              { label: 'Початок', options: ['Сьогодні', 'Завтра'], defaultValue: 'Сьогодні' },
              { label: 'Нагадування', options: ['19:30', '20:00'], defaultValue: '19:30' },
            ].map(({ label, options, defaultValue }, index) => (
              <Box key={label}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1,
                  }}
                >
                  <Typography color="text.secondary">
                    {label}
                  </Typography>
                  <Select
                    variant="standard"
                    defaultValue={defaultValue}
                    disableUnderline
                    sx={{
                      minWidth: 100,
                      textAlign: 'right',
                      fontSize: '0.95rem',
                    }}
                  >
                    {options.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select  >
                </Box>
                {/* Divider except after last item */}
                {index !== 3 && <Divider />}
              </Box>))}

            <Typography
              variant="body2"
              color="primary"
              sx={{ mt: 1, cursor: 'pointer' }}
            >
              + Додати ціль...
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <StyledButton
                variant="contained"
                sx={{
                  bgcolor: "#e0e3eb",
                  color: "#000",
                  "&:hover": {
                    bgcolor: "#d6d9e0",
                  }
                }}
                onClick={() => navigate('/dashboard')}
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
                  }
                }}
              >
                {isSubmitting ? 'Створюємо...' : 'Створити звичку'}
              </StyledButton>
            </Box>
          </Box>
        </Box>
      </form>
    </Container>
  );
}; 