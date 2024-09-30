// Preview.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Table } from "@/components/Table";
import { Visualization, Execution } from "@/types/supabase";
import { debounce } from "lodash";
import { useUpdateVisualizationOptions } from "@/hooks/supabase/useUpdateVisualizationOptions";

interface PreviewProps {
  visualization: Visualization;
  execution: Execution;
}

const Preview: React.FC<PreviewProps> = ({ visualization, execution }) => {
  const [localOptions, setLocalOptions] = useState(visualization.options);

  const { mutate: updateVisualizationOptions } =
    useUpdateVisualizationOptions();

  const debouncedUpdateVisualizationOptions = useMemo(
    () =>
      debounce((options: any, visId: string) => {
        updateVisualizationOptions({
          visualizationId: visId,
          options,
        });
      }, 500),

    [updateVisualizationOptions]
  );

  useEffect(() => {
    debouncedUpdateVisualizationOptions(localOptions, visualization.id);
    return () => {
      debouncedUpdateVisualizationOptions.cancel();
    };
  }, [debouncedUpdateVisualizationOptions, localOptions, visualization.id]);

  const handleUpdateColumnVisibility = (columnId: string, visible: boolean) => {
    const updatedColumns = localOptions.columns.map((col) =>
      col.id === columnId ? { ...col, visible: visible } : col
    );
    setLocalOptions({ ...localOptions, columns: updatedColumns });
  };

  const handleUpdateColumnLabel = (columnId: string, newLabel: string) => {
    const updatedColumns = localOptions.columns.map((col) =>
      col.id === columnId ? { ...col, label: newLabel } : col
    );
    setLocalOptions({ ...localOptions, columns: updatedColumns });
  };

  return (
    <div className="p-4 w-full h-full flex flex-col">
      {visualization && execution && (
        <div className="flex-1 overflow-auto">
          {visualization.type === "table" ? (
            <Table
              data={execution.result}
              columns={localOptions.columns}
              pageSize={localOptions.pageSize}
              onUpdateColumnVisibility={handleUpdateColumnVisibility}
              onUpdateColumnLabel={handleUpdateColumnLabel}
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
