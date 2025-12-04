import React from 'react';
import { motion } from 'framer-motion';
import { ThemeProvider, createTheme, CssBaseline, Container, Typography, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';

// Крутая темная тема для нефтегазовой аналитики
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e5ff', // Неоново-синий для нефтегазовой тематики
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

function App() {
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

                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
              </Box>
            </Container>
          </motion.div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
