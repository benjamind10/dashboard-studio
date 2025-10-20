import { useEffect, useState } from 'react';
import mqtt, { MqttClient } from 'mqtt';

let client: MqttClient | null = null;

if (typeof window !== 'undefined') {
  client = mqtt.connect('ws://localhost:1884', {
    reconnectPeriod: 2000, // auto-reconnect every 2s
    clean: true,
  });
}

export function useMqttBinding(topic: string) {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (!client) return;

    const handleMessage = (msgTopic: string, payload: Buffer) => {
      if (msgTopic === topic) {
        setValue(payload.toString());
      }
    };

    client.subscribe(topic, (err) => {
      if (err) console.error(`Failed to subscribe to ${topic}:`, err);
    });

    client.on('message', handleMessage);

    return () => {
      if (client) {
        client.unsubscribe(topic, (err) => {
          if (err) console.error(`Failed to unsubscribe from ${topic}:`, err);
        });
        client.removeListener('message', handleMessage);
      }
    };
  }, [topic]);

  return value;
}
