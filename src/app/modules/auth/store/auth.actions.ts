import { createAction, props } from '@ngrx/store';
import { UserProfile } from './auth.state';


export const setUserProfile = createAction(
  '[Auth] Set User Profile',
  props<{ userProfile: UserProfile }>()
);

export const clearUserProfile = createAction('[Auth] Clear User Profile'); 