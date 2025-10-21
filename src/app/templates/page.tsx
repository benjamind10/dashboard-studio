import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function TemplatesPage() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Pre-built dashboard templates for common use cases.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Templates Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This page will contain pre-built dashboard templates for
              manufacturing, IoT monitoring, system metrics, and other common
              scenarios.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
