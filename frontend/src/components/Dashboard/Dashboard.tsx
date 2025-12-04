import { Chip } from '@mui/material';
import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Box, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import WarningIcon from '@mui/icons-material/Warning';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { wellAPI } from '../../services/api';

const Dashboard = () => {
  // Запрашиваем данные скважин из API
  const { data: wells, isLoading, error } = useQuery({
    queryKey: ['wells'],
    queryFn: () => wellAPI.getAll().then(res => res.data),
  });

  // Рассчитываем метрики из данных
  const activeWells = wells?.filter(w => w.status === 'active').length || 0;
  const totalFlowRate = wells?.reduce((sum, w) => sum + (w.measured_flow_rate || 0), 0) || 0;
  const avgFlowRate = wells?.length ? Math.round(totalFlowRate / wells.length) : 0;
  const anomalies = wells?.filter(w => w.status === 'emergency').length || 0;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Ошибка загрузки данных: {(error as Error).message}
      </Alert>
    );
  }

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
                    <Typography variant="h3">{activeWells}</Typography>
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
                    <Typography variant="h3">{avgFlowRate} м³/сут</Typography>
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
                    <Typography variant="h3">{anomalies}</Typography>
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
                    <Typography variant="h3">
                      {wells?.length ? `${Math.round((activeWells / wells.length) * 100)}%` : '0%'}
                    </Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>

       {/* Таблица скважин */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            📋 Список скважин
          </Typography>

          {wells && wells.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    {wells.map((well) => (
                      <motion.div
                        key={well.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          sx={{
                            minWidth: 200,
                            background: 'linear-gradient(135deg, #1a2c42 0%, #2d4a6e 100%)',
                            cursor: 'pointer'
                          }}
                          onClick={() => window.location.href = `/well/${well.id}`}
                        >
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              {well.well_number}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {well.field}
                            </Typography>
                            <Chip
                              label={well.status_display}
                              size="small"
                              color={
                                well.status === 'active' ? 'success' :
                                well.status === 'emergency' ? 'error' :
                                well.status === 'maintenance' ? 'warning' : 'default'
                              }
                              sx={{ mt: 1 }}
                            />
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Alert severity="info">
              В базе данных нет скважин. Добавьте скважины через админку Django.
            </Alert>
          )}
        </Box>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Загружено скважин: {wells?.length || 0} 🚀
      </Typography>
    </motion.div>
  );
};

export default Dashboard;