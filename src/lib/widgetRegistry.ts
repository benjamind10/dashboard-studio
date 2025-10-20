import {
  BindableText,
  BindableTextProps,
} from '@/components/widgets/BindableText';

export interface WidgetDefinition<P> {
  component: React.ComponentType<P>;
  displayName: string;
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
  },
};
