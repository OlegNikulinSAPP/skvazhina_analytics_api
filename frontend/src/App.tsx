import React from 'react';
import { motion } from 'framer-motion';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Box,
  Button
} from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import WellDetail from './components/WellDetail/WellDetail';
import Recommendations from './components/Recommendations/Recommendations';
import Login from './components/Login/Login';
import { authService } from './services/authService';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Крутая темная тема для нефтегазовой аналитики
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e5ff',
    },
    secondary: {
      main: '#ff6b6b',
    },
    background: {
      default: '#0a1929',
      paper: '#1a2c42',
    },
  },
});

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Container maxWidth="xl">
              <Box sx={{ my: 4 }}>
                <motion.div
                  initial={{ y: -50 }}
                  animate={{ y: 0 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                >
                  <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    sx={{
                      background: 'linear-gradient(45deg, #00e5ff, #2979ff)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 'bold'
                    }}
                  >
                    🛢️ СКВАЖИНА-Аналитика
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                    <Button
                      component={Link}
                      to="/"
                      variant="outlined"
                      startIcon={<span>📊</span>}
                      sx={{ borderRadius: 2 }}
                    >
                      Панель управления
                    </Button>

                    <Button
                      component={Link}
                      to="/recommendations"
                      variant="outlined"
                      startIcon={<span>💡</span>}
                      sx={{ borderRadius: 2 }}
                    >
                      Рекомендации
                    </Button>

                    <Button
                      component={Link}
                      to="/logout"
                      variant="outlined"
                      startIcon={<span>🚪</span>}
                      sx={{ borderRadius: 2 }}
                      onClick={() => {
                        authService.logout();
                        window.location.href = '/';
                      }}
                    >
                      Выйти
                    </Button>
                  </Box>
                </motion.div>

                <Routes>
                  <Route path="/login" element={<Login />} />

                  <Route path="/" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />

                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />

                  <Route path="/well/:id" element={
                    <ProtectedRoute>
                      <WellDetail />
                    </ProtectedRoute>
                  } />

                  <Route path="/recommendations" element={
                    <ProtectedRoute>
                      <Recommendations />
                    </ProtectedRoute>
                  } />
                </Routes>
              </Box>
            </Container>
          </motion.div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;