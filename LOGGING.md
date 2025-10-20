# Dashboard Studio Logging Engine

A robust, configurable logging system with real-time controls and category-based filtering.

## Quick Start

### 1. Import the Loggers

```typescript
import {
  mqttLogger, // For MQTT operations
  transformLogger, // For data transformations
  widgetLogger, // For widget lifecycle
  dashboardLogger, // For dashboard operations
  systemLogger, // For system-level events
  logger, // Main logger instance
} from '@/lib/logger';
```

### 2. Basic Usage

```typescript
// Simple logging
mqttLogger.info('Connected to broker', { broker: 'localhost:1884' });
widgetLogger.debug('Widget data updated', { id: 'temp-1', value: 23.5 });
transformLogger.error('Transform failed', { script: 'invalid' }, error);

// With structured data
dashboardLogger.info('Dashboard loaded', {
  componentCount: 7,
  mqttConnected: true,
  loadTime: '1.2s',
});
```

### 3. Log Levels

- `debug()` - Detailed debugging information
- `info()` - General information
- `warn()` - Warning messages
- `error()` - Error events (with optional Error object)

## Configuration

### Quick Controls

```typescript
// Enable/disable console output
logger.enableConsole(true / false);

// Set global log level
logger.setLogLevel('debug' | 'info' | 'warn' | 'error' | 'off');

// Quick presets
logger.enableDebugMode(true); // Show all logs
logger.enableProductionMode(); // Only errors, no console

// Category-specific controls
logger.enableMqttLogging(true); // Verbose MQTT logging
logger.setCategoryConfig('widget', { enabled: false }); // Disable widget logs
```

### UI Controls

The dashboard includes a floating logging control panel:

1. **Logging Control Panel** (bottom-right) - Full logging configuration
2. **Quick Controls** (top-right) - Common toggle actions

## Real-World Examples

### In React Components

```typescript
export function MyWidget({ id }: { id: string }) {
  useEffect(() => {
    widgetLogger.info('Widget mounted', { id, type: 'temperature' });

    return () => {
      widgetLogger.debug('Widget unmounted', { id });
    };
  }, [id]);

  const handleError = (error: Error) => {
    widgetLogger.error(
      'Widget operation failed',
      {
        id,
        operation: 'fetchData',
      },
      error
    );
  };
}
```

### In Data Processing

```typescript
async function processData(data: unknown) {
  transformLogger.debug('Starting data transform', { inputType: typeof data });

  try {
    const result = transform(data);
    transformLogger.info('Transform completed', {
      inputSize: JSON.stringify(data).length,
      outputType: typeof result,
    });
    return result;
  } catch (error) {
    transformLogger.error('Transform failed', { data }, error as Error);
    throw error;
  }
}
```

### In MQTT Operations

```typescript
// Already integrated in useMqttBinding hook
mqttLogger.info('Subscribing to topic', { topic: 'sensors/temp' });
mqttLogger.debug('Message received', { topic, value, format: 'json' });
mqttLogger.error('Connection failed', { broker: 'localhost:1884' }, error);
```

## Viewing Logs

### Live Logging Control Panel

Click the 📋 button in the bottom-right corner to:

- **Toggle Categories**: Enable/disable mqtt, transform, widget, dashboard, system logs
- **Set Log Levels**: Control verbosity per category
- **View Live Logs**: See real-time log entries with filtering
- **Quick Actions**: Debug mode, production mode, clear logs

### Programmatic Access

```typescript
// Get all logs
const logs = logger.getLogs();

// Get specific category
const mqttLogs = logger.getLogs({ category: 'mqtt' });

// Get errors only
const errors = logger.getLogs({ level: 'error' });

// Get recent logs
const recent = logger.getLogs({ limit: 50 });

// Listen to new logs
const unsubscribe = logger.onLog((entry) => {
  console.log('New log:', entry);
});
```

## Environment Configuration

```typescript
// Different configs for different environments
if (process.env.NODE_ENV === 'production') {
  logger.enableProductionMode();
} else {
  logger.enableDebugMode(true);
}

// Debug mode via URL parameter
if (window.location.search.includes('debug=true')) {
  logger.enableDebugMode(true);
}
```

## Current Integration

The logging system is already integrated into:

- ✅ **MQTT Client** (`useMqttBinding.ts`) - Connection, subscription, message logging
- ✅ **Transform Engine** (`transformEngine.ts`) - Script execution errors
- ✅ **Widgets** (`BindableText.tsx`) - Lifecycle and value change logging
- ✅ **UI Controls** (`LoggingControl.tsx`) - Real-time log viewing and configuration

## Log Categories

| Category    | Purpose                | Default Level |
| ----------- | ---------------------- | ------------- |
| `mqtt`      | MQTT client operations | `info`        |
| `transform` | Data transformation    | `warn`        |
| `widget`    | Widget lifecycle       | `warn`        |
| `dashboard` | Dashboard operations   | `info`        |
| `system`    | System-level events    | `error`       |

## Performance Notes

- Logs are stored in memory with configurable limits (default: 1000 entries)
- Console output can be disabled for production
- Category filtering prevents unnecessary log processing
- Structured data logging for better debugging

## Tips

1. **Use appropriate log levels** - Don't log everything at `info` level
2. **Include context** - Always provide relevant data with your logs
3. **Use category loggers** - They're pre-configured for common use cases
4. **Monitor in production** - Use the logging panel to debug live issues
5. **Structure your data** - Use objects instead of string concatenation

## Troubleshooting

**No logs appearing?**

- Check if the category is enabled in the logging control panel
- Verify the log level is appropriate
- Ensure console output is enabled

**Too many logs?**

- Increase the global log level to `warn` or `error`
- Disable specific categories you don't need
- Use production mode for cleaner output

**Performance issues?**

- Disable console output in production
- Reduce storage limits
- Use higher log levels to reduce volume
