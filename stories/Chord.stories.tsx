import type { Meta, StoryObj } from "@storybook/react";
import ChordDiagram from "@/components/Chart/Chord";

const meta: Meta<typeof ChordDiagram> = {
  title: "Charts/ChordDiagram",
  component: ChordDiagram,
  argTypes: {},
  decorators: [
    (Story) => (
      <div className="bg-white dark:bg-black rounded-md p-4 flex items-center justify-center w-full h-[600px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ChordDiagram>;

export const Default: Story = {
  args: {
    matrix: [
      [0, 10, 20, 30],
      [10, 0, 15, 25],
      [20, 15, 0, 35],
      [30, 25, 35, 0],
    ],
    labels: ["Group A", "Group B", "Group C", "Group D"],
  },
};
