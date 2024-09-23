"use client";

import React, { useState } from "react";
import { Mosaic, MosaicNode, MosaicWindow } from "react-mosaic-component";
import CodeEditor from "@/components/CodeMirror";
import Preview from "@/components/Preview";
import { useParams, useRouter } from "next/navigation";
import {
  useQueryData,
  useVisualizations,
  useLatestExecution,
} from "@/hooks/useData";

const QueriesLayout: React.FC = () => {
  const params = useParams();
  const router = useRouter();

  const queryId = params.queryId ? Number(params.queryId) : null;
  const visualizationId = params.visualizationId
    ? Number(params.visualizationId)
    : null;

  const { data: queryData } = useQueryData(queryId);
  const { data: visualizations = [] } = useVisualizations(queryId);
  const executionIds = queryData?.executions || [];
  const latestExecutionId =
    executionIds.length > 0 ? executionIds[executionIds.length - 1] : null;
  const { data: execution } = useLatestExecution(latestExecutionId);
  const [mosaicLayout, setMosaicLayout] = useState<MosaicNode<string> | null>({
    direction: "row",
    splitPercentage: 20,
    first: "Data Sources",
    second: {
      direction: "row",
      splitPercentage: 80,
      first: {
        direction: "column",
        splitPercentage: 70,
        first: "Code Editor",
        second: "Preview",
      },
      second: "React-flow Overview",
    },
  });

  const currentVisualization =
    visualizations.find((v) => v.id === visualizationId) || visualizations[0];

  const handleVisualizationClick = (vizId: number) => {
    if (vizId === currentVisualization?.id) return;
    router.replace(`/queries/${queryId}/${vizId}`);
  };

  const handleMosaicChange = (newLayout: MosaicNode<string> | null) => {
    setMosaicLayout(newLayout);
  };

  const renderTile = (id: string, path: any) => {
    let content: React.ReactNode;
    let toolbarControls: React.ReactNode[] = [];

    switch (id) {
      case "Code Editor":
        content = <CodeEditor />;
        break;
      case "Data Sources":
        content = (
          <div className="p-4">
            <p>Data sources content</p>
          </div>
        );
        break;
      case "Preview":
        if (!currentVisualization) {
          content = <p className="p-4">No visualizations available.</p>;
        } else if (!execution) {
          content = <p className="p-4">No execution data available.</p>;
        } else {
          content = (
            <Preview
              visualization={currentVisualization}
              execution={execution}
            />
          );
        }

        toolbarControls = visualizations.map((viz) => (
          <button
            key={viz.id}
            onClick={() => handleVisualizationClick(viz.id)}
            className={`px-4 py-2 rounded ${
              viz.id === currentVisualization?.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            } hover:bg-blue-500 hover:text-white transition`}
            aria-pressed={viz.id === currentVisualization?.id}
          >
            {viz.name}
          </button>
        ));
        break;
      case "React-flow Overview":
        content = (
          <div className="p-4">
            <p>React-flow Overview content</p>
          </div>
        );
        break;
      default:
        content = (
          <div className="p-4">
            <p>Your content for {id} goes here.</p>
          </div>
        );
    }

    return (
      <MosaicWindow<string>
        title={id}
        path={path}
        createNode={() => "new"}
        toolbarControls={id === "Preview" ? toolbarControls : []}
      >
        {content}
      </MosaicWindow>
    );
  };

  return (
    <div className="h-screen">
      <Mosaic<string>
        renderTile={renderTile}
        value={mosaicLayout}
        onChange={handleMosaicChange}
      />
    </div>
  );
};

export default QueriesLayout;
