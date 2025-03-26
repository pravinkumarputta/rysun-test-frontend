import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';

export const apiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Only intercept requests to our API
  if (!req.url.startsWith(environment.apiBaseUrl)) {
    return next(req);
  }

  const authService = inject(AuthService);

  const additionalHeaders: any = {};

  // append token to the request header
  const token = localStorage.getItem('token');
  if (authService.isAuthenticated()) {
    additionalHeaders['Authorization'] = `Bearer ${token}`;
  }

  // set headers to the request
  const modifiedRequest = req.clone({
    setHeaders: additionalHeaders,
  });

  return next(modifiedRequest).pipe(
    catchError((error) => {
      let errorMessage = 'Something went wrong!';

      if (error.status === 0) {
        errorMessage = 'Network error: Please check your connection.';
      } else if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 400:
            errorMessage =
              error.error?.message ?? 'Bad Request! Please check your input.';
            break;
          case 401:
            errorMessage =
              error.error?.message ?? 'Unauthorized! Please log in again.';
            const url = new URL(location.href);
            AuthService.signoutListener.next(url.pathname);
            break;
          case 403:
            errorMessage =
              error.error?.message ??
              'Access forbidden! You do not have permission.';
            break;
          case 404:
            errorMessage = error.error?.message ?? 'Resource not found!';
            break;
          case 429:
            errorMessage =
              error.error?.message ??
              'Too many requests. Please try again later.';
            break;
          case 500:
            errorMessage =
              error.error?.message ?? 'Server error! Please try again later.';
            break;
          case 503:
            errorMessage =
              error.error?.message ??
              'Service temporarily unavailable. Please try again later.';
            break;
          default:
            errorMessage =
              error.error?.message ?? `Error ${error.status}: ${error.message}`;
        }
      }

      return throwError(() => new Error(errorMessage));
    })
  );
};
