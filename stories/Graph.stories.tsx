// stories/ForceDirectedGraph.stories.tsx
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ForceDirectedGraph, { BaseNode, Link } from "@/components/Chart/Graph";

const meta: Meta<typeof ForceDirectedGraph<CustomNode>> = {
  title: "Charts/ForceDirectedGraph",
  component: ForceDirectedGraph,
  argTypes: {
    colorOption: {
      control: {
        type: "select",
        options: ["individual", "connected", "uniform"],
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="container flex items-center justify-center h-[600px] bg-white dark:bg-black p-4 rounded-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ForceDirectedGraph>;

interface CustomNode extends BaseNode {
  additionalData: Record<string, number>; // Updated to hold token amounts
}

const generateMockData = () => {
  const itemStyles = [
    { color: "#24294a", borderColor: "#562ec8", borderWidth: 2 },
    { color: "#89145c", borderColor: "#FF4E9D", borderWidth: 2 },
    { color: "#0a936c", borderColor: "#00FFB9", borderWidth: 2 },
  ];

  // Define the tokens (fixed/draggable nodes)
  const tokenNodes: CustomNode[] = [
    {
      id: "TokenA",
      fixed: true,
      draggable: true,
      color: itemStyles[0].color,
      borderColor: itemStyles[0].borderColor,
      additionalData: {}, // Tokens don't have additionalData
    },
    {
      id: "TokenB",
      fixed: true,
      draggable: true,
      color: itemStyles[1].color,
      borderColor: itemStyles[1].borderColor,
      additionalData: {},
    },
    {
      id: "TokenC",
      fixed: true,
      draggable: true,
      color: itemStyles[2].color,
      borderColor: itemStyles[2].borderColor,
      additionalData: {},
    },
  ];

  // Initialize wallet nodes with empty additionalData and zero value
  const walletNodes: CustomNode[] = Array.from({ length: 300 }, (_, i) => ({
    id: `Wallet${i}`,
    value: 0, // Will be set based on additionalData
    fixed: false,
    draggable: false,
    additionalData: {}, // Will be populated with token amounts
  }));

  const nodes: CustomNode[] = [...tokenNodes, ...walletNodes];

  // Function to get a weighted random number of connections (1, 2, or 3)
  const getWeightedRandomConnections = () => {
    const connectionOptions = [1, 2, 3];
    const weights = [0.5, 0.3, 0.2];
    const random = Math.random();
    let cumulativeWeight = 0;
    for (let i = 0; i < weights.length; i++) {
      cumulativeWeight += weights[i];
      if (random < cumulativeWeight) {
        return connectionOptions[i];
      }
    }
    return 1; // Default fallback
  };

  const links: Link<CustomNode>[] = [];
  walletNodes.forEach((wallet) => {
    const numConnections = getWeightedRandomConnections();
    const connectedTokens: Set<string> = new Set();

    // Randomly select tokens to connect with
    while (connectedTokens.size < numConnections) {
      const token = tokenNodes[Math.floor(Math.random() * tokenNodes.length)];
      if (!connectedTokens.has(token.id)) {
        connectedTokens.add(token.id);
        links.push({ source: wallet.id, target: token.id });
      }
    }

    // Assign random amounts for each connected token
    let totalValue = 0;
    connectedTokens.forEach((tokenId) => {
      const amount = Math.random() * 100; // Random amount between 0 and 100
      wallet.additionalData[tokenId] = amount;
      totalValue += amount;
    });

    // Set the wallet's value to the sum of amounts in additionalData
    wallet.value = totalValue;
  });

  return { nodes, links };
};

const { nodes, links } = generateMockData();

export const IndividualColors: Story = {
  args: {
    nodes,
    links,
    colorOption: "individual",
  },
};

export const ConnectedColors: Story = {
  args: {
    nodes,
    links,
    colorOption: "connected",
  },
};

export const UniformColor: Story = {
  args: {
    nodes,
    links,
    colorOption: "uniform",
    defaultColor: "#ffa500", // Orange
  },
};
