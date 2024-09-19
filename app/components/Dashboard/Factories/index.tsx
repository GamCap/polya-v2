import React, { ReactElement } from "react";
import MultiSeriesChart, { MultiSeriesProps } from "@/components/C3";
import {
  CalendarHeatmap,
  CalendarHeatmapProps,
} from "@/components/Chart/CalendarHeatmap";
import ChordDiagram, { ChordDiagramProps } from "@/components/Chart/Chord";
import { Heatmap, HeatmapProps } from "@/components/Chart/Heatmap";
import SankeyChart, { SankeyChartProps } from "@/components/Chart/Sankey";
import { Table } from "@/components/Table";
import { DashboardItem, DashboardItemProps } from "../DashboardItem";
import { TableProps } from "@/components/Table/types";
import { TreeProps } from "@/components/Tree/types";
import { Tree } from "@/components/Tree";

type WidgetTypes =
  | "chart"
  | "table"
  | "heatmap"
  | "calendarHeatmap"
  | "chord"
  | "sankey"
  | "tree";

interface WidgetMap {
  chart: MultiSeriesProps;
  table: TableProps;
  heatmap: HeatmapProps;
  calendarHeatmap: CalendarHeatmapProps;
  chord: ChordDiagramProps;
  sankey: SankeyChartProps;
  tree: TreeProps;
}

export interface Widget<T extends WidgetTypes> {
  id: string;
  type: T;
  widgetProps: WidgetMap[T];
  dashboardItemProps?: Partial<DashboardItemProps>;
}

export type DashboardWidget =
  | Widget<"chart">
  | Widget<"table">
  | Widget<"heatmap">
  | Widget<"calendarHeatmap">
  | Widget<"chord">
  | Widget<"sankey">
  | Widget<"tree">;

const widgetFactory = (
  widget: DashboardWidget,
  removeWidget: (id: string) => void,
  editable?: boolean
): ReactElement | null => {
  const renderWidget = (): ReactElement | null => {
    switch (widget.type) {
      case "chart": {
        return <MultiSeriesChart {...widget.widgetProps} />;
      }
      case "calendarHeatmap": {
        return <CalendarHeatmap {...widget.widgetProps} />;
      }
      case "chord": {
        return <ChordDiagram {...widget.widgetProps} />;
      }
      case "heatmap": {
        return <Heatmap {...widget.widgetProps} />;
      }
      case "sankey": {
        return <SankeyChart {...widget.widgetProps} />;
      }
      case "table": {
        return <Table {...widget.widgetProps} />;
      }
      case "tree": {
        return <Tree {...widget.widgetProps} />;
      }
      default:
        return null;
    }
  };

  return (
    <DashboardItem
      {...widget.dashboardItemProps}
      removeWidget={() => removeWidget(widget.id)}
      editable={editable}
    >
      {renderWidget()}
    </DashboardItem>
  );
};

export default widgetFactory;
