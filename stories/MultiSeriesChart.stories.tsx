import type { Meta, StoryObj } from "@storybook/react";
import Chart from "@/components/C3";
import {
  areaSpline,
  bar,
  candlestick,
  donut,
  funnel,
  gauge,
  line,
  polar,
  radar,
  spline,
} from "billboard.js";
import { defaultAxis } from "@/components/C3/utils";

const meta = {
  title: "Charts/Chart",
  component: Chart,
  decorators: [
    (Story) => (
      <div className="bg-white dark:bg-black rounded-md p-4 flex items-center justify-center w-full h-[400px] ">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Chart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      columns: [
        ["data1", 30, 200, 100, 400, 150, 250],
        ["data2", 50, 20, 10, 40, 15, 25],
        ["data3", 150, 120, 110, 140, 115, 125],
      ],
      type: bar(), // Set the type to bar
      types: {
        data2: line(), // Set data2 as a line chart
      },
    },
  },
};

export const SplineMixed: Story = {
  args: {
    data: {
      columns: [
        ["data1", 20, 180, 240, 100, 190, 300],
        ["data2", 80, 40, 30, 50, 100, 90],
        ["data3", 60, 130, 150, 70, 100, 50],
      ],
      type: spline(), // Set the type to spline
      types: {
        data2: areaSpline(), // Set data2 as an area spline chart
      },
    },
  },
};

export const StackedBar: Story = {
  args: {
    data: {
      columns: [
        ["data1", 130, 200, 100, 400, 150, 250],
        ["data2", 80, 100, 140, 200, 150, 50],
        ["data3", 100, 100, 100, 100, 100, 100],
      ],
      type: bar(),
      groups: [["data1", "data2", "data3"]], // Stack the bars
    },
  },
};

export const VerticalStackedBar: Story = {
  args: {
    data: {
      columns: [
        ["data1", 30, 200, 100, 400, 150, 250],
        ["data2", 130, 100, 140, 200, 150, 50],
        ["data3", 230, 200, 240, 300, 250, 350],
      ],
      type: bar(),
      groups: [["data1", "data2", "data3"]], // Stack the bars
    },
    config: {
      axis: {
        ...defaultAxis,
        rotated: true, // Rotate the axis
      },
    },
  },
};

export const StackedArea: Story = {
  args: {
    data: {
      columns: [
        ["data1", 130, 200, 100, 400, 150, 250],
        ["data2", 80, 100, 140, 200, 150, 50],
        ["data3", 100, 100, 100, 100, 100, 100],
      ],
      type: areaSpline(),
      groups: [["data1", "data2", "data3"]], // Stack the areas
    },
    config: {
      area: {
        linearGradient: true,
      },
    },
  },
};

export const StackedSpline: Story = {
  args: {
    data: {
      columns: [
        ["data1", 130, 200, 100, 400, 150, 250],
        ["data2", 80, 100, 140, 200, 150, 50],
        ["data3", 100, 100, 100, 100, 100, 100],
      ],
      type: spline(),
      groups: [["data1", "data2", "data3"]], // Stack the splines
    },
  },
};

export const Funnel: Story = {
  args: {
    data: {
      columns: [
        ["data1", 11300],
        ["data2", 12245],
        ["data3", 11125],
        ["data4", 13355],
        ["data5", 18562],
      ],
      type: funnel(), // Set the type to funnel
    },
  },
};

export const Donut: Story = {
  args: {
    data: {
      columns: [
        ["data1", 30],
        ["data2", 120],
      ],
      type: donut(), // Set the type to donut
    },
    legend: {
      position: "right",
      dir: "column",
      align: "center",
    },
  },
};

export const Gauge: Story = {
  args: {
    data: {
      columns: [["data", 91.4]],
      type: gauge(), // Set the type to gauge
    },
  },
};

export const GaugeCustomArc: Story = {
  args: {
    data: {
      columns: [["data", 77]],
      type: "gauge", // for ESM specify as: gauge()
    },
    config: {
      gauge: {
        arcLength: 70,
        fullCircle: true,
        label: {
          extents: function () {
            return "";
          },
        },
        startingAngle: -2.2,
        width: 25,
      },
    },
  },
};

