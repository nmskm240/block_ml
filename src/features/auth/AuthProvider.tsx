// providers/AuthProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { AuthService } from "./AuthService";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const session = await AuthService.getSession();
      if (session) {
        setSession(session);
        setUser(session.user);
      }
      setLoading(false);
    };
    init();

    const { data: listener } = AuthService.onAuthStateChange((_, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
