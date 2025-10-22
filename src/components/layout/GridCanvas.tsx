import React from 'react';
import { widgetRegistry } from '@/lib/widgetRegistry';
import type { DashboardComponent } from '@/lib/types';

export function GridCanvas({
  components,
  onComponentUpdate,
  showGrid = false,
}: {
  components: DashboardComponent[];
  onComponentUpdate?: (components: DashboardComponent[]) => void;
  showGrid?: boolean;
}) {
  const [draggedId, setDraggedId] = React.useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, componentId: string) => {
    e.dataTransfer.setData('text/plain', componentId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedId(componentId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    setDraggedId(null);

    if (onComponentUpdate) {
      const newComponents = [...components];
      const draggedIndex = newComponents.findIndex(
        (comp) => comp.id === draggedId
      );

      if (draggedIndex !== -1) {
        if (showGrid) {
          // For grid mode, update the position based on grid cell
          const newX = targetIndex % 12;
          const newY = Math.floor(targetIndex / 12);

          // Check if there's already a component at this position
          const existingComponent = newComponents.find(
            (comp) => comp.position?.x === newX && comp.position?.y === newY
          );

          if (existingComponent && existingComponent.id !== draggedId) {
            // Swap positions
            const draggedPosition = newComponents[draggedIndex].position;
            newComponents[draggedIndex] = {
              ...newComponents[draggedIndex],
              position: { x: newX, y: newY },
            };
            const existingIndex = newComponents.findIndex(
              (comp) => comp.id === existingComponent.id
            );
            newComponents[existingIndex] = {
              ...newComponents[existingIndex],
              position: draggedPosition || { x: 0, y: 0 },
            };
          } else {
            // Just move to the new position
            newComponents[draggedIndex] = {
              ...newComponents[draggedIndex],
              position: { x: newX, y: newY },
            };
          }
        } else {
          // For normal mode, reorder components
          if (draggedIndex !== targetIndex) {
            const [draggedItem] = newComponents.splice(draggedIndex, 1);
            newComponents.splice(targetIndex, 0, draggedItem);
          }
        }

        onComponentUpdate(newComponents);
      }
    }
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  return (
    <div className={`relative w-full ${showGrid ? 'min-h-screen' : ''}`}>
      {showGrid ? (
        // Grid mode with drag-and-drop overlay
        <div className="grid grid-cols-12 gap-2 min-h-screen relative">
          {/* Grid cells with drop zones */}
          {Array.from({ length: 96 }).map((_, i) => {
            const componentAtPosition = components.find(
              (comp) =>
                (comp.position?.x || 0) + (comp.position?.y || 0) * 12 === i
            );

            return (
              <div
                key={i}
                className="border border-dashed border-blue-300 dark:border-blue-600 bg-blue-50/20 dark:bg-blue-900/10 min-h-[80px] transition-colors hover:bg-blue-100/40 dark:hover:bg-blue-800/30 relative"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, i)}
              >
                {componentAtPosition && (
                  <div
                    draggable={!!onComponentUpdate}
                    onDragStart={(e) =>
                      handleDragStart(e, componentAtPosition.id)
                    }
                    onDragEnd={handleDragEnd}
                    className={`absolute inset-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 ${
                      onComponentUpdate
                        ? 'cursor-move hover:shadow-md hover:scale-105'
                        : ''
                    } ${
                      draggedId === componentAtPosition.id
                        ? 'opacity-50 scale-95'
                        : ''
                    }`}
                  >
                    {componentAtPosition.title && (
                      <div className="px-2 py-1 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-t-lg flex items-center justify-between">
                        <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {componentAtPosition.title}
                        </h3>
                        {onComponentUpdate && (
                          <div className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M7 2h2v2H7zM15 2h2v2h-2zM7 6h2v2H7zM15 6h2v2h-2zM7 10h2v2H7zM15 10h2v2h-2zM7 14h2v2H7zM15 14h2v2h-2zM7 18h2v2H7zM15 18h2v2h-2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-2 text-sm">
                      {(() => {
                        const widgetDef =
                          widgetRegistry[
                            componentAtPosition.type as keyof typeof widgetRegistry
                          ];
                        if (!widgetDef || !componentAtPosition.binding)
                          return null;
                        const Widget = widgetDef.component;
                        const props = {
                          ...componentAtPosition,
                          binding: componentAtPosition.binding,
                        };
                        return <Widget {...props} />;
                      })()}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // Normal grid mode
        <div className="grid grid-cols-4 gap-4">
          {components.map((comp, index) => {
            const widgetDef =
              widgetRegistry[comp.type as keyof typeof widgetRegistry];
            if (!widgetDef || !comp.binding) return null;

            const Widget = widgetDef.component;
            const props = { ...comp, binding: comp.binding };

            return (
              <div
                key={comp.id}
                draggable={!!onComponentUpdate}
                onDragStart={(e) => handleDragStart(e, comp.id)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 ${
                  onComponentUpdate
                    ? 'cursor-move hover:shadow-md hover:scale-105'
                    : ''
                } ${draggedId === comp.id ? 'opacity-50 scale-95' : ''}`}
              >
                {comp.title && (
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-t-lg flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {comp.title}
                    </h3>
                    {onComponentUpdate && (
                      <div className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M7 2h2v2H7zM15 2h2v2h-2zM7 6h2v2H7zM15 6h2v2h-2zM7 10h2v2H7zM15 10h2v2h-2zM7 14h2v2H7zM15 14h2v2h-2zM7 18h2v2H7zM15 18h2v2h-2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <Widget {...props} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
