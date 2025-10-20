import { TransformBuilder } from './transformEngine';
import type { Transform } from './types';

/**
 * Transform Templates - Pre-built transforms for common use cases
 */
export const TransformTemplates = {
  // Data extraction templates
  extractValue: () => TransformBuilder.extractValue(),
  extractPath: (path: string) => TransformBuilder.extractPath(path),

  // Type conversion templates
  asNumber: () => TransformBuilder.toNumber(),
  asString: () => TransformBuilder.toString(),
  asBoolean: () => TransformBuilder.toBoolean(),

  // Common IoT/MQTT patterns
  extractMqttValue: () => TransformBuilder.extractValue(),
  extractTimestamp: () => TransformBuilder.extractPath('timestamp'),
  extractQuality: () => TransformBuilder.extractPath('quality'),

  // Temperature conversions
  celsiusToFahrenheit: () =>
    TransformBuilder.script(`
    const celsius = toNumber(extractValue(data));
    return Math.round((celsius * 9/5) + 32) + '°F';
  `),

  fahrenheitToCelsius: () =>
    TransformBuilder.script(`
    const fahrenheit = toNumber(extractValue(data));
    return Math.round((fahrenheit - 32) * 5/9) + '°C';
  `),

  // Status formatting
  formatStatus: () =>
    TransformBuilder.script(`
    const status = extractValue(data);
    switch(toString(status).toLowerCase()) {
      case 'online': case 'running': case 'active':
        return '🟢 Online';
      case 'offline': case 'stopped': case 'inactive':
        return '🔴 Offline';
      case 'warning': case 'degraded':
        return '🟡 Warning';
      default:
        return '⚪ Unknown';
    }
  `),

  // Alert level formatting
  formatAlertLevel: () =>
    TransformBuilder.script(`
    const level = toString(extractValue(data)).toLowerCase();
    const icons = { critical: '🔴', warning: '🟡', info: '🔵', success: '🟢' };
    return (icons[level] || '⚪') + ' ' + level.charAt(0).toUpperCase() + level.slice(1);
  `),

  // Number formatting
  formatPercent: (decimals = 1) =>
    TransformBuilder.script(`
    const value = toNumber(extractValue(data));
    return value.toFixed(${decimals}) + '%';
  `),

  formatCurrency: (currency = 'USD') =>
    TransformBuilder.script(`
    const value = toNumber(extractValue(data));
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: '${currency}' 
    }).format(value);
  `),

  // Date/time formatting
  formatDateTime: () =>
    TransformBuilder.script(`
    const timestamp = extractValue(data) || extractPath(data, 'timestamp');
    return new Date(timestamp).toLocaleString();
  `),

  formatTimeAgo: () =>
    TransformBuilder.script(`
    const timestamp = extractValue(data) || extractPath(data, 'timestamp');
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return diffDays + 'd ago';
    if (diffHours > 0) return diffHours + 'h ago';
    if (diffMins > 0) return diffMins + 'm ago';
    return 'Just now';
  `),

  // Mathematical operations
  multiply: (factor: number) =>
    TransformBuilder.script(`
    const value = toNumber(extractValue(data));
    return value * ${factor};
  `),

  divide: (divisor: number) =>
    TransformBuilder.script(`
    const value = toNumber(extractValue(data));
    return value / ${divisor};
  `),

  roundTo: (decimals: number) =>
    TransformBuilder.script(`
    const value = toNumber(extractValue(data));
    return Math.round(value * Math.pow(10, ${decimals})) / Math.pow(10, ${decimals});
  `),

  // Conditional transforms
  threshold: (threshold: number, aboveText = 'High', belowText = 'Low') =>
    TransformBuilder.script(`
    const value = toNumber(extractValue(data));
    return value >= ${threshold} ? '${aboveText}' : '${belowText}';
  `),

  range: (
    min: number,
    max: number,
    lowText = 'Low',
    normalText = 'Normal',
    highText = 'High'
  ) =>
    TransformBuilder.script(`
    const value = toNumber(extractValue(data));
    if (value < ${min}) return '${lowText}';
    if (value > ${max}) return '${highText}';
    return '${normalText}';
  `),
};

/**
 * Transform Validator - Validates transform configurations
 */
export class TransformValidator {
  static validate(transform: Transform): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      switch (transform.type) {
        case 'preset':
          if (!transform.preset) {
            errors.push('Preset transform requires a preset type');
          }
          if (transform.preset === 'extractPath' && !transform.params?.path) {
            errors.push('extractPath preset requires a path parameter');
          }
          break;

        case 'script':
          if (!transform.code || transform.code.trim() === '') {
            errors.push('Script transform requires code');
          }
          // Could add more script validation here
          break;

        case 'chain':
          if (!transform.transforms || transform.transforms.length === 0) {
            errors.push('Chain transform requires at least one transform');
          } else {
            // Validate each transform in the chain
            transform.transforms.forEach((t, index) => {
              const result = this.validate(t);
              if (!result.valid) {
                errors.push(
                  `Chain transform ${index + 1}: ${result.errors.join(', ')}`
                );
              }
            });
          }
          break;

        case 'function':
          if (!transform.fn || typeof transform.fn !== 'function') {
            errors.push('Function transform requires a valid function');
          }
          break;
      }
    } catch (error) {
      errors.push(`Validation error: ${error}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static test(transform: Transform): {
    success: boolean;
    result?: unknown;
    error?: string;
  } {
    try {
      const validation = this.validate(transform);
      if (!validation.valid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      // Note: Test functionality would require TransformEngine
      // This is a placeholder for now to avoid circular dependencies
      return { success: true, result: 'Test not implemented yet' };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }
}
