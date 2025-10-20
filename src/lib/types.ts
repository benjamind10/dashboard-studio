export type BindingSourceType =
  | 'mqtt'
  | 'rest'
  | 'local'
  | 'mock'
  | 'websocket'
  | 'db';

export type DataFormat = 'json' | 'text' | 'number';

// Transform types for different transformation approaches
export type TransformType = 'function' | 'script' | 'preset' | 'chain';

export interface TransformPreset {
  type: 'preset';
  preset:
    | 'extractValue'
    | 'extractPath'
    | 'toNumber'
    | 'toString'
    | 'toBoolean';
  params?: Record<string, unknown>; // Parameters for the preset (e.g., path for extractPath)
}

export interface TransformFunction {
  type: 'function';
  fn: (data: unknown) => unknown;
}

export interface TransformScript {
  type: 'script';
  code: string; // JavaScript code to execute
  context?: Record<string, unknown>; // Additional context variables
}

export interface TransformChain {
  type: 'chain';
  transforms: Transform[]; // Array of transforms to apply in sequence
}

export type Transform =
  | TransformPreset
  | TransformFunction
  | TransformScript
  | TransformChain;

/**
 * Generic binding interface.
 * @template TInput The data type received from the source (e.g., string, object)
 * @template TOutput The type after transformation (e.g., number, string, object)
 */
export interface Binding<TInput = unknown, TOutput = TInput> {
  type: BindingSourceType;
  path: string;
  format?: DataFormat; // How to parse the incoming data
  transform?: Transform | ((payload: TInput) => TOutput); // Legacy function support + new transform system
}

// Common data structures for MQTT messages
export interface MqttValue {
  value: unknown;
  timestamp?: string;
  quality?: string;
}

export interface DashboardComponent<TInput = unknown, TOutput = TInput> {
  id: string;
  type: string;
  title?: string; // Optional title for the widget
  binding?: Binding<TInput, TOutput>;
  position?: { x: number; y: number };
}

// Legacy DataExtractors - kept for backward compatibility
// Use TransformBuilder for new implementations
export const DataExtractors = {
  // Extract the "value" property from an object
  extractValue: (data: unknown) => {
    if (data && typeof data === 'object' && 'value' in data) {
      return (data as MqttValue).value;
    }
    return data;
  },

  // Extract a nested property using dot notation
  extractPath: (path: string) => (data: unknown) => {
    return path.split('.').reduce((current: unknown, key: string) => {
      if (current && typeof current === 'object' && key in current) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, data);
  },

  // Convert to number
  toNumber: (data: unknown) => {
    const num = Number(data);
    return isNaN(num) ? 0 : num;
  },
};
