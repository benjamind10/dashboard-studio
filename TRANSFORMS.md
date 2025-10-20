# Transform System Documentation

## Overview

The Dashboard Studio now features a powerful and flexible transform system that allows you to manipulate data from various sources before displaying it in widgets. The system supports multiple types of transformations that can be chained together for complex data processing.

## Transform Types

### 1. Preset Transforms

Pre-built, commonly used transformations:

```typescript
import { TransformBuilder } from '@/lib/transformEngine';

// Extract "value" property from objects
TransformBuilder.extractValue();

// Extract nested property using dot notation
TransformBuilder.extractPath('sensor.temperature');

// Type conversions
TransformBuilder.toNumber();
TransformBuilder.toString();
TransformBuilder.toBoolean();
```

### 2. Script Transforms

Custom JavaScript code for complex transformations:

```typescript
TransformBuilder.script(`
  const temp = extractValue(data);
  const celsius = toNumber(temp);
  const fahrenheit = (celsius * 9/5) + 32;
  return Math.round(fahrenheit) + '°F';
`);
```

Available utility functions in scripts:

- `extractValue(obj)` - Extract "value" property
- `extractPath(obj, 'path.to.prop')` - Extract nested property
- `toNumber(val)` - Convert to number
- `toString(val)` - Convert to string
- `toBoolean(val)` - Convert to boolean
- `Math`, `Date`, `JSON` - Standard JavaScript objects

### 3. Function Transforms

Direct JavaScript functions:

```typescript
TransformBuilder.function((data) => {
  return (data as any).value * 2;
});
```

### 4. Chain Transforms

Combine multiple transforms in sequence:

```typescript
TransformBuilder.chain(
  TransformBuilder.extractValue(),
  TransformBuilder.toNumber(),
  TransformBuilder.script('data * 1.5')
);
```

## Transform Templates

Pre-built templates for common use cases:

```typescript
import { TransformTemplates } from '@/lib/transformTemplates';

// IoT/MQTT patterns
TransformTemplates.extractMqttValue();
TransformTemplates.extractTimestamp();
TransformTemplates.extractQuality();

// Temperature conversions
TransformTemplates.celsiusToFahrenheit();
TransformTemplates.fahrenheitToCelsius();

// Status formatting
TransformTemplates.formatStatus(); // 🟢 Online, 🔴 Offline, etc.
TransformTemplates.formatAlertLevel(); // 🔴 Critical, 🟡 Warning, etc.

// Number formatting
TransformTemplates.formatPercent(2); // 45.67%
TransformTemplates.formatCurrency('USD'); // $123.45

// Date/time formatting
TransformTemplates.formatDateTime(); // 10/20/2025, 3:45:12 PM
TransformTemplates.formatTimeAgo(); // 5m ago, 2h ago, etc.

// Mathematical operations
TransformTemplates.multiply(2); // Multiply by 2
TransformTemplates.divide(10); // Divide by 10
TransformTemplates.roundTo(2); // Round to 2 decimal places

// Conditional transforms
TransformTemplates.threshold(100, 'High', 'Low');
TransformTemplates.range(0, 100, 'Low', 'Normal', 'High');
```

## Usage Examples

### Basic Value Extraction

```typescript
{
  id: 'temperature',
  type: 'text',
  binding: {
    type: 'mqtt',
    path: 'sensors/temp',
    format: 'json',
    transform: TransformTemplates.extractMqttValue()
  }
}
```

### Temperature Conversion

```typescript
{
  id: 'temp-display',
  type: 'text',
  binding: {
    type: 'mqtt',
    path: 'sensors/temp',
    format: 'json',
    transform: TransformTemplates.celsiusToFahrenheit()
  }
}
```

### Complex Custom Transform

```typescript
{
  id: 'flow-rate',
  type: 'text',
  binding: {
    type: 'mqtt',
    path: 'sensors/flow',
    format: 'json',
    transform: TransformBuilder.script(`
      const flowRate = toNumber(extractValue(data));
      const hourlyVolume = flowRate * 60;

      if (hourlyVolume > 1000) {
        return (hourlyVolume / 1000).toFixed(1) + ' kL/h';
      }
      return hourlyVolume.toFixed(0) + ' L/h';
    `)
  }
}
```

### Chained Transforms

```typescript
{
  id: 'processed-value',
  type: 'text',
  binding: {
    type: 'mqtt',
    path: 'sensors/pressure',
    format: 'json',
    transform: TransformBuilder.chain(
      TransformTemplates.extractMqttValue(),
      TransformTemplates.asNumber(),
      TransformTemplates.multiply(1.5),
      TransformTemplates.roundTo(2)
    )
  }
}
```

### Conditional Status Display

```typescript
{
  id: 'status-indicator',
  type: 'text',
  binding: {
    type: 'mqtt',
    path: 'devices/pump',
    format: 'json',
    transform: TransformBuilder.script(`
      const status = toString(extractValue(data)).toLowerCase();

      switch(status) {
        case 'running':
          return '🟢 Running';
        case 'stopped':
          return '🔴 Stopped';
        case 'maintenance':
          return '🟡 Maintenance';
        default:
          return '⚪ Unknown';
      }
    `)
  }
}
```

## Data Formats

Configure how incoming data is parsed:

- `'json'` - Parse as JSON object
- `'text'` - Keep as string
- `'number'` - Convert to number

```typescript
binding: {
  type: 'mqtt',
  path: 'sensors/temp',
  format: 'json', // Parse JSON first
  transform: TransformTemplates.extractMqttValue() // Then extract value
}
```

## Error Handling

Transforms are designed to be resilient:

- Script errors return original data
- Invalid extractions return undefined
- Type conversions have sensible defaults (0 for numbers, '' for strings)

## Validation

Use the validator to check transform configurations:

```typescript
import { TransformValidator } from '@/lib/transformTemplates';

const result = TransformValidator.validate(transform);
if (!result.valid) {
  console.log('Errors:', result.errors);
}
```

## Best Practices

1. **Use Templates First**: Check if a template exists before writing custom scripts
2. **Chain Simple Operations**: Break complex transforms into simple, chainable steps
3. **Handle Errors**: Always consider what happens with unexpected data
4. **Test Transforms**: Use console.log in scripts during development
5. **Document Complex Scripts**: Add comments for future maintenance

## Migration from Legacy

The old `DataExtractors` are still supported but deprecated:

```typescript
// Old way (still works)
transform: DataExtractors.extractValue;

// New way (recommended)
transform: TransformTemplates.extractMqttValue();
```

## Future Extensions

The transform system is designed to be extensible:

- Add new preset types
- Create domain-specific templates
- Integrate with external validation libraries
- Support for async transforms (planned)
