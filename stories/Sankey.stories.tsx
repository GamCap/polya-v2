import type { Meta, StoryObj } from "@storybook/react";
import SankeyChart from "@/components/Chart/Sankey";

const meta: Meta<typeof SankeyChart> = {
  title: "Charts/SankeyChart",
  component: SankeyChart,
  argTypes: {},
  decorators: [
    (Story) => (
      <div className="bg-white dark:bg-black rounded-md p-4 flex items-center justify-center w-full h-[400px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SankeyChart>;

export const Default: Story = {
  args: {
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
};
