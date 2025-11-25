# Password Reset Debug Plan

## Problem Statement

When a user requests a password reset:
1. ✅ User receives email with reset link
2. ❌ Clicking the link shows "invalid link" warning
3. ❌ Password update fails with "Auth session missing!" error

## Password Reset Flow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User Request (Auth.tsx)                                      │
│    handleForgotPassword() → resetPassword(email)                │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. AuthContext.resetPassword()                                  │
│    supabase.auth.resetPasswordForEmail(email, {                  │
│      redirectTo: '/auth?reset=true'                              │
│    })                                                             │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Supabase Backend                                             │
│    - Generates token_hash                                        │
│    - Triggers edge function: send-password-reset-email            │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Edge Function (send-password-reset-email/index.ts)            │
│    Creates link:                                                 │
│    ${SUPABASE_URL}/auth/v1/verify?token=${token_hash}            │
│    &type=${email_action_type}&redirect_to=${redirect_to}         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. User Clicks Link                                             │
│    Supabase verifies token → redirects to:                       │
│    /auth?reset=true#access_token=...&refresh_token=...           │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. AuthContext.initSession()                                    │
│    - Extracts tokens from window.location.hash                   │
│    - Calls supabase.auth.setSession({ tokens })                   │
│    - Should establish session                                    │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. Auth.tsx useEffect                                           │
│    - Detects ?reset=true in URL                                  │
│    - Shows password update form                                  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. User Submits New Password                                    │
│    handleUpdatePassword() → updatePassword(newPassword)          │
│    Requires: Valid session (from step 6)                        │
└─────────────────────────────────────────────────────────────────┘
```

## Code Execution Path

### Step 1: Password Reset Request
**File:** `src/pages/Auth.tsx`
**Function:** `handleForgotPassword()`
**Lines:** 96-105

```typescript
const handleForgotPassword = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  await resetPassword(resetEmail);  // ← Calls AuthContext
  setLoading(false);
  setShowForgotPassword(false);
  setResetEmail("");
};
```

### Step 2: AuthContext Reset Password
**File:** `src/contexts/AuthContext.tsx`
**Function:** `resetPassword()`
**Lines:** 152-173

```typescript
const resetPassword = async (email: string) => {
  const redirectUrl = `${window.location.origin}/auth?reset=true`;
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });
  // ... error handling
};
```

### Step 3: Edge Function Email Generation
**File:** `supabase/functions/send-password-reset-email/index.ts`
**Function:** `serve()`
**Lines:** 37-127

```typescript
const resetLink = `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;
```

### Step 4: Token Verification & Redirect
**Location:** Supabase Backend (automatic)
- User clicks link
- Supabase verifies token
- Redirects to: `/auth?reset=true#access_token=XXX&refresh_token=YYY`

### Step 5: Session Initialization
**File:** `src/contexts/AuthContext.tsx`
**Function:** `initSession()` (inside useEffect)
**Lines:** 55-87

```typescript
const initSession = async () => {
  const hash = window.location.hash;
  
  if (hash && hash.includes('access_token')) {
    const params = new URLSearchParams(hash.substring(1));
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    
    if (access_token && refresh_token) {
      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      // ... session handling
    }
  }
};
```

### Step 6: Password Update
**File:** `src/pages/Auth.tsx`
**Function:** `handleUpdatePassword()`
**Lines:** 118-132

```typescript
const handleUpdatePassword = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  const { error } = await updatePassword(newPassword);  // ← Requires session
  // ...
};
```

**File:** `src/contexts/AuthContext.tsx`
**Function:** `updatePassword()`
**Lines:** 175-199

```typescript
const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  // Fails if no session: "Auth session missing!"
};
```

## Debug Logging Plan

### Phase 1: Add Logging to AuthContext

#### 1.1 Log in `resetPassword()`
**Location:** `src/contexts/AuthContext.tsx:152`

