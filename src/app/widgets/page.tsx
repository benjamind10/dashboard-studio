import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function WidgetsPage() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Browse and manage available dashboard widgets.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="text-6xl mb-4">🧩</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Widget Library Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This page will contain a library of available widgets including
              charts, gauges, tables, and custom components for your dashboards.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
