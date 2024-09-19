import { Node, Edge, NodeTypes, EdgeTypes } from "@xyflow/react";

interface FlowGraphData {
  nodes: Node[];
  edges: Edge[];
}

interface TreeProps {
  data: FlowGraphData;
  isLoading: boolean;
  nodeTypes?: NodeTypes;
  edgeTypes?: EdgeTypes;
  panel?: React.ReactNode;
}

type CustomNodeProps = Node<
  { label: string; kind: string; createdTx: string; timestamp: number },
  "default"
>;

type CustomEdgeProps = Edge<{}, "default">;

export type { FlowGraphData, TreeProps, CustomNodeProps, CustomEdgeProps };
