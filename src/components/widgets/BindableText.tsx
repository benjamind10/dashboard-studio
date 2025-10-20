'use client';
import { useBinding } from '@/hooks/useBinding';
import type { Binding } from '@/lib/types';

export interface BindableTextProps {
  binding: Binding;
  style?: React.CSSProperties;
}

export function BindableText({ binding, style }: BindableTextProps) {
  const value = useBinding(binding);

  return (
    <div
      className="rounded bg-white shadow p-4 text-center border border-gray-200"
      style={style}
    >
      <span className="text-xl font-semibold">{String(value ?? '—')}</span>
    </div>
  );
}
