import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@/models';
import { authService } from '@/services/auth/authService';

interface SessionCtx {
  session: Session | null;
  setSession: (s: Session | null) => void;
  signOut: () => void;
}

const Ctx = createContext<SessionCtx | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => authService.getSession());
  const value = useMemo<SessionCtx>(
    () => ({
      session,
      setSession,
      signOut: () => {
        authService.logout();
        setSession(null);
      },
    }),
    [session],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession(): SessionCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
