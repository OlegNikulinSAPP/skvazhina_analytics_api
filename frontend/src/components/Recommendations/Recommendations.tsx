import React from 'react';
import { motion } from 'framer-motion';
import {
  Typography, Box, Card, CardContent, Chip,
  Button, Alert, List, ListItemIcon
} from '@mui/material';
import {
  TrendingUp, Warning, Build,
  CheckCircle, Schedule, PriorityHigh
} from '@mui/icons-material';

const Recommendations = () => {
  // Тестовые данные рекомендаций
  const recommendations = [
    {
      id: 1,
      well: 'СКВ-001',
      type: 'optimization',
      title: 'Оптимизация режима работы',
      description: 'Рекомендуется увеличить давление на 15% для повышения дебита',
      priority: 'high',
      economicEffect: '+850 тыс. руб/мес',
      status: 'pending'
    },
    {
      id: 2,
      well: 'СКВ-003',
      type: 'maintenance',
      title: 'Плановое обслуживание',
      description: 'Требуется замена фильтра согласно регламенту',
      priority: 'medium',
      economicEffect: 'Предотвращение простоя: 1.2 млн руб',
      status: 'accepted'
    },
    {
      id: 3,
      well: 'СКВ-007',
      type: 'emergency',
      title: 'Аварийная ситуация',
      description: 'Обнаружена утечка в трубопроводе',
      priority: 'critical',
      economicEffect: 'Срочный ремонт предотвратит убытки: 3.5 млн руб',
      status: 'pending'
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <TrendingUp />;
      case 'maintenance': return <Build />;
      case 'emergency': return <Warning />;
      default: return <PriorityHigh />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        💡 Панель рекомендаций
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Система аналитики сгенерировала {recommendations.length} рекомендации для оптимизации работы скважин
      </Alert>

      <Box display="flex" flexWrap="wrap" gap={3}>
        {/* Карточка статистики */}
        <Box flex="1" minWidth="300px">
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card sx={{ background: 'linear-gradient(135deg, #1a2c42 0%, #2d4a6e 100%)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📈 Эффект от рекомендаций
                </Typography>
                <Typography variant="h3" sx={{ my: 2 }}>
                  5.2 млн руб/мес
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Потенциальная экономия при реализации всех рекомендаций
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        {/* Карточка приоритетов */}
        <Box flex="1" minWidth="300px">
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card sx={{ background: 'linear-gradient(135deg, #1a2c42 0%, #2d4a6e 100%)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ⚡ Приоритеты
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap" sx={{ mt: 2 }}>
                  <Chip label="1 критическая" color="error" size="small" />
                  <Chip label="1 высокая" color="warning" size="small" />
                  <Chip label="1 средняя" color="info" size="small" />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>

      {/* Список рекомендаций */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Список рекомендаций
      </Typography>

      <List>
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={2}>
                    <ListItemIcon>
                      {getTypeIcon(rec.type)}
                    </ListItemIcon>
                    <Box>
                      <Typography variant="h6">
                        {rec.well} - {rec.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {rec.description}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2}>
                    <Chip
                      label={rec.priority === 'critical' ? 'Критическая' :
                             rec.priority === 'high' ? 'Высокая' : 'Средняя'}
                      color={getPriorityColor(rec.priority)}
                    />

                    <Box textAlign="right">
                      <Typography variant="body2" color="text.secondary">
                        Экономический эффект
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {rec.economicEffect}
                      </Typography>
                    </Box>

                    <Button
                      variant={rec.status === 'accepted' ? 'contained' : 'outlined'}
                      color={rec.status === 'accepted' ? 'success' : 'primary'}
                      startIcon={rec.status === 'accepted' ? <CheckCircle /> : <Schedule />}
                    >
                      {rec.status === 'accepted' ? 'Принята' : 'Рассмотреть'}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </List>
    </motion.div>
  );
};

export default Recommendations;