/**
 * Password Reset Debug Logger
 * 
 * Logs password reset flow events to:
 * 1. Browser console
 * 2. localStorage (for persistence)
 * 3. Downloadable log files
 */

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  component: string;
  function: string;
  message: string;
  data?: any;
}

const LOG_STORAGE_KEY = 'password_reset_logs';
const MAX_LOG_ENTRIES = 500;

class PasswordResetLogger {
  private logs: LogEntry[] = [];

  constructor() {
    // Load existing logs from localStorage
    this.loadLogs();
  }

  private loadLogs() {
    try {
      const stored = localStorage.getItem(LOG_STORAGE_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.error('[PasswordResetLogger] Failed to load logs:', error);
    }
  }

  private saveLogs() {
    try {
      // Keep only last MAX_LOG_ENTRIES entries
      if (this.logs.length > MAX_LOG_ENTRIES) {
        this.logs = this.logs.slice(-MAX_LOG_ENTRIES);
      }
      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.error('[PasswordResetLogger] Failed to save logs:', error);
    }
  }

  private addLog(
    level: LogEntry['level'],
    component: string,
    functionName: string,
    message: string,
    data?: any
  ) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      component,
      function: functionName,
      message,
      data: data ? JSON.parse(JSON.stringify(data)) : undefined, // Deep clone to avoid reference issues
    };

    this.logs.push(entry);
    this.saveLogs();

    // Also log to console with appropriate level
    const consoleMessage = `[${entry.timestamp}] [${component}] [${functionName}] ${message}`;
    const consoleData = data ? { data } : {};

    switch (level) {
      case 'error':
        console.error(consoleMessage, consoleData);
        break;
      case 'warn':
        console.warn(consoleMessage, consoleData);
        break;
      case 'debug':
        console.debug(consoleMessage, consoleData);
        break;
      default:
        console.log(consoleMessage, consoleData);
    }
  }

  info(component: string, functionName: string, message: string, data?: any) {
    this.addLog('info', component, functionName, message, data);
  }

  warn(component: string, functionName: string, message: string, data?: any) {
    this.addLog('warn', component, functionName, message, data);
  }

  error(component: string, functionName: string, message: string, data?: any) {
    this.addLog('error', component, functionName, message, data);
  }

  debug(component: string, functionName: string, message: string, data?: any) {
    this.addLog('debug', component, functionName, message, data);
  }

  /**
   * Export logs as downloadable JSON file
   */
  exportLogs(): void {
    const logData = {
      exportedAt: new Date().toISOString(),
      totalEntries: this.logs.length,
      logs: this.logs,
    };

    const blob = new Blob([JSON.stringify(logData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `password-reset-logs-${new Date().toISOString().replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Export logs as readable text file
   */
  exportLogsAsText(): void {
    const lines = this.logs.map((log) => {
      const dataStr = log.data ? `\n  Data: ${JSON.stringify(log.data, null, 2)}` : '';
      return `[${log.timestamp}] [${log.level.toUpperCase()}] [${log.component}] [${log.function}]\n  ${log.message}${dataStr}`;
    });

    const content = [
      `Password Reset Debug Logs`,
      `Exported: ${new Date().toISOString()}`,
      `Total Entries: ${this.logs.length}`,
      `\n${'='.repeat(80)}\n`,
      ...lines,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `password-reset-logs-${new Date().toISOString().replace(/:/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
    localStorage.removeItem(LOG_STORAGE_KEY);
    console.log('[PasswordResetLogger] Logs cleared');
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs filtered by component or function
   */
  getLogsBy(component?: string, functionName?: string): LogEntry[] {
    return this.logs.filter((log) => {
      if (component && log.component !== component) return false;
      if (functionName && log.function !== functionName) return false;
      return true;
    });
  }
}

// Export singleton instance
export const passwordResetLogger = new PasswordResetLogger();

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).passwordResetLogger = passwordResetLogger;
  
  // Dynamically import exportLogsToRepo to avoid circular dependencies
  import('./exportLogsToRepo').then((module) => {
    (window as any).exportLogsToRepo = module.exportLogsToRepo;
  }).catch(() => {
    // Silently fail if module not available
  });
}

