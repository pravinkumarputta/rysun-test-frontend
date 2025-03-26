import { createReducer, on } from '@ngrx/store';
import { AuthState, initialState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialState,
  on(AuthActions.setUserProfile, (state, { userProfile }) => ({
    ...state,
    userProfile
  })),
  on(AuthActions.clearUserProfile, (state) => ({
    ...state,
    userProfile: null,
  }))
); 