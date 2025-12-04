// frontend/src/services/api.ts
import axios from 'axios';

// Конфигурация API
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  mockExternalURL: process.env.REACT_APP_MOCK_EXTERNAL_URL || 'http://localhost:8000/mock-external',
  timeout: 30000,
};

// Создаем клиент для ОСНОВНОГО API (наш Django)
export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL + '/api',
  timeout: API_CONFIG.timeout,
});

// Создаем клиент для МОК внешнего API
export const mockExternalApiClient = axios.create({
  baseURL: API_CONFIG.mockExternalURL,
  timeout: API_CONFIG.timeout,
});

// Перехватчик для логирования запросов
mockExternalApiClient.interceptors.request.use(
  config => {
    console.log(`[Mock API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('[Mock API Request Error]', error);
    return Promise.reject(error);
  }
);

// Перехватчик для обработки ошибок
mockExternalApiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('[Mock API Response Error]', error.response?.status, error.message);
    return Promise.reject(error);
  }
);