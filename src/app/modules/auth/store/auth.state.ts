export interface UserProfile {
  id: string;
  fullName: string;
  emailId: string;
  phoneNumber: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  userProfile: UserProfile | null;
}

export const initialState: AuthState = {
  userProfile: null,
};
