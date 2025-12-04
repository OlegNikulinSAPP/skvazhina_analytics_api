import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Box, Card, CardContent } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import WarningIcon from '@mui/icons-material/Warning';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        📊 Панель управления
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={3}>
        {/* Карточка 1 */}
        <Box flex="1" minWidth="250px">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Card sx={{ background: 'linear-gradient(135deg, #1a2c42 0%, #2d4a6e 100%)' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <LocalGasStationIcon sx={{ fontSize: 40, color: '#00e5ff' }} />
                  <div>
                    <Typography variant="h6">Активные скважины</Typography>
                    <Typography variant="h3">24</Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        {/* Карточка 2 */}
        <Box flex="1" minWidth="250px">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Card sx={{ background: 'linear-gradient(135deg, #1a2c42 0%, #2d4a6e 100%)' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <TrendingUpIcon sx={{ fontSize: 40, color: '#4caf50' }} />
                  <div>
                    <Typography variant="h6">Средний дебит</Typography>
                    <Typography variant="h3">850 м³/сут</Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        {/* Карточка 3 */}
        <Box flex="1" minWidth="250px">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Card sx={{ background: 'linear-gradient(135deg, #1a2c42 0%, #2d4a6e 100%)' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <WarningIcon sx={{ fontSize: 40, color: '#ff6b6b' }} />
                  <div>
                    <Typography variant="h6">Аномалии</Typography>
                    <Typography variant="h3">3</Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        {/* Карточка 4 */}
        <Box flex="1" minWidth="250px">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Card sx={{ background: 'linear-gradient(135deg, #1a2c42 0%, #2d4a6e 100%)' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <AnalyticsIcon sx={{ fontSize: 40, color: '#ffeb3b' }} />
                  <div>
                    <Typography variant="h6">Эффективность</Typography>
                    <Typography variant="h3">94%</Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Крутейший фронтенд готов! 🚀
      </Typography>
    </motion.div>
  );
};

export default Dashboard;