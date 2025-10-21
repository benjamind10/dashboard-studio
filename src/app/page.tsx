import { DashboardLayout } from '@/components/layout/DashboardLayout';
import Link from 'next/link';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Dashboard Studio
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Build powerful, real-time dashboards with MQTT data integration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <Link
              href="/dashboard"
              className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                Dashboard
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create and manage your production dashboards
              </p>
            </Link>

            <Link
              href="/sample"
              className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-3">🧪</div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                Sample Dashboard
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Test MQTT connectivity and explore features
              </p>
            </Link>

            <Link
              href="/config/broker"
              className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-3">🔌</div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                Broker Config
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure your MQTT broker connection
              </p>
            </Link>

            <Link
              href="/config/user"
              className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-3">👤</div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                User Config
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your preferences and settings
              </p>
            </Link>
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-base font-semibold text-blue-900 dark:text-blue-300 mb-2">
              🚀 Quick Start
            </h3>
            <p className="text-blue-800 dark:text-blue-300 mb-4 text-sm">
              Get started by configuring your MQTT broker, then create your
              first dashboard!
            </p>
            <div className="flex justify-center space-x-3">
              <Link
                href="/config/broker"
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Configure Broker
              </Link>
              <Link
                href="/sample"
                className="px-3 py-1.5 border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 text-sm rounded hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors"
              >
                Try Sample
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
