import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function TemplatesPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Templates
            </h1>
            <p className="text-gray-600 mt-2">
              Pre-built dashboard templates for common use cases.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Templates Coming Soon
            </h3>
            <p className="text-gray-600">
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
