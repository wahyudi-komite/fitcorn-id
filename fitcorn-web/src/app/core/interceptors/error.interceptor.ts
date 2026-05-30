import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/refresh') || req.url.includes('/auth/register');
        
        if (!isAuthRequest) {
          // Attempt to refresh session
          return authService.refreshSession().pipe(
            switchMap((res) => {
              // Retry the original request with the fresh token
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${res.accessToken}`,
                },
              });
              return next(retryReq);
            }),
            catchError((refreshErr) => {
              authService.logout();
              return throwError(() => refreshErr);
            }),
          );
        }
      }

      return throwError(() => error);
    }),
  );
};
