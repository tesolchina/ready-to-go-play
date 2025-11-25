/**
 * Export Password Reset Logs to Repository
 * 
 * This utility helps export logs from localStorage to the logs/ directory
 * for easy commit to the repository.
 * 
 * Usage in browser console:
 *   exportLogsToRepo()
 * 
 * Or with custom filename:
 *   exportLogsToRepo('my-debug-session')
 */

import { passwordResetLogger } from './passwordResetLogger';

/**
 * Export logs to a downloadable file that can be saved to logs/ directory
 * @param filename Optional custom filename (without extension)
 */
export function exportLogsToRepo(filename?: string): void {
  const logs = passwordResetLogger.getLogs();
  
  if (logs.length === 0) {
    console.warn('[exportLogsToRepo] No logs found. Make sure you have performed a password reset flow.');
    return;
  }

  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const baseFilename = filename || `password-reset-${timestamp}`;
  
  // Create comprehensive log data
  const logData = {
    exportedAt: new Date().toISOString(),
    exportedBy: 'exportLogsToRepo',
    environment: {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    },
    summary: {
      totalEntries: logs.length,
      errorCount: logs.filter(log => log.level === 'error').length,
      warnCount: logs.filter(log => log.level === 'warn').length,
      infoCount: logs.filter(log => log.level === 'info').length,
      debugCount: logs.filter(log => log.level === 'debug').length,
      components: [...new Set(logs.map(log => log.component))],
      functions: [...new Set(logs.map(log => log.function))],
    },
    logs: logs,
  };

  // Export as JSON
  const jsonBlob = new Blob([JSON.stringify(logData, null, 2)], {
    type: 'application/json',
  });
  const jsonUrl = URL.createObjectURL(jsonBlob);
  const jsonLink = document.createElement('a');
  jsonLink.href = jsonUrl;
  jsonLink.download = `${baseFilename}.json`;
  document.body.appendChild(jsonLink);
  jsonLink.click();
  document.body.removeChild(jsonLink);
  URL.revokeObjectURL(jsonUrl);

  // Export as text
  const textLines = [
    '='.repeat(80),
    'Password Reset Debug Logs',
    '='.repeat(80),
    `Exported: ${logData.exportedAt}`,
    `Environment: ${logData.environment.userAgent}`,
    `URL: ${logData.environment.url}`,
    '',
    'Summary:',
    `  Total Entries: ${logData.summary.totalEntries}`,
    `  Errors: ${logData.summary.errorCount}`,
    `  Warnings: ${logData.summary.warnCount}`,
    `  Info: ${logData.summary.infoCount}`,
    `  Debug: ${logData.summary.debugCount}`,
    `  Components: ${logData.summary.components.join(', ')}`,
    `  Functions: ${logData.summary.functions.join(', ')}`,
    '',
    '='.repeat(80),
    'Log Entries',
    '='.repeat(80),
    '',
    ...logs.map((log) => {
      const dataStr = log.data 
        ? `\n  Data: ${JSON.stringify(log.data, null, 2).split('\n').map(line => '    ' + line).join('\n')}`
        : '';
      return `[${log.timestamp}] [${log.level.toUpperCase()}] [${log.component}] [${log.function}]\n  ${log.message}${dataStr}`;
    }),
  ];

  const textBlob = new Blob([textLines.join('\n')], { type: 'text/plain' });
  const textUrl = URL.createObjectURL(textBlob);
  const textLink = document.createElement('a');
  textLink.href = textUrl;
  textLink.download = `${baseFilename}.txt`;
  document.body.appendChild(textLink);
  textLink.click();
  document.body.removeChild(textLink);
  URL.revokeObjectURL(textUrl);

  console.log(`[exportLogsToRepo] Exported ${logs.length} log entries`);
  console.log(`[exportLogsToRepo] Files downloaded: ${baseFilename}.json and ${baseFilename}.txt`);
  console.log(`[exportLogsToRepo] Next steps:`);
  console.log(`  1. Move files to logs/ directory`);
  console.log(`  2. git add logs/${baseFilename}.*`);
  console.log(`  3. git commit -m "Add password reset debug logs: ${baseFilename}"`);
  console.log(`  4. git push`);
}

// Make it available globally
if (typeof window !== 'undefined') {
  (window as any).exportLogsToRepo = exportLogsToRepo;
}

