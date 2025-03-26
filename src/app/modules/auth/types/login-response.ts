import { UserProfile } from '../store/auth.state';

export interface LoginResponse {
  userProfile: UserProfile;
  token: string;
}
