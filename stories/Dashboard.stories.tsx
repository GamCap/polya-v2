import type { Meta, StoryObj } from "@storybook/react";
import Dashboard from "@/components/Dashboard/Dashboard"; // Your Dashboard component
import widgetFactory, {
  DashboardWidget,
} from "@/components/Dashboard/Factories";
import { gauge, radar } from "billboard.js";
import { CalendarHeatmapData } from "@/components/Chart/types";
import data from "./data/calendar_heatmap_data.json";
import { CustomEdge, CustomNode, TreePanel } from "@/components/Tree/utils";

const meta: Meta<typeof Dashboard<DashboardWidget>> = {
  title: "UI/Dashboard",
  component: Dashboard,
  decorators: [
    (Story) => (
      <div className="w-full h-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

const calendarHeatmapData: CalendarHeatmapData[] = data.map((d) => {
  return {
    ...d,
    date: d.date * 1000,
  };
});

const mockData = [
  {
    id: 1,
    name: "John Doe",
    age: 25,
    email: "john@example.com",
    country: "USA",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 30,
    email: "jane@example.com",
    country: "Canada",
    rating: 4.2,
  },
  {
    id: 3,
    name: "Bob Johnson",
    age: 35,
    email: "bob@example.com",
    country: "Australia",
    rating: 3.9,
  },
  {
    id: 4,
    name: "Alice Brown",
    age: 28,
    email: "alice@example.com",
    country: "UK",
    rating: 4.7,
  },
  {
    id: 5,
    name: "David Lee",
    age: 42,
    email: "david@example.com",
    country: "USA",
    rating: 4.1,
  },
  {
    id: 6,
    name: "Sarah Davis",
    age: 27,
    email: "sarah@example.com",
    country: "Canada",
    rating: 4.4,
  },
  {
    id: 7,
    name: "Michael Wilson",
    age: 33,
    email: "michael@example.com",
    country: "Australia",
    rating: 3.8,
  },
  {
    id: 8,
    name: "Emily Taylor",
    age: 29,
    email: "emily@example.com",
    country: "UK",
    rating: 4.6,
  },
  {
    id: 9,
    name: "Daniel Anderson",
    age: 31,
    email: "daniel@example.com",
    country: "USA",
    rating: 4.3,
  },
  {
    id: 10,
    name: "Olivia Martinez",
    age: 26,
    email: "olivia@example.com",
    country: "Canada",
    rating: 4.0,
  },
  {
    id: 11,
    name: "James Robinson",
    age: 37,
    email: "james@example.com",
    country: "Australia",
    rating: 4.2,
  },
  {
    id: 12,
    name: "Sophia Clark",
    age: 32,
    email: "sophia@example.com",
    country: "UK",
    rating: 4.5,
  },
  {
    id: 13,
    name: "William Harris",
    age: 39,
    email: "william@example.com",
    country: "USA",
    rating: 4.1,
  },
  {
    id: 14,
    name: "Ava Thompson",
    age: 24,
    email: "ava@example.com",
    country: "Canada",
    rating: 4.4,
  },
  {
    id: 15,
    name: "Benjamin Sanchez",
    age: 34,
    email: "benjamin@example.com",
    country: "Australia",
    rating: 3.9,
  },
  {
    id: 16,
    name: "Mia Lewis",
    age: 27,
    email: "mia@example.com",
    country: "UK",
    rating: 4.7,
  },
  {
    id: 17,
    name: "Alexander Walker",
    age: 36,
    email: "alexander@example.com",
    country: "USA",
    rating: 4.2,
  },
  {
    id: 18,
    name: "Charlotte Hall",
    age: 30,
    email: "charlotte@example.com",
    country: "Canada",
    rating: 4.0,
  },
  {
    id: 19,
    name: "Henry Young",
    age: 41,
    email: "henry@example.com",
    country: "Australia",
    rating: 4.3,
  },
  {
    id: 20,
    name: "Amelia King",
    age: 29,
    email: "amelia@example.com",
    country: "UK",
    rating: 4.6,
  },
];

const widgets: DashboardWidget[] = [
  // Multi-series chart (Radar)
  {
    id: "radar-chart",
    type: "chart",
    widgetProps: {
      data: {
        x: "x",
        columns: [
          ["x", "Metric A", "Metric B", "Metric C", "Metric D", "Metric E"],
          ["Performance", 330, 350, 200, 380, 150],
          ["Efficiency", 130, 100, 30, 200, 80],
          ["Reliability", 230, 153, 85, 300, 250],
        ],
        type: radar(), // Set the type to radar
      },
      id: "radar-chart",
    },
    dashboardItemProps: {
      title: "Radar Chart",
      zoomProps: {
        items: [{ label: "1M" }, { label: "3M" }, { label: "6M" }],
        onChange: (data) => {
          console.log(data);
        },
      },
    },
  },
  // Multi-gauge chart
  {
    id: "multi-gauge-chart",
    type: "chart",
    widgetProps: {
      data: {
        columns: [
          ["data1", 77],
          ["data2", 50],
          ["data3", 20],
        ],
        type: gauge(), // Multi-gauge chart
      },
      config: {
        gauge: {
          type: "multi",
          arcLength: 95,
          label: {
            extents: function () {
              return "";
            },
          },
          startingAngle: -3,
          width: 50,
        },
      },
      id: "multi-gauge-chart",
    },
    dashboardItemProps: {
      title: "Multi-Gauge Chart",
      zoomProps: {
        items: [{ label: "1M" }, { label: "3M" }, { label: "6M" }],
        onChange: (data) => {
          console.log(data);
        },
      },
    },
  },

  // Calendar Heatmap
  {
    id: "calendar-heatmap",
    type: "calendarHeatmap",
    widgetProps: { data: calendarHeatmapData },
    dashboardItemProps: {
      title: "Calendar Heatmap",
      zoomProps: {
        items: [{ label: "1M" }, { label: "3M" }, { label: "6M" }],
        onChange: (data) => {
          console.log(data);
        },
      },
    },
  },
  // Chord Diagram
  {
    id: "chord-diagram",
    type: "chord",
    widgetProps: {
      matrix: [
        [0, 10, 20, 30],
        [10, 0, 15, 25],
        [20, 15, 0, 35],
        [30, 25, 35, 0],
      ],
      labels: ["Group A", "Group B", "Group C", "Group D"],
    },
    dashboardItemProps: {
      title: "Chord Diagram",
    },
  },
  // Heatmap
  {
    id: "heatmap",
    type: "heatmap",
    widgetProps: {
      data: [
        { x: "A", y: "v1", value: 30 },
        { x: "A", y: "v2", value: 95 },
        { x: "B", y: "v1", value: 85 },
        { x: "B", y: "v2", value: 60 },
      ],
    },
    dashboardItemProps: {
      title: "Heatmap",
      zoomProps: {
        items: [{ label: "1M" }, { label: "3M" }, { label: "6M" }],
        onChange: (data) => {
          console.log(data);
        },
      },
    },
  },
  // Sankey Chart
  {
    id: "sankey-chart",
    type: "sankey",
    widgetProps: {
      data: {
        nodes: [{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }],
        links: [
          { source: "A", target: "B", value: 10 },
          { source: "A", target: "C", value: 20 },
          { source: "B", target: "D", value: 15 },
          { source: "C", target: "D", value: 25 },
        ],
      },
    },
    dashboardItemProps: {
      title: "Sankey Chart",
    },
  },
  // Table
  {
    id: "table",
    type: "table",
    widgetProps: {
      data: mockData,
      columns: [
        { id: "name", label: "Name", sortable: true },
        {
          id: "age",
          label: "Age",
          sortable: true,
          filterable: true,
          filterType: "range",
        },
        { id: "email", label: "Email" },
        {
          id: "country",
          label: "Country",
          sortable: true,
          filterable: true,
          filterType: "multi-select",
          options: ["USA", "Canada", "Australia", "UK"],
        },
        {
          id: "rating",
          label: "Rating",
          sortable: true,
          filterable: true,
          filterType: "range",
          renderer: (value: number) => (
            <span
              style={{
                color: value >= 4.5 ? "green" : value >= 4 ? "orange" : "red",
              }}
            >
              {value}
            </span>
          ),
        },
      ],
      pageSize: 7,
    },
    dashboardItemProps: {
      title: "Table",
      zoomProps: {
        items: [{ label: "1M" }, { label: "3M" }, { label: "6M" }],
        onChange: (data) => {
          console.log(data);
        },
      },
    },
  },

  // Tree
  {
    id: "tree",
    type: "tree",
    widgetProps: {
      data: {
        nodes: [
          {
            id: "1",
            data: {
              label: "Node 1",
              kind: "Remove",
              createdTx: "tx 1",
              timestamp: 1,
            },
            position: { x: 100, y: 100 },
          },
          {
            id: "2",
            data: {
              label: "Node 2",
              kind: "Insert",
              createdTx: "tx 2",
              timestamp: 2,
            },
            position: { x: 200, y: 200 },
          },
        ],
        edges: [{ id: "e1-2", source: "1", target: "2", animated: true }],
      },
      isLoading: false,
      nodeTypes: {
        default: CustomNode,
      },
      edgeTypes: {
        default: CustomEdge,
      },
      panel: (
        <TreePanel
          firstBlock={10}
          lastBlock={20}
          firstDate={1724162677}
          lastDate={1724249077}
          numberOfNodes={2}
          showLimitWarning={false}
        />
      ),
    },
  },
];

const availableWidgets: DashboardWidget[] = [
  {
    id: "available-radar-chart",
    type: "chart",
    widgetProps: {
      data: {
        x: "x",
        columns: [
          ["x", "Metric A", "Metric B", "Metric C", "Metric D", "Metric E"],
          ["Performance", 330, 350, 200, 380, 150],
          ["Efficiency", 130, 100, 30, 200, 80],
          ["Reliability", 230, 153, 85, 300, 250],
        ],
        type: radar(),
      },
      id: "available-radar-chart",
    },
    dashboardItemProps: {
      title: "Radar Chart",
    },
  },
  {
    id: "available-table",
    type: "table",
    widgetProps: {
      data: mockData,
      columns: [
        { id: "name", label: "Name", sortable: true },
        { id: "age", label: "Age", sortable: true },
        { id: "email", label: "Email" },
        { id: "country", label: "Country", sortable: true },
      ],
    },
    dashboardItemProps: {
      title: "Table",
      zoomProps: {
        items: [{ label: "1M" }, { label: "3M" }, { label: "6M" }],
        onChange: (data) => {
          console.log(data);
        },
      },
    },
  },
];

export const Default: Story = {
  args: {
    widgets,
    availableWidgets,
    renderItem: (widget: DashboardWidget, removeWidget, editable) =>
      widgetFactory(widget, removeWidget, editable) ?? <></>,
    onSave(widgets, layouts) {
      console.log(widgets, layouts);
    },
    layouts: {
      large: [
        {
          w: 8,
          h: 9,
          x: 0,
          y: 0,
          i: "radar-chart",
          moved: false,
          static: false,
        },
        {
          w: 8,
          h: 9,
          x: 8,
          y: 0,
          i: "multi-gauge-chart",
          moved: false,
          static: false,
        },
        {
          w: 8,
          h: 9,
          x: 16,
          y: 0,
          i: "chord-diagram",
          moved: false,
          static: false,
        },
        {
          w: 8,
          h: 9,
          x: 0,
          y: 9,
          i: "heatmap",
          moved: false,
          static: false,
        },
        {
          w: 16,
          h: 9,
          x: 8,
          y: 9,
          i: "calendar-heatmap",
          moved: false,
          static: false,
        },
        {
          w: 16,
          h: 12,
          x: 0,
          y: 18,
          i: "tree",
          moved: false,
          static: false,
        },
        {
          w: 8,
          h: 12,
          x: 16,
          y: 18,
          i: "table",
          moved: false,
          static: false,
        },

        {
          w: 24,
          h: 9,
          x: 0,
          y: 30,
          i: "sankey-chart",
          moved: false,
          static: false,
        },
      ],
      medium: [
        {
          w: 6,
          h: 9,
          x: 0,
          y: 0,
          i: "radar-chart",
          moved: false,
          static: false,
        },
        {
          w: 6,
          h: 9,
          x: 6,
          y: 0,
          i: "multi-gauge-chart",
          moved: false,
          static: false,
        },
        {
          w: 6,
          h: 9,
          x: 0,
          y: 9,
          i: "chord-diagram",
          moved: false,
          static: false,
        },
        {
          w: 6,
          h: 9,
          x: 6,
          y: 9,
          i: "heatmap",
          moved: false,
          static: false,
        },
        {
          w: 12,
          h: 9,
          x: 0,
          y: 18,
          i: "calendar-heatmap",
          moved: false,
          static: false,
        },
        {
          w: 8,
          h: 12,
          x: 0,
          y: 27,
          i: "tree",
          moved: false,
          static: false,
        },
        {
          w: 4,
          h: 12,
          x: 12,
          y: 27,
          i: "table",
          moved: false,
          static: false,
        },

        {
          w: 12,
          h: 9,
          x: 0,
          y: 39,
          i: "sankey-chart",
          moved: false,
          static: false,
        },
      ],
      small: [
        {
          w: 8,
          h: 9,
          x: 0,
          y: 0,
          i: "radar-chart",
          moved: false,
          static: false,
        },
        {
          w: 8,
          h: 9,
          x: 0,
          y: 9,
          i: "multi-gauge-chart",
          moved: false,
          static: false,
        },
        {
          w: 8,
          h: 9,
          x: 0,
          y: 18,
          i: "chord-diagram",
          moved: false,
          static: false,
        },
        {
          w: 8,
          h: 9,
          x: 0,
          y: 27,
          i: "heatmap",
          moved: false,
          static: false,
        },
        {
          w: 8,
          h: 9,
          x: 0,
          y: 36,
          i: "calendar-heatmap",
          moved: false,
          static: false,
        },
        {
          w: 8,
          h: 12,
          x: 0,
          y: 45,
          i: "tree",
          moved: false,
          static: false,
        },
        {
          w: 8,
          h: 9,
          x: 0,
          y: 57,
          i: "table",
          moved: false,
          static: false,
        },

        {
          w: 8,
          h: 9,
          x: 0,
          y: 66,
          i: "sankey-chart",
          moved: false,
          static: false,
        },
      ],
    },
  },
};
