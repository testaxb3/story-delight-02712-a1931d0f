import { User, Session } from '@supabase/supabase-js';

export type AuthDestination = 'dashboard' | 'quiz';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  authenticate: (email: string) => Promise<AuthDestination>;
  signOut: () => Promise<void>;
  loading: boolean;
  resolveDestination: (userId: string) => Promise<AuthDestination>;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'AUTH_ERROR',
    public readonly isUserFriendly: boolean = true
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class MagicLinkSentError extends AuthError {
  constructor(message: string) {
    super(message, 'MAGIC_LINK_SENT', true);
    this.name = 'MagicLinkSentError';
  }
}

