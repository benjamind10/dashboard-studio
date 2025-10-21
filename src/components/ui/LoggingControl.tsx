'use client';
import { useState, useEffect } from 'react';
import { logger, type LogLevel, type LogEntry } from '@/lib/logger';

export function LoggingControl() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState(logger.getConfig());
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<LogLevel>('debug');

  useEffect(() => {
    const unsubscribe = logger.onLog(() => {
      setLogs(logger.getLogs({ limit: 100 }));
    });

    // Initial load
    setLogs(logger.getLogs({ limit: 100 }));

    return unsubscribe;
  }, []);

  const updateConfig = () => {
    setConfig(logger.getConfig());
  };

  const handleGlobalLevelChange = (level: LogLevel) => {
    logger.setLogLevel(level);
    updateConfig();
  };

  const handleConsoleToggle = (enabled: boolean) => {
    logger.enableConsole(enabled);
    updateConfig();
  };

  const handleStorageToggle = (enabled: boolean) => {
    logger.enableStorage(enabled);
    updateConfig();
  };

  const handleCategoryToggle = (category: string, enabled: boolean) => {
    const categoryConfig = config.categories[category] || { enabled: false };
    logger.setCategoryConfig(category, { ...categoryConfig, enabled });
    updateConfig();
  };

  const handleCategoryLevelChange = (category: string, level: LogLevel) => {
    const categoryConfig = config.categories[category] || { enabled: true };
    logger.setCategoryConfig(category, { ...categoryConfig, level });
    updateConfig();
  };

  const clearLogs = () => {
    logger.clearLogs();
    setLogs([]);
  };

  const enableDebugMode = () => {
    logger.enableDebugMode(true);
    updateConfig();
  };

  const enableProductionMode = () => {
    logger.enableProductionMode();
    updateConfig();
  };

  const filteredLogs = logs.filter((log) => {
    if (selectedCategory !== 'all' && log.category !== selectedCategory) {
      return false;
    }
    const levelPriority = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
      off: 4,
    };
    return levelPriority[log.level] >= levelPriority[selectedLevel];
  });

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 dark:bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors z-50"
        title="Open Logging Control"
      >
        📋
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-[420px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Logging Control
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          ✕
        </button>
      </div>

      {/* Controls */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 space-y-5 overflow-hidden flex-shrink-0">
        {/* Quick Actions */}
        <div className="flex space-x-2">
          <button
            onClick={enableDebugMode}
            className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
          >
            Debug Mode
          </button>
          <button
            onClick={enableProductionMode}
            className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800"
          >
            Production Mode
          </button>
          <button
            onClick={clearLogs}
            className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Clear Logs
          </button>
        </div>

        {/* Global Settings */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Global Level:
            </label>
            <select
              value={config.level}
              onChange={(e) =>
                handleGlobalLevelChange(e.target.value as LogLevel)
              }
              className="text-xs border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-2 py-1"
            >
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warn</option>
              <option value="error">Error</option>
              <option value="off">Off</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Console Output:
            </label>
            <input
              type="checkbox"
              checked={config.enableConsole}
              onChange={(e) => handleConsoleToggle(e.target.checked)}
              className="rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Store Logs:
            </label>
            <input
              type="checkbox"
              checked={config.enableStorage}
              onChange={(e) => handleStorageToggle(e.target.checked)}
              className="rounded"
            />
          </div>
        </div>

        {/* Category Settings */}
        <div className="space-y-2 overflow-hidden">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Categories:
          </h4>
          <div className="space-y-1">
            {Object.entries(config.categories).map(
              ([category, categoryConfig]) => (
                <div
                  key={category}
                  className="flex items-center justify-between text-xs gap-3 min-h-[24px]"
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={categoryConfig.enabled}
                      onChange={(e) =>
                        handleCategoryToggle(category, e.target.checked)
                      }
                      className="rounded flex-shrink-0 w-3 h-3"
                    />
                    <span className="capitalize truncate text-sm text-gray-900 dark:text-white">
                      {category}
                    </span>
                  </div>
                  <select
                    value={categoryConfig.level || config.level}
                    onChange={(e) =>
                      handleCategoryLevelChange(
                        category,
                        e.target.value as LogLevel
                      )
                    }
                    className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-2 py-1 text-xs flex-shrink-0 min-w-[80px]"
                    disabled={!categoryConfig.enabled}
                  >
                    <option value="debug">Debug</option>
                    <option value="info">Info</option>
                    <option value="warn">Warn</option>
                    <option value="error">Error</option>
                  </select>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Log Viewer */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-2 py-1 flex-1"
          >
            <option value="all">All Categories</option>
            {Object.keys(config.categories).map((category) => (
              <option key={category} value={category} className="capitalize">
                {category}
              </option>
            ))}
          </select>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as LogLevel)}
            className="text-xs border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-2 py-1"
          >
            <option value="debug">Debug+</option>
            <option value="info">Info+</option>
            <option value="warn">Warn+</option>
            <option value="error">Error</option>
          </select>
        </div>

        <div className="flex-1 overflow-auto p-2 text-xs space-y-1 font-mono min-h-[200px]">
          {filteredLogs.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400 text-center py-4">
              No logs to display
            </div>
          ) : (
            filteredLogs.slice(-20).map((log, index) => {
              const dataStr = log.data
                ? (() => {
                    try {
                      return JSON.stringify(log.data);
                    } catch {
                      return String(log.data);
                    }
                  })()
                : '';

              return (
                <div
                  key={index}
                  className={`p-1 rounded text-xs ${
                    log.level === 'error'
                      ? 'bg-red-50 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                      : log.level === 'warn'
                      ? 'bg-yellow-50 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300'
                      : log.level === 'info'
                      ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                      : 'bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-300'
                  }`}
                >
                  <div className="font-medium">
                    [{new Date(log.timestamp).toLocaleTimeString()}] [
                    {log.category.toUpperCase()}] [{log.level.toUpperCase()}]
                  </div>
                  <div>{log.message}</div>
                  {log.data !== undefined && log.data !== null && (
                    <div className="text-gray-600 dark:text-gray-400 mt-1 text-xs">
                      Data: {dataStr.substring(0, 100)}
                      {dataStr.length > 100 && '...'}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
