import { DashboardLayout } from '@/components/layout/DashboardLayout';
import Link from 'next/link';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Dashboard Studio
            </h1>
            <p className="text-xl text-gray-600">
              Build powerful, real-time dashboards with MQTT data integration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <Link
              href="/dashboard"
              className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Dashboard
              </h3>
              <p className="text-gray-600">
                Create and manage your production dashboards
              </p>
            </Link>

            <Link
              href="/sample"
              className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">🧪</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sample Dashboard
              </h3>
              <p className="text-gray-600">
                Test MQTT connectivity and explore features
              </p>
            </Link>

            <Link
              href="/config/broker"
              className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">🔌</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Broker Config
              </h3>
              <p className="text-gray-600">
                Configure your MQTT broker connection
              </p>
            </Link>

            <Link
              href="/config/user"
              className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                User Config
              </h3>
              <p className="text-gray-600">
                Manage your preferences and settings
              </p>
            </Link>
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🚀 Quick Start
            </h3>
            <p className="text-blue-800 mb-4">
              Get started by configuring your MQTT broker, then create your
              first dashboard!
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/config/broker"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Configure Broker
              </Link>
              <Link
                href="/sample"
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
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
