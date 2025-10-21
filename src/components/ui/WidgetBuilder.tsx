'use client';
import { useState } from 'react';
import type { DashboardComponent, DataFormat } from '@/lib/types';
import { TransformBuilder } from '@/lib/transformEngine';

interface WidgetBuilderProps {
  onAddWidget: (widget: DashboardComponent) => void;
  onClose: () => void;
}

export function WidgetBuilder({ onAddWidget, onClose }: WidgetBuilderProps) {
  const [widgetData, setWidgetData] = useState({
    title: '',
    type: 'text',
    mqttTopic: 'Acme/Site/Area/Line 24/Edge/Infeed',
    format: 'json' as DataFormat,
    transform: 'extractValue',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let transform;
    switch (widgetData.transform) {
      case 'extractValue':
        transform = TransformBuilder.extractValue();
        break;
      case 'toNumber':
        transform = TransformBuilder.chain(
          TransformBuilder.extractValue(),
          TransformBuilder.toNumber()
        );
        break;
      case 'custom':
        transform = TransformBuilder.script('return data;');
        break;
      default:
        transform = TransformBuilder.extractValue();
    }

    const newWidget: DashboardComponent = {
      id: `widget-${Date.now()}`,
      type: widgetData.type,
      title: widgetData.title || 'Untitled Widget',
      binding: {
        type: 'mqtt',
        path: widgetData.mqttTopic,
        format: widgetData.format,
        transform,
      },
      position: { x: 0, y: 0 },
    };

    onAddWidget(newWidget);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add Widget
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Widget Title
            </label>
            <input
              type="text"
              value={widgetData.title}
              onChange={(e) =>
                setWidgetData({ ...widgetData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter widget title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Widget Type
            </label>
            <select
              value={widgetData.type}
              onChange={(e) =>
                setWidgetData({ ...widgetData, type: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="text">Text</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              MQTT Topic
            </label>
            <input
              type="text"
              value={widgetData.mqttTopic}
              onChange={(e) =>
                setWidgetData({ ...widgetData, mqttTopic: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Acme/Site/Area/Line 24/Edge/Infeed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data Format
            </label>
            <select
              value={widgetData.format}
              onChange={(e) =>
                setWidgetData({
                  ...widgetData,
                  format: e.target.value as DataFormat,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="json">JSON</option>
              <option value="text">Text</option>
              <option value="number">Number</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data Transform
            </label>
            <select
              value={widgetData.transform}
              onChange={(e) =>
                setWidgetData({ ...widgetData, transform: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="extractValue">Extract Value</option>
              <option value="toNumber">
                Extract Value & Convert to Number
              </option>
              <option value="custom">Custom Script</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Widget
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
