const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;

export interface UserProfile {
  given_name: string;
  family_name: string;
  email: string;
}

export interface AuthMeResponse {
  authenticated: boolean;
  profile?: UserProfile;
}

class AuthService {
  async checkAuth(): Promise<AuthMeResponse> {
    try {
      const response = await fetch(`${AUTH_BASE_URL}/auth/me`, {
        credentials: 'include',
      });

      if (!response.ok) {
        return { authenticated: false };
      }

      const data: AuthMeResponse = await response.json();
      return data;
    } catch (error) {
      return { authenticated: false };
    }
  }

  redirectToLogin(): void {
    const returnTo = encodeURIComponent(window.location.href);
    window.location.href = `${AUTH_BASE_URL}/auth/login?returnTo=${returnTo}`;
  }

  logout(): void {
    window.location.href = `${AUTH_BASE_URL}/auth/logout`;
  }
}

export const authService = new AuthService();
