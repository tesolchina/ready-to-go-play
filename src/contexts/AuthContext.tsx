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
        const search = window.location.search;
        const pathname = window.location.pathname;

        passwordResetLogger.info('AuthContext', 'initSession', 'Initializing session', {
          fullUrl,
          hash,
          search,
          pathname,
        });

        // Check for custom password reset token in hash
        if (hash && hash.includes('token=')) {
          const params = new URLSearchParams(hash.substring(1));
          const resetToken = params.get('token');
          
          if (resetToken) {
            passwordResetLogger.info('AuthContext', 'initSession', 'Password reset token found in URL');
            // Store token in sessionStorage for the reset form to use
            sessionStorage.setItem('password_reset_token', resetToken);
            // Clean up URL and redirect to reset page
            window.history.replaceState({}, document.title, '/auth?reset=true');
            setLoading(false);
            return;
          }
        }

        // Handle standard Supabase auth session
        if (hash && hash.includes('access_token')) {
          passwordResetLogger.info('AuthContext', 'initSession', 'No access_token in hash, checking existing session');
          const { data: { session } } = await supabase.auth.getSession();
          
          passwordResetLogger.info('AuthContext', 'initSession', 'Existing session check', {
            hasSession: !!session,
            hasUser: !!session?.user,
            userId: session?.user?.id,
            sessionExpiresAt: session?.expires_at,
          });

          setSession(session);
          setUser(session?.user ?? null);
        }
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
    
    passwordResetLogger.info('AuthContext', 'resetPassword', 'Starting custom password reset request', {
      email,
      redirectUrl,
      timestamp: new Date().toISOString(),
    });

    try {
      const { data, error } = await supabase.functions.invoke('request-password-reset', {
        body: { email, redirectUrl }
      });

      passwordResetLogger.info('AuthContext', 'resetPassword', 'Custom reset response', {
        hasError: !!error,
        hasData: !!data,
        timestamp: new Date().toISOString(),
      });

      if (error) {
        throw error;
      }

      passwordResetLogger.info('AuthContext', 'resetPassword', 'Password reset email sent successfully');
      toast({
        title: "Check your email",
        description: "We've sent you a password reset link. This link will work even if your email client scans it. Simply click the link when you're ready to reset your password.",
        duration: 10000,
      });

      return { error: null };
    } catch (error: any) {
      passwordResetLogger.error('AuthContext', 'resetPassword', 'Password reset request failed', {
        error: error.message,
      });

      toast({
        title: "Password reset failed",
        description: error.message || 'Failed to send reset email',
        variant: "destructive",
      });

      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    // Check if we have a custom reset token
    const resetToken = sessionStorage.getItem('password_reset_token');
    
    if (resetToken) {
      passwordResetLogger.info('AuthContext', 'updatePassword', 'Using custom reset token');
      
      try {
        const { data, error } = await supabase.functions.invoke('reset-password', {
          body: { token: resetToken, newPassword }
        });

        if (error) {
          throw error;
        }

        // Clear the token
        sessionStorage.removeItem('password_reset_token');

        passwordResetLogger.info('AuthContext', 'updatePassword', 'Password updated successfully with custom token');
        
        toast({
          title: "Password updated",
          description: "Your password has been changed successfully. You can now sign in with your new password.",
        });

        return { error: null };
      } catch (error: any) {
        passwordResetLogger.error('AuthContext', 'updatePassword', 'Custom token password update failed', {
          error: error.message,
        });

        toast({
          title: "Password update failed",
          description: error.message || 'Failed to update password',
          variant: "destructive",
        });

        return { error };
      }
    }

    // Fallback to standard Supabase password update (for authenticated users)
    passwordResetLogger.info('AuthContext', 'updatePassword', 'Using standard password update', {
      hasSession: !!session,
      hasUser: !!user,
    });

    if (!session) {
      const error = { message: 'Please sign in to change your password' };
      toast({
        title: "Not authenticated",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    const { error, data } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast({
        title: "Password update failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
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