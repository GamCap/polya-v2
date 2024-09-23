"use client";

import React, { useState, useEffect } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { ViewUpdate } from "@codemirror/view";
import { useTheme } from "next-themes";
import { useParams, useRouter } from "next/navigation";
import {
  useQueryData,
  useUpdateQuery,
  useCreateExecution,
  useCreateQuery,
} from "@/hooks/useData";

const CodeEditor: React.FC = () => {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();

  const queryId = params.queryId ? Number(params.queryId) : null;

  const [queryText, setQueryText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { data: queryData } = useQueryData(queryId);

  useEffect(() => {
    if (queryData) {
      setQueryText(queryData.query);
    }
  }, [queryData]);

  const createQueryMutation = useCreateQuery();
  const updateQueryMutation = useUpdateQuery();
  const createExecutionMutation = useCreateExecution();

  const handleChange = (value: string, viewUpdate: ViewUpdate) => {
    setQueryText(value);
  };

  const executeQuery = async () => {
    if (!queryText.trim()) {
      alert("Please enter a valid SQL query.");
      return;
    }

    setLoading(true);

    try {
      if (!queryId) {
        const name = `Query ${Date.now()}`;
        const data = await createQueryMutation.mutateAsync({
          name,
          sql: queryText,
        });

        if (!data.queryId || !data.visualizationId) {
          throw new Error("Invalid response from the server.");
        }

        router.replace(`/queries/${data.queryId}/${data.visualizationId}`);
      } else {
        await updateQueryMutation.mutateAsync({
          queryId,
          newQueryContent: queryText,
        });
        const executionData = await createExecutionMutation.mutateAsync({
          queryId,
          sql: queryText,
        });

        if (!executionData.executionId) {
          throw new Error("Failed to create execution.");
        }

        alert("Query executed successfully!");
      }
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "An error occurred while executing the query."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <ReactCodeMirror
        value={queryText}
        extensions={[sql()]}
        onChange={handleChange}
        height="100%"
        className="scrollbar w-full h-full"
        theme={theme === "dark" ? "dark" : "light"}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
        }}
      />
      <EditorControls onRun={executeQuery} loading={loading} />
    </div>
  );
};

interface EditorControlsProps {
  onRun: () => void;
  loading: boolean;
}

const EditorControls: React.FC<EditorControlsProps> = ({ onRun, loading }) => {
  return (
    <div className="flex flex-row gap-2 w-full justify-end bg-[#f5f5f5] dark:bg-[#282c34] border-t border-[#ddd] dark:border-none p-2">
      <button
        className={`btn btn-primary ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={onRun}
        disabled={loading}
      >
        {loading ? "Executing..." : "Run"}
      </button>
    </div>
  );
};

export default CodeEditor;