**Add:**
- Log email being reset
- Log redirectUrl being used
- Log Supabase response (success/error)
- Log any error details

#### 1.2 Log in `initSession()`
**Location:** `src/contexts/AuthContext.tsx:55`

**Add:**
- Log full window.location (href, hash, search)
- Log hash extraction results
- Log token presence/absence
- Log setSession() call and response
- Log session state after setting
- Log any errors during session setup

#### 1.3 Log in `onAuthStateChange` callback
**Location:** `src/contexts/AuthContext.tsx:40`

**Add:**
- Log all auth events (especially `PASSWORD_RECOVERY`)
- Log session state on each event
- Log user state on each event

#### 1.4 Log in `updatePassword()`
**Location:** `src/contexts/AuthContext.tsx:175`

**Add:**
- Log current session state before update
- Log user state before update
- Log full error object (not just message)
- Log Supabase response details

### Phase 2: Add Logging to Auth.tsx

#### 2.1 Log in `useEffect` (hash parsing)
**Location:** `src/pages/Auth.tsx:41`

**Add:**
- Log full URL on component mount
- Log hash contents
- Log search params
- Log error extraction results
- Log reset mode detection

#### 2.2 Log in `handleUpdatePassword()`
**Location:** `src/pages/Auth.tsx:118`

**Add:**
- Log session state before password update
- Log isAuthenticated state
- Log error details from updatePassword

### Phase 3: Add Logging to Edge Function

#### 3.1 Log in `send-password-reset-email`
**Location:** `supabase/functions/send-password-reset-email/index.ts:37`

**Add:**
- Log received payload
- Log token_hash value
- Log redirect_to value
- Log email_action_type
- Log constructed resetLink
- Log email send result

## Specific Logging Points

### Critical Checkpoints

1. **Token Generation** (Edge Function)
   - ✅ Is token_hash present?
   - ✅ Is redirect_to correct?
   - ✅ Is resetLink properly formatted?

2. **URL Redirect** (Browser)
   - ✅ What is the full URL after Supabase redirect?
   - ✅ Are tokens present in hash?
   - ✅ Is `?reset=true` in search params?

3. **Hash Parsing** (AuthContext)
   - ✅ Is hash detected?
   - ✅ Are tokens extracted correctly?
   - ✅ Are tokens valid format?

4. **Session Setting** (AuthContext)
   - ✅ Does setSession() succeed?
   - ✅ Is session object created?
   - ✅ Is user object populated?

5. **Auth State Change** (AuthContext)
   - ✅ Does PASSWORD_RECOVERY event fire?
   - ✅ What is the session state?

6. **Password Update** (AuthContext)
   - ✅ Is session present when updatePassword() called?
   - ✅ What is the exact error?

## Implementation: Enhanced Logging Code

### AuthContext.tsx Enhancements

