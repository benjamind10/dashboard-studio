'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { systemLogger } from '@/lib/logger';

interface BrokerConfig {
  host: string;
  port: number;
  protocol: 'ws' | 'wss' | 'mqtt' | 'mqtts';
  username?: string;
  password?: string;
  clientId?: string;
  reconnectPeriod: number;
  connectTimeout: number;
}

export default function BrokerConfigPage() {
  const [config, setConfig] = useState<BrokerConfig>({
    host: 'localhost',
    port: 1884,
    protocol: 'ws',
    clientId: `dashboard-${Math.random().toString(36).substr(2, 9)}`,
    reconnectPeriod: 2000,
    connectTimeout: 5000,
  });

  const [isConnected, setIsConnected] = useState(false);

  const handleSave = () => {
    systemLogger.info('Broker configuration saved', config);
    // TODO: Implement actual save functionality
    alert('Configuration saved! (TODO: Implement actual save)');
  };

  const handleTestConnection = () => {
    systemLogger.info('Testing broker connection', {
      host: config.host,
      port: config.port,
    });
    // TODO: Implement actual connection test
    setIsConnected(!isConnected);
  };

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Configure your MQTT broker connection settings for real-time data
              streaming.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Connection Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Connection Settings
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Broker Host
                  </label>
                  <input
                    type="text"
                    value={config.host}
                    onChange={(e) =>
                      setConfig({ ...config, host: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="localhost"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Port
                  </label>
                  <input
                    type="number"
                    value={config.port}
                    onChange={(e) =>
                      setConfig({ ...config, port: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Protocol
                  </label>
                  <select
                    value={config.protocol}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        protocol: e.target.value as BrokerConfig['protocol'],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ws">WebSocket (ws://)</option>
                    <option value="wss">Secure WebSocket (wss://)</option>
                    <option value="mqtt">MQTT (mqtt://)</option>
                    <option value="mqtts">Secure MQTT (mqtts://)</option>
                  </select>
                </div>
              </div>

              {/* Authentication */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Authentication
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username (optional)
                  </label>
                  <input
                    type="text"
                    value={config.username || ''}
                    onChange={(e) =>
                      setConfig({ ...config, username: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password (optional)
                  </label>
                  <input
                    type="password"
                    value={config.password || ''}
                    onChange={(e) =>
                      setConfig({ ...config, password: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Client ID
                  </label>
                  <input
                    type="text"
                    value={config.clientId || ''}
                    onChange={(e) =>
                      setConfig({ ...config, clientId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Advanced Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reconnect Period (ms)
                    </label>
                    <input
                      type="number"
                      value={config.reconnectPeriod}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          reconnectPeriod: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Connect Timeout (ms)
                    </label>
                    <input
                      type="number"
                      value={config.connectTimeout}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          connectTimeout: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex space-x-4">
              <button
                onClick={handleTestConnection}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  isConnected
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isConnected ? '✅ Connected' : 'Test Connection'}
              </button>

              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 font-medium transition-colors"
              >
                Save Configuration
              </button>
            </div>

            {/* Connection String Preview */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Connection String:
              </h4>
              <code className="text-sm text-gray-600 dark:text-gray-300">
                {config.protocol}://{config.host}:{config.port}
              </code>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
