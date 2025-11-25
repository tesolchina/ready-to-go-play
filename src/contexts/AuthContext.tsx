import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { passwordResetLogger } from '@/utils/passwordResetLogger';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  resendConfirmation: (email: string) => Promise<{ error: any }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
  updatePassword: async () => ({ error: null }),
  resendConfirmation: async () => ({ error: null }),
  isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        passwordResetLogger.info('AuthContext', 'onAuthStateChange', `Auth state changed: ${event}`, {
          event,
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          sessionExpiresAt: session?.expires_at,
          accessToken: session?.access_token ? `${session.access_token.substring(0, 20)}...` : null,
        });

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome back!",
            description: "You've successfully signed in.",
          });
        }
      }
    );

    const initSession = async () => {
      try {
        const fullUrl = window.location.href;
        const hash = window.location.hash;

        passwordResetLogger.info('AuthContext', 'initSession', 'Initializing session', {
          fullUrl,
          hash,
        });

        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        passwordResetLogger.info('AuthContext', 'initSession', 'Session check', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id,
          sessionExpiresAt: session?.expires_at,
        });

        setSession(session);
        setUser(session?.user ?? null);
      } catch (error: any) {
        passwordResetLogger.error('AuthContext', 'initSession', 'Exception in initSession', {
          errorMessage: error?.message,
          errorStack: error?.stack,
          errorName: error?.name,
        });
      } finally {
        setLoading(false);
        passwordResetLogger.debug('AuthContext', 'initSession', 'initSession completed, loading set to false');
      }
    };

    void initSession();

    return () => subscription.unsubscribe();
  }, [toast]);

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check your email",
        description: "We've sent you a confirmation link. Please check your institutional email.",
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    }

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (!error) {
      toast({
        title: "Signed out",
        description: "You've been signed out successfully.",
      });
    }
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/auth?reset=true`;
    
    passwordResetLogger.info('AuthContext', 'resetPassword', 'Starting Supabase password reset request', {
      email,
      redirectUrl,
      timestamp: new Date().toISOString(),
    });

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    passwordResetLogger.info('AuthContext', 'resetPassword', 'Supabase reset response', {
      hasError: !!error,
      timestamp: new Date().toISOString(),
    });

    if (error) {
      passwordResetLogger.error('AuthContext', 'resetPassword', 'Password reset request failed', {
        error: error.message,
      });

      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      passwordResetLogger.info('AuthContext', 'resetPassword', 'Password reset email sent successfully');
      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
        duration: 10000,
      });
    }

    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    passwordResetLogger.info('AuthContext', 'updatePassword', 'Updating password', {
      hasSession: !!session,
      hasUser: !!user,
    });

    if (!session) {
      const error = { message: 'No active session. Please use the reset link from your email.' };
      toast({
        title: "Not authenticated",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      passwordResetLogger.error('AuthContext', 'updatePassword', 'Password update failed', {
        error: error.message,
      });
      toast({
        title: "Password update failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      passwordResetLogger.info('AuthContext', 'updatePassword', 'Password updated successfully');
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
    }

    return { error };
  };

  const resendConfirmation = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      }
    });

    if (error) {
      toast({
        title: "Resend failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Email sent",
        description: "We've sent you a new confirmation email.",
      });
    }

    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        resendConfirmation,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};