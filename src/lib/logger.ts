export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'off';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: unknown;
  stack?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableStorage: boolean;
  maxStorageEntries: number;
  categories: {
    [category: string]: {
      enabled: boolean;
      level?: LogLevel;
    };
  };
}

class Logger {
  private config: LoggerConfig = {
    level: 'info',
    enableConsole: true,
    enableStorage: true,
    maxStorageEntries: 1000,
    categories: {
      mqtt: { enabled: true, level: 'info' },
      transform: { enabled: true, level: 'warn' },
      widget: { enabled: true, level: 'warn' },
      dashboard: { enabled: true, level: 'info' },
      system: { enabled: true, level: 'error' },
    },
  };

  private storage: LogEntry[] = [];
  private listeners: ((entry: LogEntry) => void)[] = [];

  private readonly levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    off: 4,
  };

  // Configuration methods
  setConfig(config: Partial<LoggerConfig>) {
    this.config = { ...this.config, ...config };
    if (config.categories) {
      this.config.categories = {
        ...this.config.categories,
        ...config.categories,
      };
    }
  }

  setLogLevel(level: LogLevel) {
    this.config.level = level;
  }

  enableConsole(enabled: boolean) {
    this.config.enableConsole = enabled;
  }

  enableStorage(enabled: boolean) {
    this.config.enableStorage = enabled;
  }

  setCategoryConfig(
    category: string,
    config: { enabled: boolean; level?: LogLevel }
  ) {
    this.config.categories[category] = config;
  }

  // Logging methods
  debug(category: string, message: string, data?: unknown) {
    this.log('debug', category, message, data);
  }

  info(category: string, message: string, data?: unknown) {
    this.log('info', category, message, data);
  }

  warn(category: string, message: string, data?: unknown) {
    this.log('warn', category, message, data);
  }

  error(category: string, message: string, data?: unknown, error?: Error) {
    this.log('error', category, message, data, error?.stack);
  }

  private log(
    level: LogLevel,
    category: string,
    message: string,
    data?: unknown,
    stack?: string
  ) {
    // Check if logging is disabled globally
    if (this.config.level === 'off') return;

    // Check category configuration
    const categoryConfig = this.config.categories[category];
    if (categoryConfig && !categoryConfig.enabled) return;

    // Check level priority
    const globalLevelPriority = this.levelPriority[this.config.level];
    const categoryLevelPriority = categoryConfig?.level
      ? this.levelPriority[categoryConfig.level]
      : globalLevelPriority;
    const currentLevelPriority = this.levelPriority[level];

    if (
      currentLevelPriority <
      Math.min(globalLevelPriority, categoryLevelPriority)
    ) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      stack,
    };

    // Store entry
    if (this.config.enableStorage) {
      this.storage.push(entry);

      // Maintain max storage entries
      if (this.storage.length > this.config.maxStorageEntries) {
        this.storage.shift();
      }
    }

    // Console output
    if (this.config.enableConsole) {
      this.outputToConsole(entry);
    }

    // Notify listeners
    this.listeners.forEach((listener) => listener(entry));
  }

  private outputToConsole(entry: LogEntry) {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const prefix = `[${timestamp}] [${entry.category.toUpperCase()}]`;

    const consoleMethod =
      entry.level === 'debug'
        ? 'log'
        : entry.level === 'info'
        ? 'info'
        : entry.level === 'warn'
        ? 'warn'
        : 'error';

    if (entry.data !== undefined) {
      console[consoleMethod](`${prefix} ${entry.message}`, entry.data);
    } else {
      console[consoleMethod](`${prefix} ${entry.message}`);
    }

    if (entry.stack) {
      console.error(entry.stack);
    }
  }

  // Query methods
  getLogs(options?: {
    category?: string;
    level?: LogLevel;
    limit?: number;
    since?: Date;
  }): LogEntry[] {
    let filtered = [...this.storage];

    if (options?.category) {
      filtered = filtered.filter(
        (entry) => entry.category === options.category
      );
    }

    if (options?.level) {
      const targetPriority = this.levelPriority[options.level];
      filtered = filtered.filter(
        (entry) => this.levelPriority[entry.level] >= targetPriority
      );
    }

    if (options?.since) {
      filtered = filtered.filter(
        (entry) => new Date(entry.timestamp) >= options.since!
      );
    }

    if (options?.limit) {
      filtered = filtered.slice(-options.limit);
    }

    return filtered;
  }

  getCategories(): string[] {
    return Object.keys(this.config.categories);
  }

  getConfig(): LoggerConfig {
    return { ...this.config };
  }

  clearLogs() {
    this.storage = [];
  }

  // Event listeners
  onLog(listener: (entry: LogEntry) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Utility methods for quick configuration
  enableMqttLogging(enabled: boolean) {
    this.setCategoryConfig('mqtt', {
      enabled,
      level: enabled ? 'debug' : 'off',
    });
  }

  enableDebugMode(enabled: boolean) {
    if (enabled) {
      this.setLogLevel('debug');
      this.enableConsole(true);
      Object.keys(this.config.categories).forEach((category) => {
        this.setCategoryConfig(category, { enabled: true, level: 'debug' });
      });
    } else {
      this.setLogLevel('warn');
      Object.keys(this.config.categories).forEach((category) => {
        this.setCategoryConfig(category, { enabled: true, level: 'warn' });
      });
    }
  }

  enableProductionMode() {
    this.setLogLevel('error');
    this.enableConsole(false);
    this.enableStorage(true);
    Object.keys(this.config.categories).forEach((category) => {
      this.setCategoryConfig(category, { enabled: true, level: 'error' });
    });
  }
}

// Create singleton instance
export const logger = new Logger();

// Export convenience functions for common categories
export const mqttLogger = {
  debug: (message: string, data?: unknown) =>
    logger.debug('mqtt', message, data),
  info: (message: string, data?: unknown) => logger.info('mqtt', message, data),
  warn: (message: string, data?: unknown) => logger.warn('mqtt', message, data),
  error: (message: string, data?: unknown, error?: Error) =>
    logger.error('mqtt', message, data, error),
};

export const transformLogger = {
  debug: (message: string, data?: unknown) =>
    logger.debug('transform', message, data),
  info: (message: string, data?: unknown) =>
    logger.info('transform', message, data),
  warn: (message: string, data?: unknown) =>
    logger.warn('transform', message, data),
  error: (message: string, data?: unknown, error?: Error) =>
    logger.error('transform', message, data, error),
};

export const widgetLogger = {
  debug: (message: string, data?: unknown) =>
    logger.debug('widget', message, data),
  info: (message: string, data?: unknown) =>
    logger.info('widget', message, data),
  warn: (message: string, data?: unknown) =>
    logger.warn('widget', message, data),
  error: (message: string, data?: unknown, error?: Error) =>
    logger.error('widget', message, data, error),
};

export const dashboardLogger = {
  debug: (message: string, data?: unknown) =>
    logger.debug('dashboard', message, data),
  info: (message: string, data?: unknown) =>
    logger.info('dashboard', message, data),
  warn: (message: string, data?: unknown) =>
    logger.warn('dashboard', message, data),
  error: (message: string, data?: unknown, error?: Error) =>
    logger.error('dashboard', message, data, error),
};

export const systemLogger = {
  debug: (message: string, data?: unknown) =>
    logger.debug('system', message, data),
  info: (message: string, data?: unknown) =>
    logger.info('system', message, data),
  warn: (message: string, data?: unknown) =>
    logger.warn('system', message, data),
  error: (message: string, data?: unknown, error?: Error) =>
    logger.error('system', message, data, error),
};
