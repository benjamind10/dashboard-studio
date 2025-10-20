import { useEffect, useState } from 'react';
import mqtt, { MqttClient } from 'mqtt';
import type { DataFormat } from '@/lib/types';
import { mqttLogger } from '@/lib/logger';

let client: MqttClient | null = null;
let isConnected = false;

if (typeof window !== 'undefined') {
  try {
    mqttLogger.info('Attempting to connect to MQTT broker', {
      broker: 'ws://localhost:1884',
    });
    client = mqtt.connect('ws://localhost:1884', {
      reconnectPeriod: 2000, // auto-reconnect every 2s
      clean: true,
      connectTimeout: 5000, // 5 second timeout
    });

    client.on('error', (error) => {
      mqttLogger.error(
        'MQTT connection error',
        { error: error.message },
        error
      );
      isConnected = false;
    });

    client.on('offline', () => {
      mqttLogger.warn('MQTT client offline');
      isConnected = false;
    });

    client.on('connect', () => {
      mqttLogger.info('MQTT connected successfully', {
        broker: 'ws://localhost:1884',
      });
      isConnected = true;
    });

    client.on('reconnect', () => {
      mqttLogger.info('MQTT reconnecting...');
    });

    client.on('close', () => {
      mqttLogger.warn('MQTT connection closed');
      isConnected = false;
    });
  } catch (error) {
    mqttLogger.error('MQTT client creation failed', undefined, error as Error);
  }
}

export function useMqttBinding(topic: string, format: DataFormat = 'text') {
  const [value, setValue] = useState<unknown | null>(null);

  useEffect(() => {
    if (!client) {
      mqttLogger.error('No MQTT client available');
      setValue('No MQTT Client');
      return;
    }

    mqttLogger.debug('Subscribing to MQTT topic', { topic });

    const handleMessage = (msgTopic: string, payload: Buffer) => {
      if (msgTopic === topic) {
        const rawData = payload.toString();
        mqttLogger.debug('Received MQTT message', {
          topic: msgTopic,
          rawData,
          format,
        });

        try {
          let parsedValue: unknown;

          switch (format) {
            case 'json':
              parsedValue = JSON.parse(rawData);
              mqttLogger.debug('Parsed JSON data', { topic, parsedValue });
              break;
            case 'number':
              parsedValue = Number(rawData);
              mqttLogger.debug('Parsed number data', { topic, parsedValue });
              break;
            case 'text':
            default:
              parsedValue = rawData;
              mqttLogger.debug('Using text data', { topic, parsedValue });
              break;
          }

          setValue(parsedValue);
        } catch (error) {
          mqttLogger.error(
            'Failed to parse MQTT data',
            {
              topic,
              format,
              rawData,
              error: (error as Error).message,
            },
            error as Error
          );
          setValue(`Parse Error: ${rawData}`); // Show the raw data for debugging
        }
      }
    };

    // Subscribe to the topic
    client.subscribe(topic, (err) => {
      if (err) {
        mqttLogger.error(
          'Failed to subscribe to MQTT topic',
          { topic, error: err.message },
          err
        );
        setValue(`Subscription Error: ${err.message}`);
      } else {
        mqttLogger.info('Successfully subscribed to MQTT topic', { topic });
      }
    });

    client.on('message', handleMessage);

    // Set initial status message
    setValue(
      isConnected ? `Waiting for data on ${topic}...` : 'Connecting to MQTT...'
    );

    return () => {
      mqttLogger.debug('Unsubscribing from MQTT topic', { topic });
      if (client) {
        client.unsubscribe(topic, (err) => {
          if (err) {
            mqttLogger.error(
              'Failed to unsubscribe from MQTT topic',
              { topic, error: err.message },
              err
            );
          }
        });
        client.removeListener('message', handleMessage);
      }
    };
  }, [topic, format]);

  return value;
}
