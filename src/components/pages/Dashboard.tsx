'use client';
import { useState } from 'react';
import { GridCanvas } from '../layout/GridCanvas';
import { WidgetBuilder } from '../ui/WidgetBuilder';
import type { DashboardComponent } from '@/lib/types';

export default function Dashboard() {
  const [components, setComponents] = useState<DashboardComponent[]>([]);
  const [showWidgetBuilder, setShowWidgetBuilder] = useState(false);

  const addWidget = (widget: DashboardComponent) => {
    setComponents([...components, widget]);
  };

  const openWidgetBuilder = () => {
    setShowWidgetBuilder(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">
                Real-time production monitoring
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={openWidgetBuilder}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Widget
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {components.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Empty Dashboard
              </h3>
              <p className="text-gray-600 mb-4">
                Start building your dashboard by adding widgets
              </p>
              <button
                onClick={openWidgetBuilder}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Widget
              </button>
            </div>
          </div>
        ) : (
          <GridCanvas components={components} />
        )}
      </div>

      {showWidgetBuilder && (
        <WidgetBuilder
          onAddWidget={addWidget}
          onClose={() => setShowWidgetBuilder(false)}
        />
      )}
    </div>
  );
}