export const GaugeMultiple: Story = {
  args: {
    data: {
      columns: [
        ["data1", 77],
        ["data2", 50],
        ["data3", 20],
      ],
      type: "gauge", // for ESM specify as: gauge()
    },
    config: {
      gauge: {
        type: "multi",
        arcLength: 95,
        fullCircle: true,
        label: {
          extents: function () {
            return "";
          },
        },
        startingAngle: -3,
        width: 50,
      },
    },
  },
};

export const GaugeNeedle: Story = {
  args: {
    data: {
      columns: [
        ["Poor", 20],
        ["Fair", 20],
        ["Good", 20],
        ["Great", 20],
        ["Excellent", 20],
      ],
      type: gauge(),
    },
    config: {
      size: {
        height: 20,
      },
      interaction: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      gauge: {
        width: 30,
        title: "{=NEEDLE_VALUE}%",
        label: {
          format: function (value, ratio, id) {
            return id;
          },
        },
      },
      arc: {
        needle: {
          show: true,
          value: 70,
        },
      },
    },
  },
};
export const Radar: Story = {
  args: {
    data: {
      x: "x",
      columns: [
        ["x", "Data A", "Data B", "Data C", "Data D", "Data E"],
        ["data1", 330, 350, 200, 380, 150],
        ["data2", 130, 100, 30, 200, 80],
        ["data3", 230, 153, 85, 300, 250],
      ],
      type: radar(), // Set the type to radar
    },
  },
};

export const Candlestick: Story = {
  args: {
    data: {
      columns: [
        [
          "data1",
          [1327, 1369, 1289, 1348],
          [1348, 1371, 1314, 1320],
          [1320, 1412, 1314, 1394],
          [1394, 1458, 1393, 1453],
          [1453, 1501, 1448, 1500],
          [1500, 1510, 1492, 1496],
          [1496, 1496, 1448, 1448],
          [1448, 1490, 1433, 1490],
          [1490, 1544, 1490, 1537],
          [1537, 1563, 1534, 1544],
          [1544, 1550, 1511, 1525],
          [1525, 1609, 1517, 1604],
          [1604, 1614, 1585, 1592],
          [1592, 1632, 1586, 1620],
          [1620, 1633, 1609, 1622],
          [1622, 1697, 1620, 1687],
          [1687, 1691, 1624, 1648],
          [1648, 1689, 1640, 1671],
          [1671, 1702, 1671, 1695],
          [1695, 1727, 1689, 1724],
          [1724, 1733, 1691, 1696],
          [1696, 1733, 1696, 1731],
          [1731, 1756, 1716, 1748],
          [1748, 1769, 1734, 1762],
          [1762, 1792, 1752, 1778],
          [1778, 1783, 1763, 1769],
          [1769, 1791, 1740, 1755],
          [1755, 1755, 1711, 1725],
          [1725, 1739, 1683, 1701],
          [1701, 1731, 1694, 1730],
          [1730, 1739, 1703, 1715],
          [1715, 1745, 1710, 1731],
          [1731, 1732, 1643, 1643],
          [1643, 1662, 1608, 1615],
          [1615, 1667, 1615, 1665],
          [1665, 1689, 1663, 1671],
          [1671, 1671, 1587, 1588],
          [1588, 1599, 1521, 1533],
          [1533, 1554, 1476, 1490],
          [1490, 1494, 1432, 1443],
        ],
      ],

      type: candlestick(), // Set the type to candlestick
    },
    config: {
      candlestick: {
        width: {
          ratio: 0.5,
        },
      },
      axis: {
        x: {
          padding: {
            left: 1,
            right: 1,
          },
        },
      },
    },
  },
};

export const Polar: Story = {
  args: {
    data: {
      columns: [
        ["data1", 60],
        ["data2", 120],
        ["data3", 75],
      ],
      type: polar(), // Set the type to polar
    },
    config: {
      polar: {
        label: {
          format: function (value, ratio, id) {
            return value + "\n" + (ratio * 100).toFixed(0) + "%";
          },
          ratio: 1.07,
        },
        level: {
          depth: 5,
          max: 150,
          text: {
            backgroundColor: "transparent",
          },
        },
        padding: 1,
      },
    },
  },
};
