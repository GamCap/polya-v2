import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Query, Execution } from "@/types";
import { Visualization } from "@/types/visualization";

export const useQueryData = (queryId: number | null) => {
  return useQuery<Query | null>({
    queryKey: ["query", queryId],
    queryFn: async () => {
      if (!queryId) return null;
      const response = await fetch(`/api/queries/${queryId}`);
      if (!response.ok) throw new Error("Failed to fetch query.");
      return response.json();
    },
    enabled: !!queryId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      queryId,
      newQueryContent,
    }: {
      queryId: number;
      newQueryContent: string;
    }) => {
      const response = await fetch(`/api/queries/${queryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: newQueryContent }),
      });
      if (!response.ok) throw new Error("Failed to update query.");
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["query", variables.queryId] });
    },
  });
};

export const useCreateExecution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ queryId, sql }: { queryId: number; sql: string }) => {
      const response = await fetch(`/api/queries/${queryId}/executions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql }),
      });
      if (!response.ok) throw new Error("Failed to create execution.");
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["query", variables.queryId] });
      queryClient.invalidateQueries({
        queryKey: ["execution", data.executionId],
      });
    },
  });
};

export const useLatestExecution = (executionId: number | null) => {
  return useQuery<Execution | null>({
    queryKey: ["execution", executionId],
    queryFn: async () => {
      if (!executionId) return null;
      const response = await fetch(`/api/executions/${executionId}`);
      if (!response.ok) throw new Error("Failed to fetch execution.");
      return response.json();
    },
    enabled: !!executionId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useVisualizations = (queryId: number | null) => {
  return useQuery<Visualization[]>({
    queryKey: ["visualizations", queryId],
    queryFn: async () => {
      if (!queryId) return [];
      const response = await fetch(`/api/queries/${queryId}/visualizations`);
      if (!response.ok) throw new Error("Failed to fetch visualizations.");
      return response.json();
    },
    enabled: !!queryId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, sql }: { name: string; sql: string }) => {
      const response = await fetch("/api/queries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, query: sql }),
      });
      if (!response.ok) throw new Error("Failed to create query.");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["queries"] });
    },
  });
};

export const useQueries = () => {
  return useQuery<Query[]>({
    queryKey: ["queries"],
    queryFn: async () => {
      const response = await fetch("/api/queries");
      if (!response.ok) throw new Error("Failed to fetch queries.");
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
};
