'use client';
import { useState } from 'react';
import { GridCanvas } from '../layout/GridCanvas';
import type { DashboardComponent } from '@/lib/types';

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [components, setComponents] = useState<DashboardComponent[]>([
    {
      id: 'text-1',
      type: 'text',
      binding: { type: 'mqtt', path: 'Acme/Site/Area/Line 24/Edge/Infeed' },
      position: { x: 0, y: 0 },
    },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Studio</h1>
      <GridCanvas components={components} />
    </div>
  );
}
