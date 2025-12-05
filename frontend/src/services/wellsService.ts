// frontend/src/services/wellsService.ts
import { apiClient, mockExternalApiClient } from './api';
import { authService } from './authService';

// Типы данных (соответствуют mock API)
export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WellData {
  well_id: string;
  temperature: number;
  flow_rate: number;
  pressure: number;
  coordinates: Coordinates;
  depth: number;
  status: 'active' | 'inactive' | 'maintenance';
  last_updated?: string;
  installation_date?: string;
  field_name?: string;
  operator?: string;
  last_maintenance?: string;
}

export interface TelemetryData {
  well_id: string;
  parameters: string[];
  units: Record<string, string>;
  telemetry: {
    timestamps: number[];
    temperature: number[];
    pressure: number[];
    flow_rate: number[];
  };
  period_hours: number;
  points: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface WellsListResponse {
  wells: WellData[];
  count: number;
  timestamp: string;
  api_version: string;
}

// Сервис для работы с внешним API (mock или реальное)
export class ExternalWellService {
  // Использовать ли mock API (true = использовать наш mock, false = реальный API)
  private useMock: boolean = true;

  // Получить список скважин из НАШЕГО API (защищенный)
  async getWellsFromOurApi(): Promise<WellData[]> {
    try {
      const response = await apiClient.get('/wells/', {
        headers: authService.getAuthHeader()
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Токен истек, пробуем обновить
        await authService.refreshAccessToken();
        // Повторяем запрос с новым токеном
        const retryResponse = await apiClient.get('/wells/', {
          headers: authService.getAuthHeader()
        });
        return retryResponse.data;
      }
      throw error;
    }
  }

  // Получить список скважин (главный метод)
  async getWells(): Promise<WellData[]> {
    try {
      if (this.useMock) {
        // Используем mock API (без авторизации)
        const response = await mockExternalApiClient.get<ApiResponse<WellsListResponse>>('/api/v1/wells/');
        return response.data.data.wells;
      } else {
        // Режим реального API - используем защищенный эндпоинт
        return await this.getWellsFromOurApi();
      }
    } catch (error: any) {
      console.error('Error fetching wells:', error);
      throw error;
    }
  }

  // Получить данные конкретной скважины
  async getWellById(id: string): Promise<WellData> {
    try {
      if (this.useMock) {
        const response = await mockExternalApiClient.get<ApiResponse<WellData>>(`/api/v1/wells/${id}/`);
        return response.data.data;
      } else {
        // Для реального API используем наш защищенный эндпоинт
        const response = await apiClient.get(`/wells/${id}/`, {
          headers: authService.getAuthHeader()
        });
        return response.data;
      }
    } catch (error: any) {
      console.error(`Error fetching well ${id}:`, error);
      throw error;
    }
  }

  // Получить телеметрию скважины
  async getWellTelemetry(id: string, hours: number = 24, points: number = 100): Promise<TelemetryData> {
    try {
      if (this.useMock) {
        const response = await mockExternalApiClient.get<ApiResponse<TelemetryData>>(
          `/api/v1/wells/${id}/telemetry/?hours=${hours}&points=${points}`
        );
        return response.data.data;
      } else {
        // Для реального API - реализовать позже
        throw new Error('Real external API telemetry not implemented yet');
      }
    } catch (error) {
      console.error(`Error fetching telemetry for well ${id}:`, error);
      throw error;
    }
  }

  // Проверить доступность API
  async checkHealth(): Promise<{ status: string; [key: string]: any }> {
    try {
      if (this.useMock) {
        const response = await mockExternalApiClient.get('/api/v1/health/');
        return response.data;
      } else {
        const response = await apiClient.get('/health/', {
          headers: authService.getAuthHeader()
        });
        return response.data;
      }
    } catch (error) {
      console.error('Error checking API health:', error);
      return { status: 'unhealthy', error: String(error) };
    }
  }

  // Переключить между mock и реальным API
  setUseMock(useMock: boolean): void {
    this.useMock = useMock;
    console.log(`Switched to ${useMock ? 'mock' : 'real'} external API`);
  }

  // Получить текущий режим
  getCurrentMode(): string {
    return this.useMock ? 'mock' : 'real';
  }
}

// Создаем и экспортируем экземпляр сервиса
export const externalWellService = new ExternalWellService();