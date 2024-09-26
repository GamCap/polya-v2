"use client";

import React, { useState, useEffect } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { EditorView, ViewUpdate, keymap } from "@codemirror/view";
import { acceptCompletion, completionStatus } from '@codemirror/autocomplete';
import {indentMore, indentLess} from "@codemirror/commands"
import { useTheme } from "next-themes";
import { useParams, useRouter } from "next/navigation";
import { useQueryDetails } from "@/hooks/supabase/useQueryDetails";
import { useCreateQuery } from "@/hooks/supabase/useCreateQuery";
import { useUpdateQuery } from "@/hooks/supabase/useUpdateQuery";
import { Button } from "../ui/Button";

const CodeEditor: React.FC = () => {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();

  const queryId = params.queryId ? params.queryId as string : null;

  const [queryText, setQueryText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { data: queryData } = useQueryDetails(queryId || "");

  useEffect(() => {
    if (queryData) {
      setQueryText(queryData.query);
    }
  }, [queryData]);

  const createQueryMutation = useCreateQuery();
  const updateQueryMutation = useUpdateQuery();

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
        const data = await createQueryMutation.mutateAsync({
          userId: "1b415c6a-277f-41f9-92ae-dcc76d9c961d",
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

  const customKeymap = keymap.of([
    {
      key: 'Tab',
      shift: indentLess,
      run: (view: EditorView) => {
        //if the completion is active, accept the completion, otherwise insert a tab
        if (completionStatus(view.state) === "active") {
          acceptCompletion(view);
        } else {
         indentMore(view);
        }
        return true;
      }

    },
  ]);

  return (
    <div className="flex flex-col w-full h-full">
      <ReactCodeMirror
        indentWithTab={false}
        value={queryText}
        extensions={[sql(), customKeymap]}
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
      <Button
        variant="subtle"
        size="xsmall"
        onClick={onRun}
        disabled={loading}
      >
        {loading ? "Executing..." : "Run"}
      </Button>
    </div>
  );
};

export default CodeEditor;
