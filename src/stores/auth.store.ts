import type { UserProfile } from '../services/auth.service';

class AuthStore {
  private user: UserProfile | null = null;
  private authenticated: boolean = false;

  setUser(profile: UserProfile): void {
    this.user = profile;
    this.authenticated = true;
  }

  clearUser(): void {
    this.user = null;
    this.authenticated = false;
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  getUser(): UserProfile | null {
    return this.user;
  }

  getFullName(): string {
    if (!this.user) return '';
    return `${this.user.given_name} ${this.user.family_name}`;
  }

  getEmail(): string {
    return this.user?.email || '';
  }
}

export const authStore = new AuthStore();
