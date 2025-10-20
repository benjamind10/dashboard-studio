'use client';
import { useEffect } from 'react';
import { useBinding } from '@/hooks/useBinding';
import { widgetLogger } from '@/lib/logger';
import type { Binding } from '@/lib/types';

export interface BindableTextProps {
  binding: Binding;
  style?: React.CSSProperties;
  id?: string;
}

export function BindableText({ binding, style, id }: BindableTextProps) {
  const value = useBinding(binding);

  useEffect(() => {
    // Log when widget mounts
    widgetLogger.debug('BindableText widget mounted', {
      id,
      bindingType: binding.type,
      bindingPath: binding.path,
    });

    return () => {
      // Log when widget unmounts
      widgetLogger.debug('BindableText widget unmounted', { id });
    };
  }, [id, binding.type, binding.path]);

  useEffect(() => {
    // Log when value changes
    if (value !== null && value !== undefined) {
      widgetLogger.debug('BindableText value updated', {
        id,
        value,
        valueType: typeof value,
      });
    } else {
      widgetLogger.warn('BindableText received null/undefined value', {
        id,
        binding: binding.path,
      });
    }
  }, [value, id, binding.path]);

  return (
    <div
      className="rounded bg-white shadow p-4 text-center border border-gray-200"
      style={style}
    >
      <span className="text-xl font-semibold">{String(value ?? '—')}</span>
    </div>
  );
}
