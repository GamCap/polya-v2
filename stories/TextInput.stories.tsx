import type { Meta, StoryObj } from "@storybook/react";
import { TextInput } from "@/components/ui/TextInput";

const meta: Meta<typeof TextInput> = {
  title: "UI/TextInput",
  component: TextInput,
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: ["regular", "colored"],
      },
    },
    wrapperClassName: {
      control: {
        type: "text",
      },
    },
    inputClassName: {
      control: {
        type: "text",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-white dark:bg-black rounded-md p-4 flex items-center justify-center w-fit h-fit">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof TextInput>;

export const WithLeftIcon: Story = {
  args: {
    placeholder: "Search...",
    leftIconName: "Search",
    wrapperClassName: "w-36",
  },
};

export const WithRightIcon: Story = {
  args: {
    placeholder: "Enter amount",
    rightSymbol: "$",
    wrapperClassName: "w-36",
  },
};

export const WithErrorMessage: Story = {
  args: {
    placeholder: "Enter email",
    errorMessage: "Invalid email format",
  },
};

export const WithHelperText: Story = {
  args: {
    placeholder: "Enter password",
    helperText: "Password must be at least 8 characters long",
  },
};
