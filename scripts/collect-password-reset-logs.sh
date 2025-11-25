#!/bin/bash
# Automated Password Reset Log Collection Script
# Based on docs/guides/SERVER_LOG_EXTRACTION.md

LOG_DIR="logs/server-logs"
TIMESTAMP=$(date +"%Y-%m-%dT%H-%M-%S")
mkdir -p "$LOG_DIR"

echo "======================================================================"
echo "Password Reset Log Collection Script"
echo "======================================================================"
echo "Timestamp: $TIMESTAMP"
echo ""

# Create collection summary
cat > "$LOG_DIR/collection-summary-$TIMESTAMP.md" << EOF
# Password Reset Log Collection Summary

**Collected**: $TIMESTAMP

## Sources to Collect

### 1. Browser Network Logs
- **Status**: ⏳ Manual step required
- **Location**: \`network-$TIMESTAMP.har\`
- **Instructions**:
  1. Open DevTools → Network tab
  2. Filter: \`supabase.co/auth\`
  3. Perform password reset flow
  4. Right-click → "Save all as HAR with content"
  5. Save to: \`$LOG_DIR/network-$TIMESTAMP.har\`

### 2. Supabase Auth Logs
- **Status**: ⏳ Manual step required
- **Location**: \`supabase-auth-$TIMESTAMP.json\`
- **Instructions**:
  1. Open Lovable Cloud backend (click "View Backend" button)
  2. Go to Logs section
  3. Filter by "password_reset" events
  4. Export logs
  5. Save to: \`$LOG_DIR/supabase-auth-$TIMESTAMP.json\`

### 3. Client-side Logs
- **Status**: ⏳ Manual step required
- **Location**: Exported from browser console
- **Instructions**:
  1. Open browser console on /auth page
  2. Run: \`exportLogsToRepo('password-reset-$TIMESTAMP')\`
  3. Move downloaded files to \`logs/\` directory

## Analysis Checklist

- [ ] Check token generation timestamp in Supabase logs
- [ ] Check token expiration time (should be ~1 hour)
- [ ] Verify email was sent successfully
- [ ] Check token verification attempts
- [ ] Look for "otp_expired" errors
- [ ] Compare timestamps between client and server logs
- [ ] Check for session establishment after clicking link
- [ ] Verify redirect URLs in network requests

## Common Issues to Check

### Issue: Token Expired Too Quickly
- Check token generation vs expiration timestamps
- Should be ~1 hour difference
- Look in Supabase auth logs

### Issue: Token Not Generated
- Check password reset request success in auth logs
- Look for error messages in response

### Issue: Token Verification Failed
- Check if token was already used
- Verify token format in URL
- Check for timing issues (clock skew)

### Issue: Session Not Established
- Check for access_token in URL hash after clicking link
- Verify session creation in client logs
- Look for PASSWORD_RECOVERY event

## Error URL Details

If you encountered an error URL like:
\`\`\`
/auth?reset=true#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired
\`\`\`

**Key information to gather**:
- When was the reset requested? (check Supabase logs)
- When was the link clicked? (check browser logs)
- Time difference between request and click
- Was the token already used? (check for previous verification attempts)

## Next Steps

After collecting all logs:

1. **Analyze the logs**:
   \`\`\`bash
   # Search for errors across all log files
   grep -r "error" $LOG_DIR/
   grep -r "otp_expired" $LOG_DIR/
   \`\`\`

2. **Compare timestamps**:
   - Token generation time (Supabase)
   - Link clicked time (browser)
   - Token verification time (Supabase)

3. **Document findings**:
   - Add notes to this file about what you discovered
   - Update the debugging plan with new insights

4. **Commit logs** (if needed for sharing):
   \`\`\`bash
   git add logs/
   git commit -m "Add password reset debug logs: $TIMESTAMP"
   \`\`\`

## Notes

Add any observations or findings here:

EOF

echo "✓ Collection summary created: $LOG_DIR/collection-summary-$TIMESTAMP.md"
echo ""
echo "======================================================================"
echo "Next Steps:"
echo "======================================================================"
echo ""
echo "1. Open browser and navigate to /auth page"
echo "   - Open DevTools (F12) → Network tab"
echo "   - Enable 'Preserve log'"
echo "   - Clear network log"
echo ""
echo "2. Perform password reset flow:"
echo "   - Request password reset"
echo "   - Check email"
echo "   - Click reset link"
echo ""
echo "3. Export Browser Network Logs:"
echo "   - Right-click in Network tab"
echo "   - Select 'Save all as HAR with content'"
echo "   - Save to: $LOG_DIR/network-$TIMESTAMP.har"
echo ""
echo "4. Export Supabase Auth Logs:"
echo "   - Use 'View Backend' button in Lovable"
echo "   - Go to Logs → Filter: 'password_reset'"
echo "   - Export and save to: $LOG_DIR/supabase-auth-$TIMESTAMP.json"
echo ""
echo "5. Export Client-side Logs:"
echo "   - In browser console, run:"
echo "   - exportLogsToRepo('password-reset-$TIMESTAMP')"
echo "   - Move files to logs/ directory"
echo ""
echo "6. Review collection summary:"
echo "   - Open: $LOG_DIR/collection-summary-$TIMESTAMP.md"
echo "   - Follow analysis checklist"
echo ""
echo "======================================================================"
