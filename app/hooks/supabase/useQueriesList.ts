"use client";
import { supabaseBrowser } from "@/supabase/browser";
import { Query } from "@/types/supabase";
import { useQuery } from "@tanstack/react-query";

interface QueryItem extends Query {
  firstVisualizationId: string | null;
}

export const useQueriesList = () =>
  useQuery<QueryItem[], Error>({
    queryKey: ["queriesList"],
    queryFn: async () => {
      const supabase = supabaseBrowser();
      const { data, error } = await supabase.from("Query").select(
        `
        *,
        visualizations:Visualization(id)
      `
      );

      if (error) {
        throw error;
      }

      if (!data) {
        return [];
      }

      const queries = data.map((query: any) => ({
        id: query.id,
        name: query.name,
        query: query.query,
        createdAt: query.created_at,
        updatedAt: query.updated_at,
        owner: query.owner,
        firstVisualizationId: query.visualizations?.[0]?.id || null,
      }));

      return queries;
    },
  });
