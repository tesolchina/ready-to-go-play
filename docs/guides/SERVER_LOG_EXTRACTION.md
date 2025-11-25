# Server Log Extraction Guide

## Overview

Password reset logs need to be extracted from server-side sources:
1. **Supabase Dashboard** - Auth logs and edge function logs
2. **Lovable Platform** - Application server logs (if available)
3. **Browser Network Tab** - API request/response logs

## 1. Supabase Dashboard Logs

### Access Supabase Logs

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `ucfgbubrgojodrkgayap`
3. **Navigate to Logs**:
   - **Auth Logs**: `Authentication` → `Logs`
   - **Edge Function Logs**: `Edge Functions` → Select function → `Logs`
   - **API Logs**: `Logs` → `API`

### Password Reset Auth Logs

**Path**: `Authentication` → `Logs`

**What to look for**:
- Password reset email sent events
- Token generation
- Token verification attempts
- Error: `otp_expired` or `access_denied`

**Filter by**:
- Event type: `password_reset`
- Time range: Last 24 hours
- User email (if known)

### Export Supabase Logs

1. **In Supabase Dashboard**:
   - Go to `Logs` section
   - Use filters to find password reset events
   - Click "Export" or copy log entries
   - Save as JSON or CSV

2. **Using Supabase CLI** (if installed):
   ```bash
   supabase functions logs send-password-reset-email --project-ref ucfgbubrgojodrkgayap
   ```

## 2. Supabase Edge Function Logs

### Check if Password Reset Email Function Exists

**Note**: The `send-password-reset-email` function was deleted. Password reset emails are now handled by Supabase Auth directly.

**To verify**:
1. Go to `Edge Functions` in Supabase Dashboard
2. Check if `send-password-reset-email` exists
3. If it doesn't exist, Supabase is using default email templates

### If Custom Function Exists

**Path**: `Edge Functions` → `send-password-reset-email` → `Logs`

**What to look for**:
- Function invocations
- Email send attempts
- Token generation
- Error messages

## 3. Browser Network Logs

### Extract Network Requests

1. **Open Browser DevTools** (F12)
2. **Go to Network Tab**
3. **Filter by**:
   - Type: `Fetch/XHR`
   - URL contains: `supabase.co` or `auth`
4. **Perform password reset**
5. **Export Network Logs**:
   - Right-click on network requests
   - Select "Save all as HAR with content"
   - Save file

### Key Requests to Check

- `POST /auth/v1/recover` - Password reset request
- `GET /auth/v1/verify` - Token verification
- `POST /auth/v1/user` - Password update

## 4. Lovable Platform Logs

### Access Lovable Logs

**If Lovable provides log access**:
1. Check Lovable dashboard
2. Look for "Logs" or "Monitoring" section
3. Filter by time and error type

**Note**: Lovable may not provide direct log access. Check their documentation.

## 5. Automated Log Collection Script

### Create Log Collection Script

Create a script to help collect logs from multiple sources:

```bash
#!/bin/bash
# scripts/collect-password-reset-logs.sh

LOG_DIR="logs/server-logs"
TIMESTAMP=$(date +"%Y-%m-%dT%H-%M-%S")
mkdir -p "$LOG_DIR"

echo "Collecting password reset logs..."
echo "Timestamp: $TIMESTAMP"

# 1. Export browser network logs (manual step)
echo "1. Export browser network logs:"
echo "   - Open DevTools → Network"
echo "   - Filter: supabase.co/auth"
echo "   - Save as HAR file"
echo "   - Save to: $LOG_DIR/network-$TIMESTAMP.har"

# 2. Supabase logs (manual step)
echo "2. Export Supabase logs:"
echo "   - Go to Supabase Dashboard → Logs"
echo "   - Filter: password_reset events"
echo "   - Export and save to: $LOG_DIR/supabase-auth-$TIMESTAMP.json"

# 3. Create summary
cat > "$LOG_DIR/collection-summary-$TIMESTAMP.md" << EOF
# Password Reset Log Collection Summary

**Collected**: $TIMESTAMP

## Sources

1. Browser Network Logs: network-$TIMESTAMP.har
2. Supabase Auth Logs: supabase-auth-$TIMESTAMP.json
3. Client-side Logs: (export from browser console)

## Steps to Collect

1. Browser Network:
   - Open DevTools → Network tab
   - Filter: supabase.co/auth
   - Perform password reset
   - Export as HAR

2. Supabase Dashboard:
   - Authentication → Logs
   - Filter: password_reset
   - Export logs

3. Client Logs:
   - Open browser console
   - Run: exportLogsToRepo()
   - Move files to logs/ directory

## Error Details

- Error URL: [paste the error URL here]
- Error Code: otp_expired
- Error Description: Email link is invalid or has expired
EOF

echo "Summary created: $LOG_DIR/collection-summary-$TIMESTAMP.md"
echo ""
echo "Next steps:"
echo "1. Export browser network logs (HAR file)"
echo "2. Export Supabase auth logs"
echo "3. Export client-side logs using exportLogsToRepo()"
echo "4. Commit all logs: git add logs/ && git commit -m 'Add server logs for password reset debugging'"
```

