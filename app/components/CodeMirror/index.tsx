"use client";

import React, { useState, useEffect, useMemo } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { EditorView, ViewUpdate, keymap } from "@codemirror/view";
import { acceptCompletion, completionStatus } from "@codemirror/autocomplete";
import { indentMore, indentLess } from "@codemirror/commands";
import { useTheme } from "next-themes";
import { useParams, useRouter } from "next/navigation";
import { useQueryDetails } from "@/hooks/supabase/useQueryDetails";
import { useCreateQuery } from "@/hooks/supabase/useCreateQuery";
import { useUpdateQuery } from "@/hooks/supabase/useUpdateQuery";
import { useDataSources } from "@/hooks/supabase/useDataSources";
import { Button } from "../ui/Button";

const CodeEditor: React.FC = () => {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();

  const queryId = params.queryId ? (params.queryId as string) : null;

  const [queryText, setQueryText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [lastExecutionDate, setLastExecutionDate] = useState<Date | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);

  const { data: queryData } = useQueryDetails(queryId || "");
  const { data: dataSources } = useDataSources();

  useEffect(() => {
    if (queryData) {
      setQueryText(queryData.query);
      const lastExecution =
        queryData.executions[queryData.executions.length - 1];
      if (lastExecution) {
        setLastExecutionDate(new Date(lastExecution.executedAt));
      }
    }
  }, [queryData]);

  const createQueryMutation = useCreateQuery();
  const updateQueryMutation = useUpdateQuery();

  const handleChange = (value: string, viewUpdate: ViewUpdate) => {
    setQueryText(value);
  };

  const executeQuery = async () => {
    try {
      if (!queryText.trim()) {
        throw new Error("Query is empty.");
      }
      setLoading(true);
      setExecutionError(null);

      if (!queryId) {
        const data = await createQueryMutation.mutateAsync({
          userId: "6d937336-daf2-4412-9949-c3b59ef73d3a",
          query: queryText,
        });

        if (!data.query_id || !data.visualization_id) {
          throw new Error("Invalid response from the server.");
        }

        router.replace(`/queries/${data.query_id}/${data.visualization_id}`);
      } else {
        const updateData = await updateQueryMutation.mutateAsync({
          queryId,
          query: queryText,
        });

        if (!updateData.execution_id) {
          throw new Error("Failed to create execution.");
        }
      }
    } catch (error: any) {
      console.error(error);
      console.log(error.message);
      setExecutionError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const customKeymap = keymap.of([
    {
      key: "Tab",
      shift: indentLess,
      run: (view: EditorView) => {
        if (completionStatus(view.state) === "active") {
          acceptCompletion(view);
        } else {
          indentMore(view);
        }
        return true;
      },
    },
  ]);

  const mySchema = useMemo(() => {
    if (!dataSources) return undefined;

    const schema: Record<string, any> = {
      ethereum: {},
    };

    dataSources.forEach((table) => {
      const tableName = table.table_name;
      const columnNames = table.columns.map((column) => column.column_name);
      schema.ethereum[tableName] = columnNames;
    });

    return {
      ...schema,
    };
  }, [dataSources]);

  //TODO: add default schema and table to global state to change it from the UI (data sources component)
  const extensions = useMemo(() => {
    return [
      sql({
        schema: mySchema,
        defaultSchema: "ethereum",
        defaultTable: "blocks",
      }),
      customKeymap,
    ];
  }, [mySchema, customKeymap]);

  return (
    <div className="flex flex-col w-full h-full">
      <ReactCodeMirror
        indentWithTab={false}
        value={queryText}
        extensions={extensions}
        onChange={handleChange}
        height="100%"
        className="scrollbar w-full h-full text-title-12-auto-regular"
        theme={theme === "dark" ? "dark" : "light"}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
        }}
      />
      <EditorControls
        onRun={executeQuery}
        loading={loading}
        error={executionError}
        lastExecutionDate={lastExecutionDate}
      />
    </div>
  );
};

interface EditorControlsProps {
  onRun: () => void;
  loading: boolean;
  error: string | null;
  lastExecutionDate: Date | null;
}

const EditorControls: React.FC<EditorControlsProps> = ({
  onRun,
  loading,
  error,
  lastExecutionDate,
}) => {
  return (
    <div className="flex flex-row items-center gap-2 w-full justify-end bg-[#f5f5f5] dark:bg-[#282c34] border-t border-[#ddd] dark:border-none p-2">
      <div className="flex-grow text-right text-basic-10-auto-regular">
        {loading ? (
          <span>Executing...</span>
        ) : error ? (
          <span className="text-accent-red">{error}</span>
        ) : lastExecutionDate ? (
          <span>
            Last executed at:{" "}
            {lastExecutionDate.toLocaleDateString("en-US", {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        ) : (
          <span></span>
        )}
      </div>
      <Button variant="subtle" size="xsmall" onClick={onRun} disabled={loading}>
        Run
      </Button>
    </div>
  );
};

export default CodeEditor;