```typescript
// Add at top of file
const DEBUG_PREFIX = '[AUTH_DEBUG]';

// In resetPassword() - after line 153
console.log(`${DEBUG_PREFIX} [resetPassword] Starting password reset for:`, email);
console.log(`${DEBUG_PREFIX} [resetPassword] Redirect URL:`, redirectUrl);

// After line 155
const { error, data } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: redirectUrl,
});

console.log(`${DEBUG_PREFIX} [resetPassword] Supabase response:`, { 
  error: error?.message, 
  hasError: !!error,
  data 
});

// In initSession() - after line 57
console.log(`${DEBUG_PREFIX} [initSession] Full URL:`, window.location.href);
console.log(`${DEBUG_PREFIX} [initSession] Hash:`, hash);
console.log(`${DEBUG_PREFIX} [initSession] Search:`, window.location.search);

// After line 60
if (hash && hash.includes('access_token')) {
  console.log(`${DEBUG_PREFIX} [initSession] Hash contains access_token, parsing...`);
  
  // After line 63
  console.log(`${DEBUG_PREFIX} [initSession] Extracted tokens:`, {
    hasAccessToken: !!access_token,
    hasRefreshToken: !!refresh_token,
    accessTokenLength: access_token?.length,
    refreshTokenLength: refresh_token?.length,
  });
  
  // After line 66
  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  
  console.log(`${DEBUG_PREFIX} [initSession] setSession result:`, {
    error: error?.message,
    hasError: !!error,
    hasSession: !!data?.session,
    hasUser: !!data?.session?.user,
    userId: data?.session?.user?.id,
  });
  
  // After line 71
  if (!error) {
    console.log(`${DEBUG_PREFIX} [initSession] Session set successfully`);
    setSession(data.session);
    setUser(data.session?.user ?? null);
  } else {
    console.error(`${DEBUG_PREFIX} [initSession] Failed to set session:`, error);
  }
} else {
  console.log(`${DEBUG_PREFIX} [initSession] No access_token in hash, checking existing session`);
}

// In onAuthStateChange - after line 40
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    console.log(`${DEBUG_PREFIX} [onAuthStateChange] Event:`, event);
    console.log(`${DEBUG_PREFIX} [onAuthStateChange] Session:`, {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      expiresAt: session?.expires_at,
    });
    
    setSession(session);
    setUser(session?.user ?? null);
    // ... rest of code
  }
);

// In updatePassword() - after line 175
console.log(`${DEBUG_PREFIX} [updatePassword] Starting password update`);
console.log(`${DEBUG_PREFIX} [updatePassword] Current session:`, {
  hasSession: !!session,
  hasUser: !!user,
  userId: user?.id,
  sessionExpiresAt: session?.expires_at,
});

const { error, data } = await supabase.auth.updateUser({
  password: newPassword,
});

console.log(`${DEBUG_PREFIX} [updatePassword] Update result:`, {
  error: error?.message,
  errorCode: error?.status,
  hasError: !!error,
  hasData: !!data,
});
```

### Auth.tsx Enhancements

```typescript
// Add at top of file
const DEBUG_PREFIX = '[AUTH_PAGE_DEBUG]';

// In useEffect - after line 41
useEffect(() => {
  console.log(`${DEBUG_PREFIX} [useEffect] Component mounted/updated`);
  console.log(`${DEBUG_PREFIX} [useEffect] Full URL:`, window.location.href);
  console.log(`${DEBUG_PREFIX} [useEffect] Hash:`, window.location.hash);
  console.log(`${DEBUG_PREFIX} [useEffect] Search:`, window.location.search);
  console.log(`${DEBUG_PREFIX} [useEffect] isResetMode:`, isResetMode);
  console.log(`${DEBUG_PREFIX} [useEffect] isAuthenticated:`, isAuthenticated);
  console.log(`${DEBUG_PREFIX} [useEffect] authLoading:`, authLoading);
  console.log(`${DEBUG_PREFIX} [useEffect] session:`, session);
  
  if (typeof window !== "undefined") {
    const hash = window.location.hash;
    
    // After line 45
    if (hash && hash.includes("error=")) {
      console.log(`${DEBUG_PREFIX} [useEffect] Error detected in hash:`, hash);
      // ... rest of error parsing
    }
  }
}, [isAuthenticated, authLoading, navigate, isResetMode, session]);

// In handleUpdatePassword() - after line 118
const handleUpdatePassword = async (e: React.FormEvent) => {
  e.preventDefault();
  
  console.log(`${DEBUG_PREFIX} [handleUpdatePassword] Form submitted`);
  console.log(`${DEBUG_PREFIX} [handleUpdatePassword] Session state:`, {
    hasSession: !!session,
    isAuthenticated,
  });
  
  setLoading(true);
  const { error } = await updatePassword(newPassword);
  
  console.log(`${DEBUG_PREFIX} [handleUpdatePassword] Update result:`, {
    error: error?.message,
    hasError: !!error,
  });
  
  setLoading(false);
  // ... rest
};
```

