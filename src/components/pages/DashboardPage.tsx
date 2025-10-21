'use client';
import { useState } from 'react';
import { GridCanvas } from '../layout/GridCanvas';
import type { DashboardComponent } from '@/lib/types';
import { TransformBuilder } from '@/lib/transformEngine';

export default function SampleDashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [components, setComponents] = useState<DashboardComponent[]>([
    // Infeed data - extract raw value
    {
      id: 'infeed-raw',
      type: 'text',
      title: 'Infeed (Raw)',
      binding: {
        type: 'mqtt',
        path: 'Acme/Site/Area/Line 24/Edge/Infeed',
        format: 'json',
        transform: TransformBuilder.extractValue(),
      },
      position: { x: 0, y: 0 },
    },

    // Outfeed data - extract and format as number
    {
      id: 'outfeed-number',
      type: 'text',
      title: 'Outfeed (Number)',
      binding: {
        type: 'mqtt',
        path: 'Acme/Site/Area/Line 24/Edge/Outfeed',
        format: 'json',
        transform: TransformBuilder.chain(
          TransformBuilder.extractValue(),
          TransformBuilder.toNumber()
        ),
      },
      position: { x: 1, y: 0 },
    },

    // Waste data - extract raw value
    {
      id: 'waste-raw',
      type: 'text',
      title: 'Waste (Raw)',
      binding: {
        type: 'mqtt',
        path: 'Acme/Site/Area/Line 24/Edge/Waste',
        format: 'json',
        transform: TransformBuilder.extractValue(),
      },
      position: { x: 2, y: 0 },
    },

    // Infeed with custom formatting
    {
      id: 'infeed-formatted',
      type: 'text',
      title: 'Infeed (Formatted)',
      binding: {
        type: 'mqtt',
        path: 'Acme/Site/Area/Line 24/Edge/Infeed',
        format: 'json',
        transform: TransformBuilder.script(`
          const value = toNumber(extractValue(data));
          return 'Infeed: ' + value.toFixed(2);
        `),
      },
      position: { x: 3, y: 0 },
    },

    // Show raw JSON for debugging
    {
      id: 'infeed-debug',
      type: 'text',
      title: 'Debug (Raw JSON)',
      binding: {
        type: 'mqtt',
        path: 'Acme/Site/Area/Line 24/Edge/Infeed',
        format: 'text', // Keep as raw text to see the actual message structure
      },
      position: { x: 0, y: 1 },
    },

    // Outfeed formatted
    {
      id: 'outfeed-formatted',
      type: 'text',
      title: 'Outfeed (Formatted)',
      binding: {
        type: 'mqtt',
        path: 'Acme/Site/Area/Line 24/Edge/Outfeed',
        format: 'json',
        transform: TransformBuilder.script(`
          const value = toNumber(extractValue(data));
          return 'Outfeed: ' + value.toFixed(2);
        `),
      },
      position: { x: 1, y: 1 },
    },

    // Waste formatted
    {
      id: 'waste-formatted',
      type: 'text',
      title: 'Waste (Formatted)',
      binding: {
        type: 'mqtt',
        path: 'Acme/Site/Area/Line 24/Edge/Waste',
        format: 'json',
        transform: TransformBuilder.script(`
          const value = toNumber(extractValue(data));
          return 'Waste: ' + value.toFixed(2);
        `),
      },
      position: { x: 2, y: 1 },
    },
  ]);
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Sample Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Testing MQTT connectivity and data transforms with live data from{' '}
          <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm text-gray-800 dark:text-gray-200">
            Acme/Site/Area/Line 24/Edge/*
          </code>
        </p>
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
            🔧 Testing Features:
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Raw value extraction from MQTT JSON messages</li>
            <li>• Number formatting and type conversion</li>
            <li>• Custom script transforms</li>
            <li>• Debug view showing raw message format</li>
            <li>• Real-time data updates</li>
          </ul>
        </div>
      </div>
      <GridCanvas components={components} />
    </div>
  );
}
