type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

class Logger {
  private activeLevel: LogLevel = 'DEBUG';

  setLevel(level: LogLevel) {
    this.activeLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
    return levels.indexOf(level) >= levels.indexOf(this.activeLevel);
  }

  debug(tag: string, message: string, data?: any) {
    if (this.shouldLog('DEBUG')) {
      console.log(`[DEBUG][${tag}] ${message}`, data ? data : '');
    }
  }

  info(tag: string, message: string, data?: any) {
    if (this.shouldLog('INFO')) {
      console.info(`[INFO][${tag}] ${message}`, data ? data : '');
    }
  }

  warn(tag: string, message: string, data?: any) {
    if (this.shouldLog('WARN')) {
      console.warn(`[WARN][${tag}] ${message}`, data ? data : '');
    }
  }

  error(tag: string, message: string, error?: any) {
    if (this.shouldLog('ERROR')) {
      console.error(`[ERROR][${tag}] ${message}`, error ? error : '');
    }
  }
}

export const logger = new Logger();
