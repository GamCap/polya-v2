import React, { useState, useMemo, useEffect } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import { Button } from "../ui/Button";
import WidgetSelectionModal from "./WidgetSelectionModal";

export interface WidgetBase {
  id: string;
}

interface DashboardProps<T extends WidgetBase> {
  widgets: T[];
  layouts: { [key: string]: Layout[] };
  renderItem: (
    widget: T,
    removeWidget: (id: string) => void,
    editable?: boolean
  ) => React.ReactElement;
  availableWidgets: T[];
  breakpoints?: { [key: string]: number };
  cols?: { [key: string]: number };
  margin?: [number, number];
  rowHeight?: number;
  isDraggable?: boolean;
  isResizable?: boolean;
  onSave?: (widgets: T[], layouts: { [key: string]: Layout[] }) => void;
}

const Dashboard = <T extends WidgetBase>({
  widgets,
  layouts,
  renderItem,
  availableWidgets,
  breakpoints = { large: 1200, medium: 768, small: 480 },
  cols = { large: 24, medium: 12, small: 8 },
  margin = [10, 10],
  rowHeight = 30,
  isDraggable = false,
  isResizable = false,
  onSave,
}: DashboardProps<T>) => {
  const MemoizedGridLayout = useMemo(() => WidthProvider(Responsive), []);
  const [localWidgets, setLocalWidgets] = useState(widgets);
  const [localLayouts, setLocalLayouts] = useState(layouts);
  const [resizable, setResizable] = useState(isResizable);
  const [draggable, setDraggable] = useState(isDraggable);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [removeWidgetActive, setRemoveWidgetActive] = useState(false);

  const localAvailableWidgets = useMemo(
    () =>
      availableWidgets.filter(
        (widget) => !localWidgets.some((w) => w.id === widget.id)
      ),
    [availableWidgets, localWidgets]
  );

  useEffect(() => {
    const widgetsChanged =
      JSON.stringify(localWidgets) !== JSON.stringify(widgets);
    const layoutsChanged =
      JSON.stringify(localLayouts) !== JSON.stringify(layouts);
    setHasChanges(widgetsChanged || layoutsChanged);
  }, [localWidgets, localLayouts, widgets, layouts]);

  const onLayoutChange = (
    layout: Layout[],
    layouts: { [key: string]: Layout[] }
  ) => {
    setLocalLayouts(layouts);
  };

  const addWidget = (widget: T) => {
    setLocalWidgets([...localWidgets, widget]);
  };

  const removeWidget = (id: string) => {
    setLocalWidgets(localWidgets.filter((widget) => widget.id !== id));
  };

  const onWidgetAdd = (widget: T) => {
    // add widget and add a layout for it
    addWidget(widget);
    setLocalLayouts({
      ...localLayouts,
      large: [
        ...localLayouts.large,
        {
          i: widget.id,
          x: (localLayouts.large.length * 2) % (cols.large || 12),
          y: Infinity,
          w: 12,
          h: 9,
        },
      ],
      medium: [
        ...localLayouts.medium,
        {
          i: widget.id,
          x: (localLayouts.medium.length * 2) % (cols.medium || 12),
          y: Infinity,
          w: 12,
          h: 9,
        },
      ],
      small: [
        ...localLayouts.small,
        {
          i: widget.id,
          x: (localLayouts.small.length * 2) % (cols.small || 12),
          y: Infinity,
          w: 8,
          h: 9,
        },
      ],
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="px-2.5 w-full">
        <div className="w-full bg-white dark:bg-black flex items-center justify-end p-4 rounded-md gap-4">
          {onSave && hasChanges && (
            <Button
              size="small"
              variant="subtle"
              onClick={() => {
                onSave(localWidgets, localLayouts);
              }}
            >
              Save Changes
            </Button>
          )}
          <Button
            size="small"
            className={resizable ? "!bg-accent-blue dark:!bg-accent-blue" : ""}
            onClick={() => {
              setDraggable(!draggable);
              setResizable(!resizable);
            }}
          >
            {draggable ? "Save" : "Edit"}
          </Button>
          <Button size="small" onClick={() => setIsModalOpen(true)}>
            Add Widget
          </Button>
          <Button
            size="small"
            onClick={() => setRemoveWidgetActive(!removeWidgetActive)}
          >
            {removeWidgetActive ? "Done" : "Remove Widget"}
          </Button>
        </div>
      </div>
      <WidgetSelectionModal
        availableWidgets={localAvailableWidgets}
        onAddWidget={onWidgetAdd}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <MemoizedGridLayout
        className="layout"
        layouts={localLayouts}
        breakpoints={breakpoints}
        cols={cols}
        margin={margin}
        rowHeight={rowHeight}
        isDraggable={draggable}
        isResizable={resizable}
        resizeHandles={["se"]}
        onLayoutChange={onLayoutChange}
      >
        {localWidgets.map((widget) => (
          <div
            key={widget.id}
            className="bg-white dark:bg-black p-4 rounded-md flex flex-col"
          >
            {renderItem(widget, removeWidget, removeWidgetActive)}
          </div>
        ))}
      </MemoizedGridLayout>
    </div>
  );
};

export default Dashboard;
