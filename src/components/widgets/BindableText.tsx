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
      className="rounded bg-white dark:bg-gray-800 shadow p-4 text-center border border-gray-200 dark:border-gray-700"
      style={style}
    >
      <span className="text-xl font-semibold text-gray-900 dark:text-white">
        {String(value ?? '—')}
      </span>
    </div>
  );
}
