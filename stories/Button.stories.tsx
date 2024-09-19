import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Button } from "@/components/ui/Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    iconName: { table: { disable: true } },
    disabled: {
      control: {
        type: "boolean",
      },
    },
  },
  args: { onClick: fn() },
  decorators: [
    (Story) => (
      <div className="bg-white dark:bg-black rounded-md p-4 flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    variant: "primary",
    children: "Button",
  },
};

//with icon

export const WithIcon: Story = {
  args: {
    variant: "primary",
    children: "Button",
    iconName: "InfoCircle",
  },
};

export const VariantActive: Story = {
  args: {
    variant: "active",
    children: "Button",
  },
};

export const VariantSecondary: Story = {
  args: {
    variant: "secondary",
    children: "Button",
  },
};

export const VariantSubtle: Story = {
  args: {
    variant: "subtle",
    children: "Button",
  },
};
