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
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              User Configuration
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your personal preferences and application settings.
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) =>
                      setConfig({ ...config, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={config.email}
                    onChange={(e) =>
                      setConfig({ ...config, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@company.com"
                  />
                </div>
              </div>
            </div>

            {/* Appearance Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Appearance
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark (Coming Soon)</option>
                </select>
              </div>
            </div>

            {/* Application Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Application Settings
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Auto Save
                    </label>
                    <p className="text-sm text-gray-500">
                      Automatically save dashboard changes
                    </p>
                  </div>
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
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Notifications
                    </label>
                    <p className="text-sm text-gray-500">
                      Show system notifications for errors and updates
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notifications}
                    onChange={(e) =>
                      setConfig({ ...config, notifications: e.target.checked })
                    }
                    className="rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="debug">Debug (Show all logs)</option>
                    <option value="info">Info (Normal logging)</option>
                    <option value="warn">
                      Warning (Important messages only)
                    </option>
                    <option value="error">Error (Errors only)</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Controls how much logging information is displayed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dashboard Refresh Rate (ms)
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
                    className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    How often widgets refresh their data (1000ms = 1 second)
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
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
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
