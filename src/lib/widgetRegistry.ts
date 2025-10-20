import {
  BindableText,
  BindableTextProps,
} from '@/components/widgets/BindableText';
import type { Binding } from '@/lib/types';

export interface WidgetDefinition<P> {
  component: React.ComponentType<P>;
  displayName: string;
  defaultProps?: Partial<P>;
}

export interface WidgetRegistry {
  text: BindableTextProps;
}

export const widgetRegistry: {
  [K in keyof WidgetRegistry]: WidgetDefinition<WidgetRegistry[K]>;
} = {
  text: {
    component: BindableText,
    displayName: 'Text',
    defaultProps: {
      binding: { type: 'mqtt', path: 'demo/topic' } as Binding,
      style: { fontSize: '1.2rem' },
    },
  },
};
