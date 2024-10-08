"use client";
import { supabaseBrowser } from "@/supabase/browser";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateQueryInput {
  queryId: string;
  query: string;
}

export const useUpdateQuery = () => {
  const queryClient = useQueryClient();
  const supabase = supabaseBrowser();

  return useMutation({
    mutationFn: async ({ queryId, query }: UpdateQueryInput) => {
      const { data, error } = await supabase.rpc(
        "update_query_and_create_execution",
        {
          p_query_id: queryId,
          p_query_text: query,
        }
      );

      if (error) {
        throw error;
      }

      return data[0];
    },

    onSuccess: (_, { queryId }) => {
      queryClient.invalidateQueries({ queryKey: ["queriesList"] });
      queryClient.invalidateQueries({ queryKey: ["queryDetails", queryId] });
    },
  });
};
