import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Typography, Box, Divider, Chip,
  CircularProgress, Alert, Card, CardContent
} from '@mui/material';
import {
  LocationOn, Straighten, Speed, Thermostat,
  AccessTime, Warning, CheckCircle
} from '@mui/icons-material';
import { wellAPI } from '../../services/api';

const WellDetail = () => {
  const { id } = useParams<{ id: string }>();
  const wellId = parseInt(id || '0');

  const { data: well, isLoading, error } = useQuery({
    queryKey: ['well', wellId],
    queryFn: () => wellAPI.getById(wellId).then(res => res.data),
    enabled: !!wellId,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !well) {
    return (
      <Alert severity="error">
        Ошибка загрузки данных скважины: {(error as Error)?.message || 'Скважина не найдена'}
      </Alert>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'maintenance': return 'warning';
      case 'emergency': return 'error';
      default: return 'default';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          🛢️ Скважина {well.well_number}
        </Typography>

        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
          <Chip
            label={well.status_display}
            color={getStatusColor(well.status)}
            icon={well.status === 'active' ? <CheckCircle /> : <Warning />}
          />
          <Typography variant="h6" color="text.secondary">
            {well.field}
          </Typography>
        </Box>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={3}>
        {/* Левая колонка - Основная информация */}
        <Box flex="1" minWidth="300px">
          <motion.div whileHover={{ scale: 1.01 }}>
            <Card sx={{ mb: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  📍 Географические данные
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                  <LocationOn color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Координаты
                    </Typography>
                    <Typography variant="body1">
                      {Number(well.latitude).toFixed(6)}° N, {Number(well.longitude).toFixed(6)}° E
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Straighten color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Глубина
                    </Typography>
                    <Typography variant="body1">
                      {well.depth} м
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        {/* Правая колонка - Телеметрия */}
        <Box flex="1" minWidth="300px">
          <motion.div whileHover={{ scale: 1.01 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  📊 Телеметрия в реальном времени
                </Typography>
                <Divider sx={{ my: 2 }} />

                {well.current_pressure && (
                  <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                    <Speed sx={{ color: '#00e5ff' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Давление
                      </Typography>
                      <Typography variant="h6">
                        {well.current_pressure} атм
                      </Typography>
                    </Box>
                  </Box>
                )}

                {well.measured_flow_rate && (
                  <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                    <Speed sx={{ color: '#4caf50' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Дебит
                      </Typography>
                      <Typography variant="h6">
                        {well.measured_flow_rate} м³/сут
                      </Typography>
                    </Box>
                  </Box>
                )}

                {well.temperature && (
                  <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                    <Thermostat sx={{ color: '#ff6b6b' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Температура пласта
                      </Typography>
                      <Typography variant="h6">
                        {well.temperature} °C
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Box display="flex" alignItems="center" gap={2} sx={{ mt: 3 }}>
                  <AccessTime color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Последнее обновление
                    </Typography>
                    <Typography variant="body1">
                      {new Date(well.last_data_update).toLocaleString('ru-RU')}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );
};

export default WellDetail;