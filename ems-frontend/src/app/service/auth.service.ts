import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  role: string;
  userId: number;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_AUTH = 'http://localhost:8080/api/auth/login';
  private http = inject(HttpClient);

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.API_AUTH, credentials).pipe(
      tap(response => {
        if (response && response.accessToken) {
          localStorage.setItem('access_token', response.accessToken);
          localStorage.setItem('user_role', response.role);
          localStorage.setItem('user_id', response.userId.toString());
          localStorage.setItem('username', response.username);
          console.log('Login successful, JWT and Role saved to localStorage');
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('user_role');
  }

  /**
   * Check if user has ADMIN role
   */
  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  /**
   * Check if user has USER role
   */
  isUser(): boolean {
    return this.getUserRole() === 'USER';
  }

  /**
   * Get logged in user's ID
   */
  getUserId(): number | null {
    const userId = localStorage.getItem('user_id');
    return userId ? parseInt(userId, 10) : null;
  }

  /**
   * Get logged in username
   */
  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    return this.getUserRole() === role;
  }

  /**
   * Check if user has any of the given roles
   */
  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
  }
}
