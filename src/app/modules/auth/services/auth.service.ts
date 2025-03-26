import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import * as AuthActions from '../store/auth.actions';
import { UserProfile } from '../store/auth.state';
import { LoginResponse } from '../types/login-response';
import { SignupRequest } from '../types/signup-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  static signoutListener = new Subject<string | null>();

  constructor(
    private store: Store,
    private http: HttpClient,
    private router: Router
  ) {
    AuthService.signoutListener.subscribe(() => {
      this.logout();
    });
  }

  login(email: string, password: string): Observable<UserProfile> {
    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        map((response: LoginResponse) => {
          this.setUserProfile(response.userProfile);
          localStorage.setItem('token', response.token);
          return response.userProfile;
        })
      );
  }

  signup(signupData: SignupRequest): Observable<UserProfile> {
    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}/auth/signup`, signupData)
      .pipe(
        map((response: LoginResponse) => {
          this.setUserProfile(response.userProfile);
          localStorage.setItem('token', response.token);
          return response.userProfile;
        })
      );
  }

  setUserProfile(userProfile: UserProfile): void {
    this.store.dispatch(AuthActions.setUserProfile({ userProfile }));
  }

  clearUserProfile(): void {
    this.store.dispatch(AuthActions.clearUserProfile());
  }

  logout(): void {
    this.clearUserProfile();
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  fetchProfile(): Observable<UserProfile> {
    return this.http
      .get<UserProfile>(`${environment.apiBaseUrl}/users/profile`)
      .pipe(
        map((response: UserProfile) => {
          this.setUserProfile(response);
          return response;
        })
      );
  }
}
