import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function WidgetsPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Widget Library</h1>
            <p className="text-gray-600 mt-2">
              Browse and manage available dashboard widgets.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">🧩</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Widget Library Coming Soon
            </h3>
            <p className="text-gray-600">
              This page will contain a library of available widgets including
              charts, gauges, tables, and custom components for your dashboards.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