### Edge Function Enhancements

```typescript
// In send-password-reset-email/index.ts - after line 47
console.log('[EDGE_FUNCTION] [send-password-reset-email] Received payload:', JSON.stringify(payload, null, 2));
console.log('[EDGE_FUNCTION] [send-password-reset-email] Email data:', JSON.stringify(emailData, null, 2));

// After line 55
console.log('[EDGE_FUNCTION] [send-password-reset-email] Extracted values:', {
  userEmail: user?.email,
  hasTokenHash: !!token_hash,
  tokenHashLength: token_hash?.length,
  emailActionType: email_action_type,
  redirectTo: redirect_to,
});

// After line 57
const resetLink = `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;
console.log('[EDGE_FUNCTION] [send-password-reset-email] Generated reset link:', resetLink);
console.log('[EDGE_FUNCTION] [send-password-reset-email] SUPABASE_URL:', Deno.env.get('SUPABASE_URL'));

// After line 99
const result = await resend.sendEmail({...});
console.log('[EDGE_FUNCTION] [send-password-reset-email] Email send result:', {
  success: !result.error,
  error: result.error?.message,
  emailId: result.id,
});
```

## Testing Procedure

### Step-by-Step Test

1. **Open Browser DevTools Console**
   - Clear console
   - Enable "Preserve log"

2. **Request Password Reset**
   - Navigate to `/auth`
   - Click "Forgot password"
   - Enter email
   - Submit form
   - **Check logs:** Should see `[AUTH_DEBUG] [resetPassword]` logs

3. **Check Email**
   - Open email
   - **Check logs:** Should see `[EDGE_FUNCTION]` logs in Supabase dashboard
   - Copy the reset link

4. **Click Reset Link**
   - Open link in new incognito/private window
   - **Check logs:** Should see:
     - `[AUTH_PAGE_DEBUG] [useEffect]` with full URL
     - `[AUTH_DEBUG] [initSession]` with hash parsing
     - `[AUTH_DEBUG] [onAuthStateChange]` with PASSWORD_RECOVERY event

5. **Verify Session**
   - Check if password form appears
   - **Check logs:** Should see session established

6. **Update Password**
   - Enter new password
   - Submit form
   - **Check logs:** Should see `[updatePassword]` logs with session state

## Expected Log Output (Success Case)

```
[AUTH_DEBUG] [resetPassword] Starting password reset for: user@example.com
[AUTH_DEBUG] [resetPassword] Redirect URL: http://localhost:5173/auth?reset=true
[AUTH_DEBUG] [resetPassword] Supabase response: { hasError: false }

[EDGE_FUNCTION] [send-password-reset-email] Generated reset link: https://xxx.supabase.co/auth/v1/verify?token=abc123&type=recovery&redirect_to=http://localhost:5173/auth?reset=true

[AUTH_PAGE_DEBUG] [useEffect] Full URL: http://localhost:5173/auth?reset=true#access_token=xxx&refresh_token=yyy
[AUTH_DEBUG] [initSession] Hash contains access_token, parsing...
[AUTH_DEBUG] [initSession] Extracted tokens: { hasAccessToken: true, hasRefreshToken: true }
[AUTH_DEBUG] [initSession] setSession result: { hasError: false, hasSession: true, hasUser: true }
[AUTH_DEBUG] [onAuthStateChange] Event: PASSWORD_RECOVERY
[AUTH_DEBUG] [onAuthStateChange] Session: { hasSession: true, hasUser: true }

