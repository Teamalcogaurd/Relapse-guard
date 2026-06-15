import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_STORAGE_KEY = 'auth_tokens';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.relapsegaurd.com';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

type PendingRequest = {
  resolve: (tokens: AuthTokens) => void;
  reject: (error: Error) => void;
};

class AuthService {
  private tokens: AuthTokens | null = null;
  private refreshPromise: Promise<AuthTokens> | null = null;
  private pendingRequests: PendingRequest[] = [];
  private isRefreshing = false;

  /**
   * Initialize auth service by loading stored tokens
   */
  async initialize(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (stored) {
        this.tokens = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load stored tokens:', error);
    }
  }

  /**
   * Check if access token is expired
   */
  private isTokenExpired(expiresAt: number): boolean {
    // Consider token expired if less than 5 minutes remaining
    const buffer = 5 * 60 * 1000;
    return Date.now() >= expiresAt - buffer;
  }

  /**
   * Store tokens securely
   */
  private async storeTokens(tokens: AuthTokens): Promise<void> {
    try {
      this.tokens = tokens;
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
    } catch (error) {
      console.error('Failed to store tokens:', error);
      throw error;
    }
  }

  /**
   * Clear all stored tokens
   */
  async clearTokens(): Promise<void> {
    try {
      this.tokens = null;
      this.refreshPromise = null;
      this.pendingRequests = [];
      this.isRefreshing = false;
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.tokens?.accessToken ?? null;
  }

  /**
   * Get current tokens
   */
  getTokens(): AuthTokens | null {
    return this.tokens;
  }

  /**
   * Refresh access token using refresh token
   * Uses a queue system to prevent concurrent refresh requests
   */
  async refreshAccessToken(): Promise<AuthTokens> {
    if (!this.tokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    // If already refreshing, queue this request
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.pendingRequests.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: this.tokens.refreshToken,
        }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Refresh token is invalid, clear all tokens and force logout
          await this.clearTokens();
          throw new Error('REFRESH_TOKEN_INVALID');
        }
        throw new Error(`Token refresh failed with status ${response.status}`);
      }

      const data = await response.json();
      const newTokens: AuthTokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || this.tokens.refreshToken,
        expiresAt: data.expiresAt || Date.now() + 15 * 60 * 1000, // 15 min default
      };

      await this.storeTokens(newTokens);
      this.isRefreshing = false;

      // Resolve all pending requests
      this.pendingRequests.forEach((req) => req.resolve(newTokens));
      this.pendingRequests = [];

      return newTokens;
    } catch (error) {
      this.isRefreshing = false;

      // Reject all pending requests
      const errorMessage =
        error instanceof Error ? error.message : 'Token refresh failed';
      this.pendingRequests.forEach((req) => req.reject(new Error(errorMessage)));
      this.pendingRequests = [];

      throw error;
    }
  }

  /**
   * Ensure access token is valid, refresh if needed
   */
  async ensureValidToken(): Promise<string> {
    if (!this.tokens) {
      throw new Error('No tokens available');
    }

    if (!this.isTokenExpired(this.tokens.expiresAt)) {
      return this.tokens.accessToken;
    }

    // Token expired, refresh it
    const newTokens = await this.refreshAccessToken();
    return newTokens.accessToken;
  }

  /**
   * Login and store tokens
   */
  async login(email: string, password: string): Promise<AuthTokens> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`Login failed with status ${response.status}`);
      }

      const data = await response.json();
      const tokens: AuthTokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt || Date.now() + 15 * 60 * 1000,
      };

      await this.storeTokens(tokens);
      return tokens;
    } catch (error) {
      await this.clearTokens();
      throw error;
    }
  }

  /**
   * Signup and store tokens
   */
  async signup(email: string, password: string, name: string): Promise<AuthTokens> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error(`Signup failed with status ${response.status}`);
      }

      const data = await response.json();
      const tokens: AuthTokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt || Date.now() + 15 * 60 * 1000,
      };

      await this.storeTokens(tokens);
      return tokens;
    } catch (error) {
      await this.clearTokens();
      throw error;
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await this.clearTokens();
  }

  /**
   * Create an API client with automatic token refresh
   */
  createApiClient() {
    return {
      async request<T>(
        path: string,
        options: RequestInit = {}
      ): Promise<T> {
        let accessToken = await authService.ensureValidToken();

        const response = await fetch(`${API_BASE_URL}${path}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // If unauthorized, try to refresh token once
        if (response.status === 401) {
          try {
            accessToken = await authService.refreshAccessToken();
            return fetch(`${API_BASE_URL}${path}`, {
              ...options,
              headers: {
                'Content-Type': 'application/json',
                ...options.headers,
                Authorization: `Bearer ${accessToken}`,
              },
            }).then((res) => res.json() as Promise<T>);
          } catch (error) {
            // Refresh failed, logout
            await authService.logout();
            throw new Error('Session expired. Please log in again.');
          }
        }

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        return response.json() as Promise<T>;
      },
    };
  }
}

export const authService = new AuthService();
export const apiClient = authService.createApiClient();
