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

        // Since we're managing configuration in the frontend,
        // components should come with all required props
        if (!comp.binding) {
          console.warn(
            `No binding provided for widget ${comp.id} of type ${comp.type}`
          );
          return null;
        }

        // Create properly typed props object
        const props = {
          ...comp,
          binding: comp.binding, // We know this exists from the check above
        };

        return (
          <div
            key={comp.id}
            className="border border-gray-200 rounded-lg bg-white shadow-sm"
          >
            {comp.title && (
              <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                <h3 className="text-sm font-medium text-gray-700">
                  {comp.title}
                </h3>
              </div>
            )}
            <div className="p-4">
              <Widget {...props} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
