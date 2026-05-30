import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private isBrowser: boolean;

  currentUser = signal<any | null>(null);
  accessToken = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.restoreSession();
  }

  private restoreSession() {
    if (!this.isBrowser) return;

    const token = localStorage.getItem('fitcorn_access_token');
    const userStr = localStorage.getItem('fitcorn_user');

    if (token && userStr) {
      this.accessToken.set(token);
      this.currentUser.set(JSON.parse(userStr));
      this.fetchProfile().subscribe(); // Fetch fresh profile from server in background
    }
  }

  register(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  login(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, payload).pipe(
      tap((res) => {
        if (res && res.accessToken) {
          this.accessToken.set(res.accessToken);
          this.currentUser.set(res.user);

          if (this.isBrowser) {
            localStorage.setItem('fitcorn_access_token', res.accessToken);
            localStorage.setItem('fitcorn_user', JSON.stringify(res.user));
          }
        }
      }),
    );
  }

  setSession(token: string, user: any) {
    this.accessToken.set(token);
    this.currentUser.set(user);
    if (this.isBrowser) {
      localStorage.setItem('fitcorn_access_token', token);
      localStorage.setItem('fitcorn_user', JSON.stringify(user));
    }
  }

  socialLogin(provider: string): void {
    window.location.href = `${this.apiUrl}/${provider}`;
  }

  sendOtp(phone: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/phone/send-otp`, { phone });
  }

  verifyOtp(phone: string, otp: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/phone/verify-otp`, { phone, otp }).pipe(
      tap(res => {
        if (res && res.accessToken) {
          this.setSession(res.accessToken, res.user);
        }
      }),
    );
  }

  refreshSession(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh`, {}, { withCredentials: true }).pipe(
      tap((res) => {
        if (res && res.accessToken) {
          this.accessToken.set(res.accessToken);
          if (this.isBrowser) {
            localStorage.setItem('fitcorn_access_token', res.accessToken);
          }
        }
      }),
      catchError((err) => {
        this.logout();
        return throwError(() => err);
      }),
    );
  }

  fetchProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`).pipe(
      tap((user) => {
        this.currentUser.set(user);
        if (this.isBrowser) {
          localStorage.setItem('fitcorn_user', JSON.stringify(user));
        }
      }),
    );
  }

  logout() {
    const logoutApi: Observable<any> = this.accessToken()
      ? this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      : of(null);

    logoutApi.subscribe();

    this.accessToken.set(null);
    this.currentUser.set(null);

    if (this.isBrowser) {
      localStorage.removeItem('fitcorn_access_token');
      localStorage.removeItem('fitcorn_user');
      localStorage.removeItem('x-session-id'); // optionally clear session id
    }
  }

  isAuthenticated(): boolean {
    return !!this.accessToken();
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    if (!user || !user.roles) return false;
    return user.roles.some((role: any) => role.name === 'admin');
  }

  // Helper to generate guest session id
  getGuestSessionId(): string {
    if (!this.isBrowser) return '';

    let sessionId = localStorage.getItem('fitcorn_session_id');
    if (!sessionId) {
      sessionId = `GUEST-${Math.random().toString(36).substring(2, 15)}-${Date.now()}`;
      localStorage.setItem('fitcorn_session_id', sessionId);
    }
    return sessionId;
  }
}
