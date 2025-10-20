import { useMqttBinding } from './useMqttBinding';
import type { Binding } from '@/lib/types';

export function useBinding<TInput = unknown, TOutput = TInput>(
  binding: Binding<TInput, TOutput>
): TOutput | null {
  // Prepare all hooks at the top
  const mqttValue = useMqttBinding(binding.type === 'mqtt' ? binding.path : '');

  // Return based on type — NO conditional hook calls
  switch (binding.type) {
    case 'mqtt':
      return mqttValue as TOutput;
    default:
      return null;
  }
}
