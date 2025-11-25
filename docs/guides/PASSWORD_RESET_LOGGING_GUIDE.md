# Password Reset Logging Guide

## Overview

Comprehensive logging has been added to track the password reset flow. All logs are stored persistently and can be exported for analysis.

## How to Use

### During Password Reset Flow

1. **Open Browser DevTools Console** (F12 or Cmd+Option+I)
2. **Clear console** and enable "Preserve log"
3. **Perform password reset** - all events will be logged automatically
4. **Check console** for real-time logs with `[AuthContext]` and `[Auth]` prefixes

### Accessing Logs

The logger is available globally in the browser console:

```javascript
// View all logs
passwordResetLogger.getLogs()

// Export as JSON file (downloadable)
passwordResetLogger.exportLogs()

// Export as text file (downloadable)
passwordResetLogger.exportLogsAsText()

// Filter logs by component
passwordResetLogger.getLogsBy('AuthContext', 'updatePassword')

// Clear all logs
passwordResetLogger.clearLogs()
```

### Log Storage

- **Console**: Real-time logging during development
- **localStorage**: Persistent storage (key: `password_reset_logs`)
- **Max entries**: 500 (oldest entries auto-removed)

## Log Format

Each log entry contains:

```typescript
{
  timestamp: "2024-01-15T10:30:45.123Z",
  level: "info" | "warn" | "error" | "debug",
  component: "AuthContext" | "Auth",
  function: "initSession" | "updatePassword" | "resetPassword" | etc.,
  message: "Description of the event",
  data: { /* Additional context data */ }
}
```

## Key Logging Points

### 1. Password Reset Request
- **Component**: `AuthContext`
- **Function**: `resetPassword`
- **Logs**: Email, redirect URL, Supabase response

### 2. URL Hash Parsing
- **Component**: `AuthContext`
- **Function**: `initSession`
- **Logs**: Full URL, hash contents, token extraction, error detection

### 3. Session Establishment
- **Component**: `AuthContext`
- **Function**: `initSession` / `onAuthStateChange`
- **Logs**: Token validation, session creation, PASSWORD_RECOVERY event

### 4. Password Update
- **Component**: `AuthContext` / `Auth`
- **Function**: `updatePassword` / `handleUpdatePassword`
- **Logs**: Session state, password update attempt, success/failure

### 5. Error Detection
- **Component**: `Auth` / `AuthContext`
- **Function**: `useEffect` / `initSession`
- **Logs**: Hash errors (otp_expired, access_denied), error descriptions

## Debugging the "Invalid Link" Issue

When you see the error URL:
```
/auth?reset=true#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired
```

### Check These Logs:

1. **Error Detection**:
   ```javascript
   passwordResetLogger.getLogsBy('Auth', 'useEffect')
   ```
   - Should show error parsing from hash
   - Check `errorCode` and `errorDescription`

2. **Session State**:
   ```javascript
   passwordResetLogger.getLogsBy('AuthContext', 'initSession')
   ```
   - Check if tokens were extracted
   - Check if `setSession` succeeded
   - Look for "No session available" warnings

3. **Auth State Changes**:
   ```javascript
   passwordResetLogger.getLogsBy('AuthContext', 'onAuthStateChange')
   ```
   - Check if `PASSWORD_RECOVERY` event fired
   - Check session state after event

4. **Password Update Attempt**:
   ```javascript
   passwordResetLogger.getLogsBy('AuthContext', 'updatePassword')
   ```
   - Check session state before update
   - Check exact error message and status code

## Exporting Logs for Analysis

### Method 1: Export to Repository (Recommended for GitHub)
```javascript
exportLogsToRepo()
```
- Downloads both JSON and text files with repository-ready format
- Includes summary statistics and environment info
- Files can be moved to `logs/` directory and committed
- See `logs/README.md` for detailed instructions

### Method 2: JSON Export
```javascript
passwordResetLogger.exportLogs()
```
- Downloads: `password-reset-logs-YYYY-MM-DDTHH-MM-SS.json`
- Contains full structured data
- Easy to parse programmatically

### Method 3: Text Export
```javascript
passwordResetLogger.exportLogsAsText()
```
- Downloads: `password-reset-logs-YYYY-MM-DDTHH-MM-SS.txt`
- Human-readable format
- Easy to share via email/support

## Example Debugging Session

```javascript
// 1. Start fresh
passwordResetLogger.clearLogs()

// 2. Perform password reset flow
// (User actions: request reset, click link, enter password)

// 3. Check for errors
const errors = passwordResetLogger.getLogs().filter(log => log.level === 'error')
console.table(errors)

// 4. Check session establishment
const sessionLogs = passwordResetLogger.getLogsBy('AuthContext', 'initSession')
console.table(sessionLogs)

// 5. Export for analysis
passwordResetLogger.exportLogs()
```

## Log Levels

- **info**: Normal flow events (session created, password updated)
- **warn**: Potential issues (missing tokens, session check)
- **error**: Failures (session missing, update failed, hash errors)
- **debug**: Detailed technical info (token lengths, URL parsing)

## Troubleshooting

### Logs Not Appearing
- Check browser console for errors
- Verify localStorage is enabled
- Check if logs were cleared: `passwordResetLogger.getLogs().length`

### Too Many Logs
- Logs auto-truncate to last 500 entries
- Clear manually: `passwordResetLogger.clearLogs()`

### Export Not Working
- Check browser download permissions
- Try different browser
- Use console to view: `console.table(passwordResetLogger.getLogs())`

## Next Steps

After collecting logs:
1. Export logs using `exportLogsToRepo()` (for GitHub) or `passwordResetLogger.exportLogs()`
2. Move exported files to `logs/` directory if committing to repository
3. Review the debug plan: `docs/guides/PASSWORD_RESET_DEBUG_PLAN.md`
4. Identify failure point from logs
5. Commit logs to repository if needed: `git add logs/password-reset-*.json && git commit -m "Add debug logs"`
6. Share logs with development team if needed

