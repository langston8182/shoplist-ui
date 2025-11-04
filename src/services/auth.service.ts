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

export interface RefreshResponse {
  success: boolean;
}

class AuthService {
  async refreshToken(): Promise<boolean> {
    console.log('🔄 [AUTH] Tentative de refresh du token...');
    try {
      const response = await fetch(`${AUTH_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        console.log(`❌ [AUTH] Échec du refresh token - Status: ${response.status}`);
        return false;
      }

      const data: RefreshResponse = await response.json();
      console.log(`✅ [AUTH] Refresh token - Succès: ${data.success}`);
      return data.success;
    } catch (error) {
      console.log('❌ [AUTH] Erreur lors du refresh token:', error);
      return false;
    }
  }

  async checkAuth(): Promise<AuthMeResponse> {
    console.log('🔍 [AUTH] Vérification de l\'authentification...');
    try {
      const response = await fetch(`${AUTH_BASE_URL}/auth/me`, {
        credentials: 'include',
      });

      if (!response.ok) {
        console.log(`❌ [AUTH] Utilisateur non authentifié - Status: ${response.status}`);
        return { authenticated: false };
      }

      const data: AuthMeResponse = await response.json();
      console.log(`✅ [AUTH] Utilisateur authentifié:`, data.profile?.email || 'Email non disponible');
      return data;
    } catch (error) {
      console.log('❌ [AUTH] Erreur lors de la vérification d\'authentification:', error);
      return { authenticated: false };
    }
  }

  redirectToLogin(): void {
    const returnTo = encodeURIComponent(window.location.href);
    console.log(`🔗 [AUTH] Redirection vers login - ReturnTo: ${window.location.href}`);
    window.location.href = `${AUTH_BASE_URL}/auth/login?returnTo=${returnTo}`;
  }

  logout(): void {
    console.log('🚪 [AUTH] Déconnexion de l\'utilisateur');
    window.location.href = `${AUTH_BASE_URL}/auth/logout`;
  }
}

export const authService = new AuthService();
