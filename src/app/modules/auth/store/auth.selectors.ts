import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUserProfile = createSelector(
  selectAuthState,
  (state: AuthState) => state.userProfile
);