[AUTH_DEBUG] [updatePassword] Current session: { hasSession: true, hasUser: true }
[AUTH_DEBUG] [updatePassword] Update result: { hasError: false }
```

## Common Failure Scenarios

### Scenario 1: Hash Not Parsed
**Symptoms:**
- No `[initSession] Hash contains access_token` log
- Session not established

**Possible Causes:**
- Hash not in URL (Supabase redirect issue)
- Hash format different than expected
- Hash cleared before parsing

**Fix:**
- Check Supabase redirect URL configuration
- Verify redirect_to matches exactly
- Check if hash is being stripped by router

### Scenario 2: Tokens Not Extracted
**Symptoms:**
- `[initSession] Hash contains access_token` appears
- But `hasAccessToken: false` or `hasRefreshToken: false`

**Possible Causes:**
- URLSearchParams parsing issue
- Hash format incorrect
- Tokens URL-encoded incorrectly

**Fix:**
- Log raw hash value
- Check token extraction logic
- Verify URL encoding/decoding

### Scenario 3: setSession Fails
**Symptoms:**
- Tokens extracted successfully
- But `setSession result: { hasError: true }`

**Possible Causes:**
- Tokens expired
- Tokens invalid format
- Supabase client misconfigured

**Fix:**
- Check token expiration time
- Verify Supabase URL/key configuration
- Check token format requirements

### Scenario 4: Session Not Persisting
**Symptoms:**
- `setSession` succeeds
- But `updatePassword` shows no session

**Possible Causes:**
- Session cleared between steps
- State not updating
- Race condition

**Fix:**
- Check session state in updatePassword
- Verify state updates propagate
- Add delay/retry logic if needed

### Scenario 5: PASSWORD_RECOVERY Event Not Firing
**Symptoms:**
- Session set successfully
- But no `PASSWORD_RECOVERY` event

**Possible Causes:**
- Event not triggered by Supabase
- Event listener not set up correctly
- Event fired before listener attached

**Fix:**
- Check onAuthStateChange setup timing
- Verify event name (may be different)
- Log all events to see what fires

## Revision Recommendations

### Immediate Fixes

1. **Add PASSWORD_RECOVERY Event Handling**
   ```typescript
   // In onAuthStateChange callback
   if (event === 'PASSWORD_RECOVERY') {
     console.log('Password recovery session established');
     // Ensure session is set
   }
   ```

2. **Add Session Validation Before Update**
   ```typescript
   // In updatePassword()
   if (!session) {
     console.error('No session available for password update');
     // Try to get session again
     const { data: { session: currentSession } } = await supabase.auth.getSession();
     if (!currentSession) {
       return { error: { message: 'Session expired. Please request a new reset link.' } };
     }
   }
   ```

3. **Add Hash Preservation**
   ```typescript
   // In initSession(), before cleaning hash
   // Store hash in sessionStorage for debugging
   if (hash && hash.includes('access_token')) {
     sessionStorage.setItem('password_reset_hash', hash);
   }
   ```

4. **Add Retry Logic**
   ```typescript
   // In updatePassword(), if session missing
   // Wait a bit and retry getting session
   await new Promise(resolve => setTimeout(resolve, 500));
   const { data: { session: retrySession } } = await supabase.auth.getSession();
   ```

### Long-term Improvements

1. **Better Error Messages**
   - Distinguish between expired token, invalid token, missing session
   - Provide actionable user guidance

2. **Session State Indicator**
   - Show user if session is established
   - Display countdown for token expiration

3. **Automatic Session Refresh**
   - Detect when session is about to expire
   - Automatically refresh if possible

4. **URL Hash Handling**
   - Use React Router's hash router if needed
   - Or implement custom hash handling

## Files to Modify

1. `src/contexts/AuthContext.tsx` - Add comprehensive logging
2. `src/pages/Auth.tsx` - Add page-level logging
3. `supabase/functions/send-password-reset-email/index.ts` - Add edge function logging

## Next Steps

1. ✅ Review this debug plan
2. ⏳ Implement logging enhancements
3. ⏳ Test password reset flow with logging
4. ⏳ Analyze logs to identify failure point
5. ⏳ Implement fixes based on findings
6. ⏳ Test again to verify fix
7. ⏳ Remove or reduce logging for production

