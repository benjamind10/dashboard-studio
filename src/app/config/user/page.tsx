'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { logger } from '@/lib/logger';

interface UserConfig {
  name: string;
  email: string;
  theme: 'light' | 'dark';
  autoSave: boolean;
  notifications: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  dashboardRefreshRate: number;
}

export default function UserConfigPage() {
  const [config, setConfig] = useState<UserConfig>({
    name: '',
    email: '',
    theme: 'light',
    autoSave: true,
    notifications: true,
    logLevel: 'info',
    dashboardRefreshRate: 1000,
  });

  const handleSave = () => {
    // Apply logging configuration immediately
    logger.setLogLevel(config.logLevel);

    console.log('User configuration saved:', config);
    alert('Configuration saved!');
  };

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Manage your personal preferences and application settings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Profile Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Profile Settings
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) =>
                      setConfig({ ...config, name: e.target.value })
                    }
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={config.email}
                    onChange={(e) =>
                      setConfig({ ...config, email: e.target.value })
                    }
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="your.email@company.com"
                  />
                </div>
              </div>
            </div>

            {/* Application Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Application Settings
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Theme
                    </label>
                    <select
                      value={config.theme}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          theme: e.target.value as UserConfig['theme'],
                        })
                      }
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Log Level
                    </label>
                    <select
                      value={config.logLevel}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          logLevel: e.target.value as UserConfig['logLevel'],
                        })
                      }
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="debug">Debug</option>
                      <option value="info">Info</option>
                      <option value="warn">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Refresh Rate (ms)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    step="100"
                    value={config.dashboardRefreshRate}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        dashboardRefreshRate: parseInt(e.target.value),
                      })
                    }
                    className="w-full max-w-32 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Auto Save
                  </label>
                  <input
                    type="checkbox"
                    checked={config.autoSave}
                    onChange={(e) =>
                      setConfig({ ...config, autoSave: e.target.checked })
                    }
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notifications
                  </label>
                  <input
                    type="checkbox"
                    checked={config.notifications}
                    onChange={(e) =>
                      setConfig({ ...config, notifications: e.target.checked })
                    }
                    className="rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-3 mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 font-medium transition-colors"
            >
              Save Configuration
            </button>

            <button
              onClick={() =>
                setConfig({
                  name: '',
                  email: '',
                  theme: 'light',
                  autoSave: true,
                  notifications: true,
                  logLevel: 'info',
                  dashboardRefreshRate: 1000,
                })
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