## 6. Manual Log Collection Steps

### Step-by-Step Process

1. **Before Password Reset**:
   - Open Browser DevTools → Network tab
   - Clear network log
   - Enable "Preserve log"

2. **Request Password Reset**:
   - Go to `/auth`
   - Click "Forgot password"
   - Enter email
   - Submit

3. **Check Supabase Dashboard**:
   - Go to `Authentication` → `Logs`
   - Look for password reset email sent event
   - Note the timestamp and event details

4. **Click Reset Link**:
   - Open email
   - Click reset link
   - Note the error URL

5. **Export Logs**:
   - **Browser Network**: Save as HAR file
   - **Supabase**: Export auth logs
   - **Client-side**: Run `exportLogsToRepo()` in console

6. **Save to Repository**:
   ```bash
   # Create server logs directory
   mkdir -p logs/server-logs
   
   # Move files
   mv ~/Downloads/*.har logs/server-logs/
   mv ~/Downloads/supabase-logs.json logs/server-logs/
   
   # Commit
   git add logs/server-logs/
   git commit -m "Add server logs for password reset debugging"
   git push
   ```

## 7. Supabase Auth Log Analysis

### Key Events to Check

1. **Password Reset Request**:
   ```json
   {
     "event": "password_reset_requested",
     "timestamp": "...",
     "user_email": "...",
     "success": true/false
   }
   ```

2. **Token Generation**:
   ```json
   {
     "event": "token_generated",
     "token_type": "recovery",
     "expires_at": "..."
   }
   ```

3. **Token Verification**:
   ```json
   {
     "event": "token_verification",
     "token_type": "recovery",
     "success": true/false,
     "error": "otp_expired" (if failed)
   }
   ```

## 8. Common Issues in Server Logs

### Issue 1: Token Expired Too Quickly
**Look for**:
- Token generation timestamp
- Token expiration timestamp
- Time difference should be ~1 hour

### Issue 2: Token Not Generated
**Look for**:
- Password reset request event
- Check if `success: false`
- Check error message

### Issue 3: Token Verification Failed
**Look for**:
- Token verification attempt
- Error code: `otp_expired`
- Check if token was already used

## 9. Log File Structure

### Recommended Structure

```
logs/
├── server-logs/
│   ├── network-2024-11-25T10-30-45.har
│   ├── supabase-auth-2024-11-25T10-30-45.json
│   └── collection-summary-2024-11-25T10-30-45.md
├── password-reset-2024-11-25T10-30-45.json (client-side)
└── password-reset-2024-11-25T10-30-45.txt (client-side)
```

## 10. Next Steps

After collecting logs:

1. **Analyze Supabase Auth Logs**:
   - Check token generation time
   - Check token expiration
   - Check verification attempts

2. **Analyze Network Logs**:
   - Check request/response headers
   - Check error responses
   - Check redirect URLs

3. **Compare with Client Logs**:
   - Cross-reference timestamps
   - Identify where flow breaks
   - Check session establishment

4. **Create Issue Report**:
   - Document findings
   - Include log excerpts
   - Propose fixes

## Resources

- [Supabase Auth Logs Documentation](https://supabase.com/docs/guides/auth/auth-helpers)
- [Supabase Edge Functions Logs](https://supabase.com/docs/guides/functions/logs)
- [Browser Network Logs (HAR format)](https://en.wikipedia.org/wiki/HAR_(file_format))

