import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Well {
  id: number;
  well_number: string;
  field: string;
  latitude: number;
  longitude: number;
  depth: number;
  status: 'active' | 'inactive' | 'maintenance' | 'emergency';
  status_display: string;
  current_pressure: number | null;
  measured_flow_rate: number | null;
  temperature: number | null;
  last_data_update: string;
}

export const wellAPI = {
  getAll: () => api.get<Well[]>('/wells/'),
  getById: (id: number) => api.get<Well>(`/wells/${id}/`),
  create: (data: Partial<Well>) => api.post<Well>('/wells/', data),
  update: (id: number, data: Partial<Well>) => api.put<Well>(`/wells/${id}/`, data),
  delete: (id: number) => api.delete(`/wells/${id}/`),
};