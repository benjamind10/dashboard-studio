'use client';
import { useState } from 'react';
import { GridCanvas } from '../layout/GridCanvas';
import { WidgetBuilder } from '../ui/WidgetBuilder';
import type { DashboardComponent } from '@/lib/types';

export default function Dashboard() {
  const [components, setComponents] = useState<DashboardComponent[]>([]);
  const [showWidgetBuilder, setShowWidgetBuilder] = useState(false);
  const [moveMode, setMoveMode] = useState(false);

  const addWidget = (widget: DashboardComponent) => {
    setComponents([...components, widget]);
  };

  const updateComponents = (newComponents: DashboardComponent[]) => {
    setComponents(newComponents);
  };

  const openWidgetBuilder = () => {
    setShowWidgetBuilder(true);
  };

  const toggleMoveMode = () => {
    setMoveMode(!moveMode);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* Compact action bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Real-time production monitoring
            </div>
            <div className="flex space-x-2">
              <button
                onClick={openWidgetBuilder}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                + Widget
              </button>
              <button
                onClick={toggleMoveMode}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  moveMode
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {moveMode ? '✋ Exit Move' : '↔️ Move'}
              </button>
              <button className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                ⚙️
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {components.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 max-w-sm mx-auto">
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                Empty Dashboard
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Add widgets to start monitoring
              </p>
              <button
                onClick={openWidgetBuilder}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Add Your First Widget
              </button>
            </div>
          </div>
        ) : (
          <GridCanvas
            components={components}
            onComponentUpdate={moveMode ? updateComponents : undefined}
            showGrid={moveMode}
          />
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
