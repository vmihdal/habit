import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Home } from './components/Home';
import { HabitHome } from './components/HabitHome';
import { HabitLogin } from './components/HabitLogin';
import { HabitRegister } from './components/HabitRegister';
import { HabitProfile } from './components/dashboard/HabitProfile';
import { HabitCreate } from './components/HabitCreate';
import { Playground } from './components/Playground';
import { ConfirmProvider } from './components/common/Confirmation';

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "black",
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          },
        },
      },
    },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  return !token ? <>{children}</> : <Navigate to="/" />;
};

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
              <HabitHome/>
          }
        />
        <Route
          path="/register"
          element={
              <HabitRegister/>
          }
        />
        <Route
          path="/login"
          element={
              <HabitLogin/>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
               <ConfirmProvider>
              <HabitProfile />
               </ConfirmProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-habit"
          element={
            <ProtectedRoute>
              <HabitCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/playground"
          element={
            <ConfirmProvider>
              <Playground />
            </ConfirmProvider>
          }
        />
      </Routes>
    </>
  );
};

// const App = () => {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Router>
//         <AuthProvider>
//           <AppRoutes />
//         </AuthProvider>
//       </Router>
//     </ThemeProvider>
//   );
// };

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
