import { useEffect, useState } from 'react';
import type { DataFormat } from '@/lib/types';

/**
 * Mock MQTT binding for testing without a real MQTT broker
 */
export function useMockMqttBinding(topic: string, format: DataFormat = 'text') {
  const [value, setValue] = useState<unknown | null>(null);

  useEffect(() => {
    // Generate mock data based on topic
    const generateMockData = () => {
      let mockData: unknown;

      switch (true) {
        case topic.includes('temperature') || topic.includes('temp'):
          mockData = {
            value: 20 + Math.random() * 15, // 20-35°C
            timestamp: new Date().toISOString(),
            quality: 'good',
          };
          break;

        case topic.includes('pressure'):
          mockData = {
            value: 100 + Math.random() * 50, // 100-150 PSI
            timestamp: new Date().toISOString(),
            quality: 'good',
          };
          break;

        case topic.includes('flow'):
          mockData = {
            value: 10 + Math.random() * 20, // 10-30 L/min
            timestamp: new Date().toISOString(),
            quality: 'good',
          };
          break;

        case topic.includes('vibration'):
          mockData = {
            value: Math.random() * 12, // 0-12 mm/s
            timestamp: new Date().toISOString(),
            quality: 'good',
          };
          break;

        case topic.includes('status') || topic.includes('pump'):
          const statuses = ['running', 'stopped', 'maintenance', 'warning'];
          mockData = {
            value: statuses[Math.floor(Math.random() * statuses.length)],
            timestamp: new Date().toISOString(),
            quality: 'good',
          };
          break;

        default:
          mockData = {
            value: Math.random() * 100,
            timestamp: new Date().toISOString(),
            quality: 'good',
          };
          break;
      }

      // Apply format parsing
      try {
        let parsedValue: unknown;
        const rawData = JSON.stringify(mockData);

        switch (format) {
          case 'json':
            parsedValue = JSON.parse(rawData);
            break;
          case 'number':
            parsedValue = Number(rawData);
            break;
          case 'text':
          default:
            parsedValue = rawData;
            break;
        }

        setValue(parsedValue);
      } catch (error) {
        console.error(
          `Failed to parse ${format} data for topic ${topic}:`,
          error
        );
        setValue(mockData);
      }
    };

    // Generate initial data
    generateMockData();

    // Update data every 2-5 seconds
    const interval = setInterval(generateMockData, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [topic, format]);

  return value;
}
