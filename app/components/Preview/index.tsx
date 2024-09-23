"use client";

import React from "react";
import { Table } from "@/components/Table";
import { Visualization, Execution } from "@/types";

interface PreviewProps {
  visualization: Visualization;
  execution: Execution;
}

const Preview: React.FC<PreviewProps> = ({ visualization, execution }) => {
  return (
    <div className="p-4 w-full h-full flex flex-col">
      {visualization && execution && (
        <div className="flex-1 overflow-auto">
          {visualization.type === "table" ? (
            <Table
              data={execution.result}
              columns={visualization.options.columns}
              pageSize={visualization.options.pageSize}
            />
          ) : (
            <div>Unsupported visualization type.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Preview;
