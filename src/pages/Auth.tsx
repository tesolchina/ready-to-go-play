import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { passwordResetLogger } from "@/utils/passwordResetLogger";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, resendConfirmation, isAuthenticated, loading: authLoading, updatePassword, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  
  // Sign In Form
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  
  // Sign Up Form
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpFullName, setSignUpFullName] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  
  // Forgot Password / Resend Confirmation
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [hashError, setHashError] = useState<string | null>(null);
  const [hashErrorCode, setHashErrorCode] = useState<string | null>(null);
  const [allowResetMode, setAllowResetMode] = useState(true);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [expiredTokenEmail, setExpiredTokenEmail] = useState<string>("");
  const [hasCustomToken, setHasCustomToken] = useState(false);
  const [emailConfirmationStatus, setEmailConfirmationStatus] = useState<'pending' | 'success' | 'error' | null>(null);
  const [emailConfirmationMessage, setEmailConfirmationMessage] = useState<string>("");

  const [searchParams] = useSearchParams();
  const isResetMode = searchParams.get("reset") === "true";
  const isConfirmMode = searchParams.get("confirm") === "true";

  // Handle email confirmation
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      if (!isConfirmMode) return;
      
      const hash = window.location.hash;
      if (!hash.includes('token=')) return;
      
      const params = new URLSearchParams(hash.substring(1));
      const confirmToken = params.get('token');
      
      if (!confirmToken) return;
      
      setEmailConfirmationStatus('pending');
      
      try {
        const { data, error } = await supabase.functions.invoke('verify-email', {
          body: { token: confirmToken }
        });
        
        if (error) throw error;
        
        if (data.alreadyConfirmed) {
          setEmailConfirmationStatus('success');
          setEmailConfirmationMessage('Your email is already confirmed. You can sign in.');
        } else {
          setEmailConfirmationStatus('success');
          setEmailConfirmationMessage('Your email has been confirmed! You can now sign in.');
        }
        
        // Clean up URL
        window.history.replaceState({}, document.title, '/auth');
      } catch (e: any) {
        console.error('Email confirmation error:', e);
        setEmailConfirmationStatus('error');
        setEmailConfirmationMessage(e.message || 'Failed to confirm email. Please try requesting a new confirmation link.');
        window.history.replaceState({}, document.title, '/auth');
      }
    };
    
    handleEmailConfirmation();
  }, [isConfirmMode]);

  useEffect(() => {
    const fullUrl = window.location.href;
    const hash = window.location.hash;
    const search = window.location.search;
    const pathname = window.location.pathname;
    
    // Check for custom token in sessionStorage
    const customToken = sessionStorage.getItem('password_reset_token');
    if (customToken) {
      setHasCustomToken(true);
      passwordResetLogger.info('Auth', 'useEffect', 'Custom token found in sessionStorage', {
        tokenLength: customToken.length,
      });
    }

    passwordResetLogger.info('Auth', 'useEffect', 'Component mounted/updated', {
      fullUrl,
      hash,
      search,
      pathname,
      isResetMode,
      isConfirmMode,
      isAuthenticated,
      authLoading,
      hasSession: !!session,
      hasCustomToken: !!customToken,
      userId: session?.user?.id,
    });

    if (typeof window !== "undefined") {
      if (hash && hash.includes("error=")) {
        passwordResetLogger.error('Auth', 'useEffect', 'Error detected in URL hash', {
          hash,
        });

        const params = new URLSearchParams(hash.substring(1));
        const error = params.get("error");
        const errorCode = params.get("error_code");
        const errorDescription = params.get("error_description");
        const allParams = Object.fromEntries(params.entries());

        passwordResetLogger.error('Auth', 'useEffect', 'Parsed error from hash', {
          error,
          errorCode,
          errorDescription,
          allParams,
        });

        if (error || errorDescription) {
          setHashError(errorDescription || error);
          setHashErrorCode(errorCode);
        }

        if (errorCode === "otp_expired" || errorCode === "access_denied") {
          passwordResetLogger.warn('Auth', 'useEffect', 'Token expired or access denied - showing expired token UI', {
            errorCode,
            errorDescription,
          });
          setIsTokenExpired(true);
          setAllowResetMode(false);
          
          // Try to extract email from URL if available, or show forgot password form
          // Note: Email might not be in URL, so we'll show input field
          
          // Clean up URL hash to remove error after processing
          window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
        }
      } else if (hash && hash.includes("access_token")) {
        passwordResetLogger.info('Auth', 'useEffect', 'Access token found in hash (no error)', {
          hashLength: hash.length,
        });
      } else if (hash) {
        passwordResetLogger.debug('Auth', 'useEffect', 'Hash present but no error or access_token', {
          hash,
        });
      }
    }

    // Check if we're in reset mode but have no session AND no custom token
    // Only check after auth loading is complete
    const currentCustomToken = sessionStorage.getItem('password_reset_token');
    if (isResetMode && !authLoading && !session && !currentCustomToken && !isTokenExpired) {
      const currentHash = window.location.hash;
      // If no error in hash and no session and no custom token, token might have expired
      if (!currentHash.includes("error=") && !currentHash.includes("access_token")) {
        passwordResetLogger.warn('Auth', 'useEffect', 'Reset mode but no session and no custom token, showing expired token UI');
        setIsTokenExpired(true);
      }
    }

    if (isAuthenticated && !authLoading && !isResetMode) {
      passwordResetLogger.info('Auth', 'useEffect', 'User authenticated, navigating to home');
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate, isResetMode, session, isTokenExpired]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(signInEmail, signInPassword);
    
    if (!error) {
      navigate("/");
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpPassword !== signUpConfirmPassword) {
      return;
    }
    
    setLoading(true);
    
    await signUp(signUpEmail, signUpPassword, signUpFullName);
    setShowResendConfirmation(true);
    
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    passwordResetLogger.info('Auth', 'handleForgotPassword', 'Password reset requested', {
      email: resetEmail,
    });
    
    await resetPassword(resetEmail);
    
    setLoading(false);
    setShowForgotPassword(false);
    setResetEmail("");
  };

  const handleResendConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await resendConfirmation(resetEmail);
    
    setLoading(false);
    setShowResendConfirmation(false);
    setResetEmail("");
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    passwordResetLogger.info('Auth', 'handleUpdatePassword', 'Password update form submitted', {
      passwordLength: newPassword.length,
      passwordsMatch: newPassword === confirmNewPassword,
      isResetMode,
      isAuthenticated,
      hasSession: !!session,
      userId: session?.user?.id,
      currentUrl: window.location.href,
      currentHash: window.location.hash,
      currentSearch: window.location.search,
    });

    if (newPassword !== confirmNewPassword) {
      passwordResetLogger.warn('Auth', 'handleUpdatePassword', 'Passwords do not match');
      return;
    }

    // Check if session or custom token exists before attempting update
    const customToken = sessionStorage.getItem('password_reset_token');
    if (!session && !customToken) {
      passwordResetLogger.error('Auth', 'handleUpdatePassword', 'No session and no custom token available, showing expired token UI');
      setIsTokenExpired(true);
      setHashError("Your reset link is invalid or has expired. Please request a new password reset link.");
      setHashErrorCode("session_missing");
      return;
    }

    setLoading(true);
    passwordResetLogger.debug('Auth', 'handleUpdatePassword', 'Calling updatePassword function');
    
    const { error } = await updatePassword(newPassword);
    
    passwordResetLogger.info('Auth', 'handleUpdatePassword', 'updatePassword completed', {
      hasError: !!error,
      errorMessage: error?.message,
      errorStatus: error?.status,
    });
    
    setLoading(false);

    if (!error) {
      passwordResetLogger.info('Auth', 'handleUpdatePassword', 'Password updated successfully, navigating to home');
      navigate("/");
    } else {
      passwordResetLogger.error('Auth', 'handleUpdatePassword', 'Password update failed', {
        error: error.message,
        errorStatus: error.status,
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Academic EAP Platform
            </h1>
          </Link>
          <p className="text-muted-foreground mt-2">
            Professional EAP tools for educators
          </p>
        </div>

        {/* Email confirmation status */}
        {emailConfirmationStatus && (
          <Alert className={`mb-4 ${emailConfirmationStatus === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-950' : emailConfirmationStatus === 'error' ? 'border-destructive' : ''}`}>
            {emailConfirmationStatus === 'pending' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>Confirming your email...</AlertDescription>
              </>
            ) : emailConfirmationStatus === 'success' ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700 dark:text-green-400">{emailConfirmationMessage}</AlertDescription>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{emailConfirmationMessage}</AlertDescription>
              </>
            )}
          </Alert>
        )}

        {isResetMode && isTokenExpired ? (
          <Card>
            <CardHeader>
              <CardTitle>Reset Link Expired</CardTitle>
              <CardDescription>
                Your password reset link has expired. Please request a new one.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="space-y-2">
                  <p className="font-semibold">Your password reset link has expired or was already used.</p>
                  <p className="text-sm">
                    <strong>What happened:</strong> You successfully used your reset link, or it has expired.
                  </p>
                  <p className="text-sm">
                    <strong>To reset your password:</strong> Request a new link below. The new link can be used multiple 
                    times within 1 hour, so you don't need to worry about email clients scanning it.
                  </p>
                </AlertDescription>
              </Alert>
              <form onSubmit={handleForgotPassword}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="expired-reset-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="expired-reset-email"
                        type="email"
                        placeholder="your.name@university.edu"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send New Reset Link"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsTokenExpired(false);
                  navigate("/auth");
                }}
              >
                Back to Sign In
              </Button>
            </CardFooter>
          </Card>
        ) : isResetMode && !isTokenExpired && (session || hasCustomToken) ? (
          <Card>
            <CardHeader>
              <CardTitle>Set New Password</CardTitle>
              <CardDescription>
                Please enter a new password for your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdatePassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-new-password"
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                  {newPassword !== confirmNewPassword && confirmNewPassword && (
                    <p className="text-sm text-destructive">Passwords do not match</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/auth")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading || newPassword !== confirmNewPassword}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : showForgotPassword ? (
          <Card>
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>
                Enter your email to receive a password reset link
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleForgotPassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="your.name@university.edu"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : showResendConfirmation ? (
          <Card>
            <CardHeader>
              <CardTitle>Resend Confirmation</CardTitle>
              <CardDescription>
                Enter your email to resend the confirmation link
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleResendConfirmation}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resend-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="resend-email"
                      type="email"
                      placeholder="your.name@university.edu"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowResendConfirmation(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Resend Email"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to access your saved chats and API keys
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your.name@university.edu"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type="password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="w-full text-sm"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Register with your institutional email address
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      ⚠️ We only accept institutional email addresses (e.g., university or college domains). 
                      Accounts with personal email addresses may be removed without further notice.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={signUpFullName}
                        onChange={(e) => setSignUpFullName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Institutional Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.name@university.edu"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                    {signUpPassword !== signUpConfirmPassword && signUpConfirmPassword && (
                      <p className="text-sm text-destructive">Passwords do not match</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || signUpPassword !== signUpConfirmPassword}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
        )}

        <p className="text-center text-sm text-muted-foreground mt-4">
          {!isResetMode && !showForgotPassword && !showResendConfirmation && (
            <>
              <Link to="/" className="hover:text-primary underline">
                Continue as guest
              </Link>
              {" · "}
              <button
                onClick={() => setShowResendConfirmation(true)}
                className="hover:text-primary underline"
              >
                Resend confirmation
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Auth;