import type { Meta, StoryObj } from "@storybook/react";
import { CalendarHeatmap } from "@/components/Chart/CalendarHeatmap";
import { CalendarHeatmapData } from "@/components/Chart/types";
import data from "./data/calendar_heatmap_data.json";

const meta: Meta<typeof CalendarHeatmap> = {
  title: "Charts/CalendarHeatmap",
  component: CalendarHeatmap,
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
type Story = StoryObj<typeof CalendarHeatmap>;

const calendarHeatmapData: CalendarHeatmapData[] = data.map((d) => {
  return {
    ...d,
    date: d.date * 1000,
  };
});

export const Default: Story = {
  args: {
    data: calendarHeatmapData,
  },
};
