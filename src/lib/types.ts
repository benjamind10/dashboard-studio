export type BindingSourceType =
  | 'mqtt'
  | 'rest'
  | 'local'
  | 'mock'
  | 'websocket'
  | 'db';

/**
 * Generic binding interface.
 * @template TInput The data type received from the source (e.g., string, object)
 * @template TOutput The type after transformation (e.g., number, string, object)
 */
export interface Binding<TInput = unknown, TOutput = TInput> {
  type: BindingSourceType;
  path: string;
  transform?: (payload: TInput) => TOutput;
}

export interface DashboardComponent<TInput = unknown, TOutput = TInput> {
  id: string;
  type: string;
  binding?: Binding<TInput, TOutput>;
  position?: { x: number; y: number };
}
