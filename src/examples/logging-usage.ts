// Example: How to Use the Logging Engine
// This file demonstrates all the ways to use the robust logging system

import {
  logger,
  mqttLogger,
  transformLogger,
  widgetLogger,
  dashboardLogger,
  systemLogger,
} from '@/lib/logger';

// ==========================================
// 1. CATEGORY-SPECIFIC LOGGERS (RECOMMENDED)
// ==========================================

// Use these pre-configured loggers for different parts of your app:

// MQTT-related logging
mqttLogger.info('Connected to broker', { broker: 'ws://localhost:1884' });
mqttLogger.debug('Received message', { topic: 'sensors/temp', value: 23.5 });
mqttLogger.warn('Connection unstable', { reconnectAttempts: 3 });
mqttLogger.error(
  'Failed to subscribe',
  { topic: 'invalid/topic' },
  new Error('Invalid topic')
);

// Transform/data processing logging
transformLogger.debug('Applying transform', {
  type: 'extractValue',
  input: { value: 42 },
});
transformLogger.info('Transform completed', { result: 42, duration: '2ms' });
transformLogger.error(
  'Transform failed',
  { script: 'invalid code', input: 'data' },
  new Error('Syntax error')
);

// Widget-related logging
widgetLogger.info('Widget mounted', { widgetId: 'temp-gauge', type: 'gauge' });
widgetLogger.warn('Widget data missing', {
  widgetId: 'pressure-chart',
  binding: 'mqtt://sensors/pressure',
});
widgetLogger.error(
  'Widget render error',
  { widgetId: 'flow-rate', props: {} },
  new Error('Missing required prop')
);

// Dashboard-level logging
dashboardLogger.info('Dashboard loaded', {
  componentCount: 7,
  mqttConnected: true,
});
dashboardLogger.debug('Component updated', {
  componentId: 'widget-123',
  newValue: 'active',
});

// System-level logging (errors, startup, shutdown)
systemLogger.info('Application started', {
  version: '1.0.0',
  environment: 'development',
});
systemLogger.error(
  'Critical system error',
  { component: 'mqtt-client', action: 'reconnect' },
  new Error('Connection lost')
);

// ==========================================
// 2. DIRECT LOGGER USAGE
// ==========================================

// You can also use the main logger directly with custom categories:
logger.info('custom-category', 'Custom message', { customData: 'value' });
logger.debug('api', 'API request sent', { url: '/api/data', method: 'GET' });
logger.warn('validation', 'Invalid input detected', {
  field: 'email',
  value: 'invalid@',
});

// ==========================================
// 3. CONFIGURATION EXAMPLES
// ==========================================

// Turn off console output (useful in production)
logger.enableConsole(false);

// Set global log level to only show warnings and errors
logger.setLogLevel('warn');

// Enable debug mode (shows all logs for all categories)
logger.enableDebugMode(true);

// Enable production mode (only errors, no console output)
logger.enableProductionMode();

// Configure specific categories
logger.setCategoryConfig('mqtt', { enabled: true, level: 'debug' });
logger.setCategoryConfig('widget', { enabled: false }); // Disable widget logging

// Quick MQTT logging toggle
logger.enableMqttLogging(true); // Enable verbose MQTT logging
logger.enableMqttLogging(false); // Disable MQTT logging

// ==========================================
// 4. QUERYING LOGS
// ==========================================

// Get all logs
const allLogs = logger.getLogs();

// Get logs from specific category
const mqttLogs = logger.getLogs({ category: 'mqtt' });

// Get only error logs
const errorLogs = logger.getLogs({ level: 'error' });

// Get recent logs (last 50)
const recentLogs = logger.getLogs({ limit: 50 });

// Get logs since a specific time
const recentErrors = logger.getLogs({
  level: 'error',
  since: new Date(Date.now() - 60000), // Last minute
});

// ==========================================
// 5. LISTENING TO LOGS
// ==========================================

// Listen to all log entries in real-time
const unsubscribe = logger.onLog((entry) => {
  console.log('New log entry:', entry);

  // You could send critical errors to an external service
  if (entry.level === 'error' && entry.category === 'system') {
    // sendToErrorTracking(entry);
  }
});

// Clean up listener when component unmounts
// unsubscribe();

// ==========================================
// 6. PRACTICAL USAGE PATTERNS
// ==========================================

// In a React component:
export function MyComponent() {
  useEffect(() => {
    widgetLogger.debug('Component mounted', { componentName: 'MyComponent' });

    return () => {
      widgetLogger.debug('Component unmounted', {
        componentName: 'MyComponent',
      });
    };
  }, []);

  const handleAction = async () => {
    try {
      widgetLogger.info('Starting action', { action: 'fetchData' });

      const result = await fetchData();

      widgetLogger.info('Action completed', {
        action: 'fetchData',
        resultCount: result.length,
      });
    } catch (error) {
      widgetLogger.error(
        'Action failed',
        {
          action: 'fetchData',
        },
        error as Error
      );
    }
  };
}

// In an async function:
async function connectToMqtt() {
  mqttLogger.info('Attempting MQTT connection', { broker: 'localhost:1884' });

  try {
    const client = await connect();
    mqttLogger.info('MQTT connection successful', { clientId: client.id });
    return client;
  } catch (error) {
    mqttLogger.error(
      'MQTT connection failed',
      {
        broker: 'localhost:1884',
        retryCount: 3,
      },
      error as Error
    );
    throw error;
  }
}

// ==========================================
// 7. RUNTIME CONFIGURATION
// ==========================================

// You can change logging configuration at runtime:

// Enable debug mode when URL contains ?debug=true
if (
  typeof window !== 'undefined' &&
  window.location.search.includes('debug=true')
) {
  logger.enableDebugMode(true);
  systemLogger.info('Debug mode enabled via URL parameter');
}

// Different configs for different environments
if (process.env.NODE_ENV === 'production') {
  logger.enableProductionMode();
} else if (process.env.NODE_ENV === 'development') {
  logger.enableDebugMode(true);
}

// ==========================================
// 8. BEST PRACTICES
// ==========================================

/*
1. USE CATEGORY-SPECIFIC LOGGERS
   - mqttLogger for MQTT operations
   - transformLogger for data transformations
   - widgetLogger for widget lifecycle
   - dashboardLogger for dashboard operations
   - systemLogger for system-level events

2. INCLUDE RELEVANT DATA
   - Always include contextual data that helps debugging
   - Use structured data (objects) rather than string concatenation

3. CHOOSE APPROPRIATE LOG LEVELS
   - debug: Detailed information for debugging
   - info: General information about app operation
   - warn: Potentially harmful situations
   - error: Error events that don't stop the application

4. HANDLE PRODUCTION LOGGING
   - Use logger.enableProductionMode() in production
   - Consider sending error logs to external services
   - Don't log sensitive information

5. USE THE LOGGING CONTROL PANEL
   - The LoggingControl component lets you toggle logging in real-time
   - Perfect for debugging without code changes
*/

export {};
