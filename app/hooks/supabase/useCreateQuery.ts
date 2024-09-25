"use client";
import { supabaseBrowser } from "@/supabase/browser";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateQuery = () => {
  const queryClient = useQueryClient();
  const supabase = supabaseBrowser();
  return useMutation({
    mutationFn: async ({
      userId,
      query,
    }: {
      userId: string;
      query: string;
    }) => {
      const { data, error } = await supabase.rpc("create_new_query", {
        p_owner: userId,
        p_query_text: query,
      });

      if (error) {
        throw error;
      }

      return data[0];
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queriesList"] });
    },
  });
};
