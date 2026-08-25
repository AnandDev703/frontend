import { UserRole } from './contract';

export interface UserProfile {
  uid: string;
  username?: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  defaultRole?: UserRole;
  createdAt?: string;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
  error: string | null;
}
