import { useMqttBinding } from './useMqttBinding';
import { TransformEngine } from '@/lib/transformEngine';
import type { Binding } from '@/lib/types';

export function useBinding<TInput = unknown, TOutput = TInput>(
  binding: Binding<TInput, TOutput>
): TOutput | null {
  // Prepare all hooks at the top
  const mqttValue = useMqttBinding(
    binding.type === 'mqtt' ? binding.path : '',
    binding.format || 'text'
  );

  // Return based on type — NO conditional hook calls
  switch (binding.type) {
    case 'mqtt':
      const rawValue = mqttValue as TInput;

      // Apply transform if provided
      if (binding.transform) {
        // Handle legacy function transforms and new transform system
        if (typeof binding.transform === 'function') {
          return binding.transform(rawValue);
        } else {
          // Use new transform engine
          return TransformEngine.apply(rawValue, binding.transform) as TOutput;
        }
      }

      return rawValue as unknown as TOutput;
    default:
      return null;
  }
}
