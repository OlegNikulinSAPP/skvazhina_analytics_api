import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer' | 'guest';
  date_joined: string;
  last_login: string | null;
}

export class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private useHttpOnlyCookies: boolean = false;

  constructor() {
    this.useHttpOnlyCookies = process.env.NODE_ENV === 'production';
    if (!this.useHttpOnlyCookies) {
      this.loadTokensFromStorage();
    }
  }

  private loadTokensFromStorage(): void {
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  private saveTokens(access: string, refresh: string): void {
    if (this.useHttpOnlyCookies) {
      // В production токены в httpOnly cookies, фронтенд не хранит
      this.accessToken = access;
      this.refreshToken = refresh;
    } else {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      this.accessToken = access;
      this.refreshToken = refresh;
    }
  }

  async login(username: string, password: string): Promise<AuthTokens> {
    try {
      const response = await axios.post<AuthTokens>(
        `${API_URL}/api/auth/login/`,
        { username, password },
        this.useHttpOnlyCookies ? { withCredentials: true } : {}
      );

      const tokens = response.data;
      this.saveTokens(tokens.access, tokens.refresh);
      return tokens;

    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Ошибка авторизации');
    }
  }

  async register(
    username: string,
    password: string,
    password2: string,
    email?: string,
    role?: string
  ): Promise<UserData> {
    try {
      const response = await axios.post<UserData>(
        `${API_URL}/api/auth/register/`,
        { username, password, password2, email, role },
        this.useHttpOnlyCookies ? { withCredentials: true } : {}
      );

      return response.data;

    } catch (error: any) {
      console.error('Registration failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Ошибка регистрации');
    }
  }

  async getCurrentUser(): Promise<UserData> {
    try {
      const response = await axios.get<UserData>(
        `${API_URL}/api/auth/me/`,
        {
          headers: this.getAuthHeader(),
          ...(this.useHttpOnlyCookies ? { withCredentials: true } : {})
        }
      );

      return response.data;

    } catch (error: any) {
      console.error('Get user failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Ошибка получения данных пользователя');
    }
  }

  async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('Нет refresh токена');
    }

    try {
      const response = await axios.post<{ access: string }>(
        `${API_URL}/api/auth/refresh/`,
        { refresh: this.refreshToken },
        this.useHttpOnlyCookies ? { withCredentials: true } : {}
      );

      const newAccessToken = response.data.access;
      this.saveTokens(newAccessToken, this.refreshToken!);
      return newAccessToken;

    } catch (error: any) {
      console.error('Token refresh failed:', error.response?.data || error.message);
      this.logout();
      throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
    }
  }

  getAuthHeader(): Record<string, string> {
    if (this.useHttpOnlyCookies) {
      return {}; // Cookies отправляются автоматически
    }

    return this.accessToken
      ? { 'Authorization': `Bearer ${this.accessToken}` }
      : {};
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getUserRole(): string | null {
    // В реальном приложении нужно получать с сервера
    return this.accessToken ? 'user' : null;
  }

  logout(): void {
    this.accessToken = null;
    this.refreshToken = null;

    if (!this.useHttpOnlyCookies) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }

    // В production нужно также вызвать эндпоинт logout на сервере
    // для инвалидации refresh токена
  }
}

// Экспортируем экземпляр сервиса
export const authService = new AuthService();
