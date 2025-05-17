import React, { useState } from "react";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const API_URL = 'http://localhost:3001';

const StyledButton = styled(Button)({
  textTransform: "none",
  padding: "12px 16px",
  borderRadius: "10px",
  width: "100%",
});

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

export const HabitCreate = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const [duration, setDuration] = useState("month");
  const [frequency, setFrequency] = useState("daily");
  const [startDate, setStartDate] = useState("today");
  const [reminder, setReminder] = useState("19:30");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);

      const habitData = {
        name: data.name,
        frequency: frequency.toUpperCase(),
        startDate: new Date(),
        reminder: new Date(`2000-01-01T${reminder}:00`),
        targetDays: duration === "month" ? 30 : 7,
        color: "#FF5733", // Default color
      };

      await axios.post(`${API_URL}/habits`, habitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data.message || "Помилка при створенні звички");
        }
      } else {
        setError("Невідома помилка");
      }
      console.error("Error creating habit:", err);
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
        position: "relative",
      }}
    >
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
            maxWidth: { xs: "342px", sm: "450px" },
            mx: "auto",
            mt: isMobile ? "80px" : 0,
            p: { xs: 2, sm: 4 },
          }}
        >
          {/* {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )} */}
           {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
          )}

          <Box sx={{ mb: 4 }}>
            <img
              width={isMobile ? "150" : "200"}
              height={isMobile ? "43.24" : "57.65"}
              alt="Logo"
              src="/frame-13838-2.svg"
              style={{ marginBottom: "2rem" }}
            />
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

            {[
              {
                label: "Тривалість",
                value: duration,
                setValue: setDuration,
                options: [
                  { value: "month", label: "Місяць" },
                  { value: "week", label: "Тиждень" },
                ],
              },
              {
                label: "Повторення",
                value: frequency,
                setValue: setFrequency,
                options: [
                  { value: "daily", label: "Щоденно" },
                  { value: "weekly", label: "Щотижня" },
                  { value: "monthly", label: "Щомісяця" },
                  { value: "custom", label: "Користувацька" },
                ],
              },
              {
                label: "Початок",
                value: startDate,
                setValue: setStartDate,
                options: [
                  { value: "today", label: "Сьогодні" },
                  { value: "tomorrow", label: "Завтра" },
                ],
              },
              {
                label: "Нагадування",
                value: reminder,
                setValue: setReminder,
                options: [
                  { value: "19:30", label: "19:30" },
                  { value: "20:00", label: "20:00" },
                ],
              },
            ].map(({ label, value, setValue, options }, index) => (
              <Box key={label}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 1,
                  }}
                >
                  <Typography color="text.secondary">{label}</Typography>
                  <Select
                    variant="standard"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disableUnderline
                    sx={{
                      minWidth: 100,
                      textAlign: "right",
                      fontSize: "0.95rem",
                    }}
                  >
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                {index !== 3 && <Divider />}
              </Box>
            ))}

            <Typography
              variant="body2"
              color="primary"
              sx={{ mt: 1, cursor: "pointer" }}
            >
              + Додати ціль...
            </Typography>

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
    </Container>
  );
};
