import { widgetRegistry } from '@/lib/widgetRegistry';
import type { DashboardComponent } from '@/lib/types';

export function GridCanvas({
  components,
}: {
  components: DashboardComponent[];
}) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {components.map((comp) => {
        const widgetDef =
          widgetRegistry[comp.type as keyof typeof widgetRegistry];
        if (!widgetDef) {
          console.warn(`Unknown widget type: ${comp.type}`);
          return null;
        }

        const Widget = widgetDef.component;

        // Merge default props with component-specific props
        // Ensure binding is always present by prioritizing component binding over defaults
        const binding = comp.binding || widgetDef.defaultProps?.binding;

        // Only render if we have a binding
        if (!binding) {
          console.warn(
            `No binding available for widget ${comp.id} of type ${comp.type}`
          );
          return null;
        }

        const props = {
          ...widgetDef.defaultProps,
          ...comp,
          binding,
        };

        return <Widget key={comp.id} {...props} />;
      })}
    </div>
  );
}
