'use client';
import { logger } from '@/lib/logger';

export function LoggingQuickControls() {
  const toggleMqttLogging = () => {
    const config = logger.getConfig();
    const isEnabled = config.categories.mqtt?.enabled ?? false;
    logger.enableMqttLogging(!isEnabled);
  };

  const toggleConsoleOutput = () => {
    const config = logger.getConfig();
    logger.enableConsole(!config.enableConsole);
  };

  const enableDebugMode = () => {
    logger.enableDebugMode(true);
  };

  const enableProductionMode = () => {
    logger.enableProductionMode();
  };

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-40">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">
        Quick Logging Controls
      </h3>
      <div className="space-y-2">
        <button
          onClick={toggleMqttLogging}
          className="w-full px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
        >
          Toggle MQTT Logging
        </button>
        <button
          onClick={toggleConsoleOutput}
          className="w-full px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
        >
          Toggle Console Output
        </button>
        <button
          onClick={enableDebugMode}
          className="w-full px-3 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
        >
          Enable Debug Mode
        </button>
        <button
          onClick={enableProductionMode}
          className="w-full px-3 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
        >
          Production Mode
        </button>
      </div>
    </div>
  );
}
