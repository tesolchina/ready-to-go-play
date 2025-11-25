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

        // Log PASSWORD_RECOVERY event specifically
        if (event === 'PASSWORD_RECOVERY') {
          passwordResetLogger.info('AuthContext', 'onAuthStateChange', 'PASSWORD_RECOVERY event detected', {
            hasSession: !!session,
            hasUser: !!session?.user,
            userId: session?.user?.id,
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

        // Check for errors in hash first
        if (hash && hash.includes('error=')) {
          const params = new URLSearchParams(hash.substring(1));
          const error = params.get('error');
          const errorCode = params.get('error_code');
          const errorDescription = params.get('error_description');

          passwordResetLogger.error('AuthContext', 'initSession', 'Error detected in URL hash', {
            error,
            errorCode,
            errorDescription,
            fullHash: hash,
          });

          // Handle OTP expired error specifically
          if (errorCode === 'otp_expired') {
            toast({
              title: "Reset link expired or already used",
              description: "Your password reset link has expired or was already used. Email clients may automatically scan links. Please request a new reset link and click it immediately after receiving the email.",
              variant: "destructive",
              duration: 10000,
            });
            
            // Clean up URL and redirect to auth page
            window.history.replaceState({}, document.title, '/auth?reset=expired');
            return;
          }
        }

        // Handle password recovery / magic link redirects with tokens in URL hash
        if (hash && hash.includes('access_token')) {
          passwordResetLogger.info('AuthContext', 'initSession', 'Access token found in hash, parsing...');

          const params = new URLSearchParams(hash.substring(1));
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');
          const type = params.get('type');

          passwordResetLogger.debug('AuthContext', 'initSession', 'Extracted tokens from hash', {
            hasAccessToken: !!access_token,
            hasRefreshToken: !!refresh_token,
            accessTokenLength: access_token?.length,
            refreshTokenLength: refresh_token?.length,
            type,
            allHashParams: Object.fromEntries(params.entries()),
          });

          if (access_token && refresh_token) {
            passwordResetLogger.info('AuthContext', 'initSession', 'Calling setSession with tokens');

            const { data, error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

            passwordResetLogger.info('AuthContext', 'initSession', 'setSession result', {
              hasError: !!error,
              errorMessage: error?.message,
              errorStatus: error?.status,
              hasSession: !!data?.session,
              hasUser: !!data?.session?.user,
              userId: data?.session?.user?.id,
              userEmail: data?.session?.user?.email,
              sessionExpiresAt: data?.session?.expires_at,
            });

            if (!error) {
              passwordResetLogger.info('AuthContext', 'initSession', 'Session set successfully');
              setSession(data.session);
              setUser(data.session?.user ?? null);
            } else {
              passwordResetLogger.error('AuthContext', 'initSession', 'Failed to set session', {
                error: error.message,
                errorStatus: error.status,
                errorName: error.name,
              });
            }
          } else {
            passwordResetLogger.warn('AuthContext', 'initSession', 'Hash contains access_token but tokens are missing', {
              hasAccessToken: !!access_token,
              hasRefreshToken: !!refresh_token,
            });
          }

          // Clean up URL hash so we don't re-process on refresh
          window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
          passwordResetLogger.debug('AuthContext', 'initSession', 'Cleaned up URL hash');
        } else {
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
    
    passwordResetLogger.info('AuthContext', 'resetPassword', 'Starting password reset request', {
      email,
      redirectUrl,
      origin: window.location.origin,
      timestamp: new Date().toISOString(),
    });

    const { error, data } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    passwordResetLogger.info('AuthContext', 'resetPassword', 'resetPasswordForEmail response', {
      hasError: !!error,
      errorMessage: error?.message,
      errorStatus: error?.status,
      errorName: error?.name,
      hasData: !!data,
      timestamp: new Date().toISOString(),
    });

    if (error) {
      passwordResetLogger.error('AuthContext', 'resetPassword', 'Password reset request failed', {
        error: error.message,
        errorStatus: error.status,
        errorName: error.name,
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
        description: "We've sent you a password reset link. Important: Click the link immediately after receiving it. If you're using an email client like Outlook, copy the link and open it in a web browser instead.",
        duration: 10000,
      });
    }

    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    passwordResetLogger.info('AuthContext', 'updatePassword', 'Starting password update', {
      passwordLength: newPassword.length,
      hasSession: !!session,
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      sessionExpiresAt: session?.expires_at,
      currentUrl: window.location.href,
      currentHash: window.location.hash,
      currentSearch: window.location.search,
    });

    // Check session before attempting update
    if (!session) {
      passwordResetLogger.warn('AuthContext', 'updatePassword', 'No session available, attempting to get session');
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      passwordResetLogger.info('AuthContext', 'updatePassword', 'getSession result', {
        hasSession: !!currentSession,
        hasUser: !!currentSession?.user,
        userId: currentSession?.user?.id,
      });

      if (!currentSession) {
        passwordResetLogger.error('AuthContext', 'updatePassword', 'No session available for password update');
        const error = { message: 'Auth session missing!' };
        toast({
          title: "Password update failed",
          description: "Your reset link is invalid or has expired. Please request a new password reset email and use the latest link from the same browser.",
          variant: "destructive",
        });
        return { error };
      }
    }

    passwordResetLogger.debug('AuthContext', 'updatePassword', 'Calling updateUser with new password');
    const { error, data } = await supabase.auth.updateUser({
      password: newPassword,
    });

    passwordResetLogger.info('AuthContext', 'updatePassword', 'updateUser response', {
      hasError: !!error,
      errorMessage: error?.message,
      errorStatus: error?.status,
      errorName: error?.name,
      hasData: !!data,
      hasUser: !!data?.user,
      userId: data?.user?.id,
    });

    if (error) {
      passwordResetLogger.error('AuthContext', 'updatePassword', 'Password update failed', {
        error: error.message,
        errorStatus: error.status,
        errorName: error.name,
        isSessionMissing: error.message === "Auth session missing!",
      });

      const description =
        error.message === "Auth session missing!"
          ? "Your reset link is invalid or has expired. Please request a new password reset email and use the latest link from the same browser."
          : error.message;

      toast({
        title: "Password update failed",
        description,
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