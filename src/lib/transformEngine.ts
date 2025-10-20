import type {
  Transform,
  TransformPreset,
  TransformScript,
  TransformChain,
  TransformFunction,
  MqttValue,
} from './types';
import { transformLogger } from './logger';

/**
 * Transform Engine - Handles all types of data transformations
 */
export class TransformEngine {
  /**
   * Apply a transform to data
   */
  static apply(data: unknown, transform: Transform): unknown {
    switch (transform.type) {
      case 'preset':
        return this.applyPreset(data, transform);
      case 'function':
        return transform.fn(data);
      case 'script':
        return this.applyScript(data, transform);
      case 'chain':
        return this.applyChain(data, transform);
      default:
        return data;
    }
  }

  /**
   * Apply a preset transformation
   */
  private static applyPreset(
    data: unknown,
    transform: TransformPreset
  ): unknown {
    const { preset, params = {} } = transform;

    switch (preset) {
      case 'extractValue':
        return this.extractValue(data);

      case 'extractPath':
        const path = params.path as string;
        if (!path)
          throw new Error('extractPath preset requires a "path" parameter');
        return this.extractPath(data, path);

      case 'toNumber':
        return this.toNumber(data);

      case 'toString':
        return this.toString(data);

      case 'toBoolean':
        return this.toBoolean(data);

      default:
        throw new Error(`Unknown preset: ${preset}`);
    }
  }

  /**
   * Apply script transformation (safe eval)
   */
  private static applyScript(
    data: unknown,
    transform: TransformScript
  ): unknown {
    const { code, context = {} } = transform;

    try {
      // Create a safe execution context
      const safeContext = {
        data,
        ...context,
        // Utility functions available in scripts
        extractValue: (obj: unknown) => this.extractValue(obj),
        extractPath: (obj: unknown, path: string) =>
          this.extractPath(obj, path),
        toNumber: (val: unknown) => this.toNumber(val),
        toString: (val: unknown) => this.toString(val),
        toBoolean: (val: unknown) => this.toBoolean(val),
        Math,
        Date,
        JSON,
      };

      // Create function from code - handle both expressions and statements
      let functionBody: string;

      // Check if the code is a simple expression or contains statements
      const trimmedCode = code.trim();
      if (
        trimmedCode.includes(';') ||
        trimmedCode.includes('const ') ||
        trimmedCode.includes('let ') ||
        trimmedCode.includes('var ')
      ) {
        // It's a block of statements, use as-is
        functionBody = code;
      } else {
        // It's a simple expression, wrap with return
        functionBody = `return ${code}`;
      }

      const fn = new Function(...Object.keys(safeContext), functionBody);
      return fn(...Object.values(safeContext));
    } catch (error) {
      transformLogger.error(
        'Transform script execution failed',
        {
          code,
          data,
          error: (error as Error).message,
        },
        error as Error
      );
      return data; // Return original data on error
    }
  }

  /**
   * Apply chain of transformations
   */
  private static applyChain(data: unknown, transform: TransformChain): unknown {
    return transform.transforms.reduce(
      (result, t) => this.apply(result, t),
      data
    );
  }

  /**
   * Extract "value" property from an object
   */
  private static extractValue(data: unknown): unknown {
    if (data && typeof data === 'object' && 'value' in data) {
      return (data as MqttValue).value;
    }
    return data;
  }

  /**
   * Extract nested property using dot notation
   */
  private static extractPath(data: unknown, path: string): unknown {
    return path.split('.').reduce((current: unknown, key: string) => {
      if (current && typeof current === 'object' && key in current) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, data);
  }

  /**
   * Convert to number
   */
  private static toNumber(data: unknown): number {
    const num = Number(data);
    return isNaN(num) ? 0 : num;
  }

  /**
   * Convert to string
   */
  private static toString(data: unknown): string {
    if (data === null || data === undefined) return '';
    return String(data);
  }

  /**
   * Convert to boolean
   */
  private static toBoolean(data: unknown): boolean {
    if (typeof data === 'boolean') return data;
    if (typeof data === 'string') return data.toLowerCase() === 'true';
    if (typeof data === 'number') return data !== 0;
    return Boolean(data);
  }
}

/**
 * Transform Builder - Helper to create transforms declaratively
 */
export class TransformBuilder {
  static extractValue(): TransformPreset {
    return { type: 'preset', preset: 'extractValue' };
  }

  static extractPath(path: string): TransformPreset {
    return { type: 'preset', preset: 'extractPath', params: { path } };
  }

  static toNumber(): TransformPreset {
    return { type: 'preset', preset: 'toNumber' };
  }

  static toString(): TransformPreset {
    return { type: 'preset', preset: 'toString' };
  }

  static toBoolean(): TransformPreset {
    return { type: 'preset', preset: 'toBoolean' };
  }

  static script(
    code: string,
    context?: Record<string, unknown>
  ): TransformScript {
    return { type: 'script', code, context };
  }

  static chain(...transforms: Transform[]): TransformChain {
    return { type: 'chain', transforms };
  }

  static function(fn: (data: unknown) => unknown): TransformFunction {
    return { type: 'function', fn };
  }
}
