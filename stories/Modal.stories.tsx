import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Modal, ModalProps } from "@/components/Modal";

const meta: Meta<typeof Modal> = {
  title: "UI/Modal",
  component: Modal,
  argTypes: {
    title: { control: "text" },
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

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: (args: ModalProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 text-black dark:text-white"
        >
          Open Modal
        </button>

        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="py-2">
            <p>Modal Content</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p>Donec eleifend, libero at luctus fermentum, odio metus.</p>
            <p>Nulla facilisi. Donec eget ex auctor, tincidunt.</p>
          </div>
        </Modal>
      </div>
    );
  },
  args: {
    title: "Example Modal",
  },
};
