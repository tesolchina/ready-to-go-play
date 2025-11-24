# Authentication & Login Implementation Guide

This guide explains how authentication works in the application and how to extend it.

## Current Authentication System

The application uses **Supabase Authentication** for user management. Supabase provides:
- Email/password authentication
- Email confirmation
- Password reset
- Session management
- User metadata storage

## Architecture Overview

```
┌─────────────────┐
│   Auth.tsx      │  ← Login/Signup UI
│   (Page)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AuthContext    │  ← Authentication state & methods
│  (Context)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Supabase       │  ← Backend authentication service
│  Client         │
└─────────────────┘
```

## Key Files

### 1. Authentication Context
**File:** `/src/contexts/AuthContext.tsx`

This is the central authentication provider that:
- Manages user session state
- Provides authentication methods (signIn, signUp, signOut, etc.)
- Handles auth state changes
- Manages password reset flow

**Key Methods:**
```typescript
signUp(email, password, fullName)    // Register new user
signIn(email, password)               // Login
signOut()                             // Logout
resetPassword(email)                  // Send password reset email
updatePassword(newPassword)           // Update password after reset
resendConfirmation(email)             // Resend email confirmation
```

**State:**
```typescript
user: User | null              // Current user object
session: Session | null        // Current session
loading: boolean               // Loading state
isAuthenticated: boolean       // Computed auth status
```

### 2. Authentication Page
**File:** `/src/pages/Auth.tsx`

The UI for authentication with:
- Sign In tab
- Sign Up tab
- Password reset form
- Email confirmation resend
- Password update (after reset link)

### 3. Supabase Client
**File:** `/src/integrations/supabase/client.ts`

Configures the Supabase client connection.

## How to Use Authentication

### Basic Usage

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, signOut } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Protected Routes

Currently, routes are **not automatically protected**. To add protection:

**Option 1: Component-Level Protection**
```typescript
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedComponent() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/auth" />;
  
  return <div>Protected Content</div>;
}
```

**Option 2: Route Guard Component**
```typescript
// src/components/ProtectedRoute.tsx
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  
  return <>{children}</>;
}
```

Then use in `App.tsx`:
```typescript
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## Adding Login Functionality

### Current Status

✅ **Login is already implemented!** The application has:
- Full authentication system
- Login page at `/auth`
- Sign up functionality
- Password reset
- Email confirmation

### What You Might Want to Add

#### 1. **Automatic Route Protection**

Add a route guard to protect certain routes:

```typescript
// src/components/ProtectedRoute.tsx
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
}
```

#### 2. **User Profile Page**

Create a user profile page:

```typescript
// src/pages/Profile.tsx
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Profile() {
  const { user, signOut } = useAuth();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Email: {user?.email}</p>
        <p>Name: {user?.user_metadata?.full_name}</p>
        <button onClick={signOut}>Sign Out</button>
      </CardContent>
    </Card>
  );
}
```

#### 3. **Role-Based Access Control**

Add roles to user metadata and check them:

```typescript
// In AuthContext, add role checking
const isTeacher = user?.user_metadata?.role === 'teacher';
const isStudent = user?.user_metadata?.role === 'student';

// Create role-based guard
export function TeacherRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const isTeacher = user?.user_metadata?.role === 'teacher';
  
  if (!isTeacher) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}
```

#### 4. **Social Login (OAuth)**

Add OAuth providers in Supabase dashboard, then:

```typescript
// In AuthContext.tsx, add OAuth methods
const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });
  return { error };
};

const signInWithGitHub = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });
  return { error };
};
```

#### 5. **Session Persistence**

Sessions are already persisted by Supabase. To check session on app load:

```typescript
// Already implemented in AuthContext
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setUser(session?.user ?? null);
  });
}, []);
```

## Authentication Flow

### Sign Up Flow
```
1. User fills signup form
2. AuthContext.signUp() called
3. Supabase creates user
4. Confirmation email sent
5. User clicks email link
6. User redirected to app (authenticated)
```

### Sign In Flow
```
1. User fills login form
2. AuthContext.signIn() called
3. Supabase validates credentials
4. Session created
5. User redirected to home
```

### Password Reset Flow
```
1. User clicks "Forgot password"
2. User enters email
3. AuthContext.resetPassword() called
4. Reset email sent
5. User clicks link in email
6. User redirected to /auth?reset=true
7. User enters new password
8. AuthContext.updatePassword() called
9. Password updated, user signed in
```

## Testing Authentication

### Manual Testing

1. **Sign Up:**
   - Go to `/auth`
   - Click "Sign Up" tab
   - Fill form and submit
   - Check email for confirmation
   - Click confirmation link

2. **Sign In:**
   - Go to `/auth`
   - Enter credentials
   - Should redirect to home

3. **Password Reset:**
   - Click "Forgot password"
   - Enter email
   - Check email for reset link
   - Click link and set new password

### Programmatic Testing

```typescript
// Test authentication state
const { isAuthenticated, user } = useAuth();
console.log('Authenticated:', isAuthenticated);
console.log('User:', user);
```

## Common Issues & Solutions

### Issue: "Auth session missing!" when updating password

**Solution:** User must use the reset link in the same browser session. The link contains a session token.

### Issue: User not redirected after login

**Solution:** Check `Auth.tsx` - redirect happens in `useEffect` when `isAuthenticated` becomes true.

### Issue: Session not persisting

**Solution:** Supabase handles this automatically. Check browser localStorage for Supabase session.

## Security Considerations

1. **Email Confirmation:** Currently required for signup
2. **Password Strength:** Minimum 6 characters (consider increasing)
3. **Institutional Emails:** UI warns about institutional emails only
4. **Session Management:** Handled by Supabase (secure)
5. **HTTPS:** Required in production

## Next Steps

1. ✅ Authentication is implemented
2. 🔄 Add route protection (optional)
3. 🔄 Add user profile page (optional)
4. 🔄 Add role-based access (optional)
5. 🔄 Add OAuth providers (optional)

## Related Files

- `/src/contexts/AuthContext.tsx` - Auth state management
- `/src/pages/Auth.tsx` - Auth UI
- `/src/integrations/supabase/client.ts` - Supabase config
- `/src/integrations/supabase/types.ts` - TypeScript types

## Supabase Dashboard

Configure authentication settings in:
- Supabase Dashboard → Authentication → Settings
- Enable/disable providers
- Configure email templates
- Set password requirements
- Configure redirect URLs

