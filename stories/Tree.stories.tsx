import { Tree } from "@/components/Tree";
import { TreeProps } from "@/components/Tree/types";
import { CustomEdge, CustomNode, TreePanel } from "@/components/Tree/utils";
import { Meta, StoryObj } from "@storybook/react";
import "@xyflow/react/dist/style.css";

const meta: Meta<TreeProps> = {
  title: "Components/Tree",
  component: Tree,
  argTypes: {
    data: { control: "object" },
    isLoading: { control: "boolean" },
  },

  decorators: [
    (Story) => (
      <div className="w-full h-[400px] p-2 bg-white dark:bg-black rounded-md flex flex-col items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<TreeProps>;

export const Default: Story = {
  args: {
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
};
